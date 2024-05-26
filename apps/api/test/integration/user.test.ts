import {Express} from 'express';
import {ServerContext, createGraphQlServer} from '../../lib/server';
import {ApolloServer} from '@apollo/server';
import request from 'supertest';
import {usersMockData} from '../../lib/mongodb/mockData';
import {API_DOMAIN, API_PATH} from '../../lib/constants';
import {Server} from 'http';
import {getCreateUserMutation, getUpdateUserMutation} from '../../lib/utils';
import {UserDAO} from '../../lib/mongodb/dao';

// https://www.apollographql.com/docs/apollo-server/testing/testing/
describe('User Resolver', () => {
    let expressApp: Express;
    let apolloServer: ApolloServer<ServerContext>;
    let httpServer: Server;
    const TEST_PORT = 1000;
    const url = `${API_DOMAIN}:${TEST_PORT}${API_PATH}`;
    const testUserEmail = 'test@example.com';
    const testUsername = 'testUsername';

    const createUserInput = getCreateUserMutation({
        ...usersMockData.at(0)!,
        email: testUserEmail,
        username: testUsername,
    });

    beforeAll(async () => {
        const createServerResults = await createGraphQlServer({port: TEST_PORT});
        expressApp = createServerResults.expressApp;
        apolloServer = createServerResults.apolloServer;
        httpServer = createServerResults.httpServer;
    });

    afterAll(async () => {
        apolloServer.stop();
        httpServer.close();
    });

    describe('Positive', () => {
        describe('createUser Mutation', () => {
            afterEach(async () => {
                await UserDAO.deleteUserByEmail(testUserEmail);
            });

            it('should create new user when valid input is provided', async () => {
                const createUserResponse = await request(url).post('').send(createUserInput);
                console.log('createUserResponse', createUserResponse);
                expect(createUserResponse.status).toBe(200);
                expect(createUserResponse.error).toBeFalsy();

                const createdUser = createUserResponse.body.data.createUser;

                expect(createdUser).toHaveProperty('id');
                expect(createdUser.email).toBe(testUserEmail);
            });

            it('should update a user when valid input is provided', async () => {
                const createUserResponse = await request(url).post('').send(createUserInput);
                expect(createUserResponse.status).toBe(200);
                expect(createUserResponse.error).toBeFalsy();

                const createdUser = createUserResponse.body.data.createUser;

                expect(createdUser).toHaveProperty('id');
                expect(createdUser.family_name).not.toBe('Bond');

                const updateUserInput = getUpdateUserMutation({
                    ...usersMockData.at(0)!,
                    id: createdUser.id,
                    email: testUserEmail,
                    username: testUsername,
                    family_name: 'Bond',
                });

                const updateUserResponse = await request(url).post('').send(updateUserInput);
                expect(updateUserResponse.status).toBe(200);
                expect(updateUserResponse.error).toBeFalsy();

                const updatedUser = updateUserResponse.body.data.updateUser;

                expect(updatedUser).toHaveProperty('id');
                expect(updatedUser.family_name).toBe('Bond');
            });
        });
    });

    describe('Negative', () => {
        describe('createUser Mutation', () => {
            it('should throw error when user already exists', async () => {
                const createUserResponse = await request(url).post('').send(createUserInput);
                expect(createUserResponse.status).toBe(200);
                expect(createUserResponse.error).toBeFalsy();

                const createAnotherUserResponse = await request(url).post('').send(createUserInput);
                expect(createAnotherUserResponse.error).toBeTruthy();
                expect(createAnotherUserResponse.status).toBe(409);

                // cleanup
                await UserDAO.deleteUserByEmail(testUserEmail);
            });
        });
    });
});
