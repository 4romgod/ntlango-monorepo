import {Express} from 'express';
import {ServerContext, createGraphQlServer} from '../../lib/server';
import {ApolloServer} from '@apollo/server';
import request from 'supertest';
import {usersMockData} from '../../lib/mongodb/mockData';
import {API_DOMAIN, API_PATH} from '../../lib/constants';
import {Server} from 'http';
import {getCreateUserMutation, getUpdateUserMutation} from '../../lib/utils';
import {UserDAO} from '../../lib/mongodb/dao';
import {CreateUserInputType, UpdateUserInputType, UserType} from '../../lib/graphql/types';
import {ERROR_MESSAGES} from '../../lib/utils/validators';

// https://www.apollographql.com/docs/apollo-server/testing/testing/
describe('User Resolver', () => {
    let expressApp: Express;
    let apolloServer: ApolloServer<ServerContext>;
    let httpServer: Server;
    const TEST_PORT = 1000;
    const url = `${API_DOMAIN}:${TEST_PORT}${API_PATH}`;
    const testUserEmail = 'test@example.com';
    const testUsername = 'testUsername';

    const createUserInput: CreateUserInputType = {
        ...usersMockData.at(0)!,
        email: testUserEmail,
        username: testUsername,
    };

    beforeAll(() => {
        const initializeServer = async () => {
            const createServerResults = await createGraphQlServer({port: TEST_PORT});
            expressApp = createServerResults.expressApp;
            apolloServer = createServerResults.apolloServer;
            httpServer = createServerResults.httpServer;
        };
        return initializeServer();
    });

    afterAll(() => {
        const terminateServer = async () => {
            apolloServer.stop();
            httpServer.close();
        };
        return terminateServer();
    });

    describe('Positive', () => {
        describe('createUser Mutation', () => {
            afterEach(async () => {
                await UserDAO.deleteUserByEmail(testUserEmail);
            });

            it('should create new user when valid input is provided', async () => {
                const createUserMutation = getCreateUserMutation(createUserInput);

                const createUserResponse = await request(url).post('').send(createUserMutation);
                expect(createUserResponse.status).toBe(200);
                expect(createUserResponse.error).toBeFalsy();

                const createdUser = createUserResponse.body.data.createUser;

                expect(createdUser).toHaveProperty('id');
                expect(createdUser.email).toBe(testUserEmail);
            });
        });

        describe('updateUser Mutation', () => {
            it('should update a user when valid input is provided', async () => {
                const createdUser = await UserDAO.create(createUserInput);

                const newEmail = 'updated@email.com';
                const updateUserInput = getUpdateUserMutation({
                    ...createUserInput,
                    id: createdUser.id,
                    email: newEmail,
                });

                const updateUserResponse = await request(url).post('').send(updateUserInput);
                expect(updateUserResponse.status).toBe(200);
                expect(updateUserResponse.error).toBeFalsy();

                const updatedUser = updateUserResponse.body.data.updateUser;

                expect(updatedUser).toHaveProperty('id');
                expect(updatedUser.email).toBe(newEmail);

                // cleanup
                await UserDAO.deleteUserByEmail(newEmail);
            });
        });
    });

    describe('Negative', () => {
        describe('createUser Mutation', () => {
            /**
             * Tests variations
             * 1. user creates runs into conflicts with other existing items
             * 2. user enters correct schema, but invalid values (handled by zod schema)
             * 3. user enters incorrect input schema (e.g. leaves out a required attribute)
             * 4. user tries calling an invalid operation (expect GRAPHQL_VALIDATION_FAILED) (this doesn't fit here)
             * text: '{"errors":[{"message":"GraphQL operations must contain a non-empty `query` or a `persistedQuery` extension.","extensions":{"code":"BAD_REQUEST"}}]}\n',
             *
             */
            it('should throw CONFLICT error when unique attribute already exists', async () => {
                const createUserMutation = getCreateUserMutation(createUserInput);

                const createUserResponse = await request(url).post('').send(createUserMutation);
                expect(createUserResponse.status).toBe(200);
                expect(createUserResponse.error).toBeFalsy();

                const createAnotherUserResponse = await request(url).post('').send(createUserMutation);
                expect(createAnotherUserResponse.error).toBeTruthy();
                expect(createAnotherUserResponse.status).toBe(409);

                // cleanup
                await UserDAO.deleteUserByEmail(testUserEmail);
            });

            it('should throw BAD_USER_INPUT error when invalid input is provided, but the input type schema is valid', async () => {
                const invalidPhoneNumber = 'mockPhoneNumber';
                const createUserMutation = getCreateUserMutation({
                    ...createUserInput,
                    phone_number: invalidPhoneNumber,
                });

                const createUserResponse = await request(url).post('').send(createUserMutation);
                expect(createUserResponse.error).toBeTruthy();
                expect(createUserResponse.status).toBe(400);
                expect(createUserResponse.body.errors[0].message).toBe(ERROR_MESSAGES.INVALID_PHONE_NUMBER);
            });

            it('should throw error when invalid input schema is provided', async () => {
                const invalidCreateUserMutation = getCreateUserMutation({
                    ...createUserInput,
                    email: null,
                });

                const createUserResponse = await request(url).post('').send(invalidCreateUserMutation);
                expect(createUserResponse.error).toBeTruthy();
                expect(createUserResponse.status).toBe(400);
                expect(createUserResponse.status).toBe(400);
            });
        });

        /**
         * Tests variations
         * 1. user updates runs into conflicts with other existing items XX
         * 2. user enters correct schema, but invalid values (handled by zod schema) XX
         * 3. user enters correct schema, but id does not exist (gets a 404) XX
         * 4. user enters correct schema, but id is invalid (gets a 404) XX
         * 5. user enters incorrect input schema (e.g. adds a non existing attribute attribute) XX
         * 6. user tries calling an invalid operation (expect GRAPHQL_VALIDATION_FAILED) (this doesn't fit here)
         * text: '{"errors":[{"message":"GraphQL operations must contain a non-empty `query` or a `persistedQuery` extension.","extensions":{"code":"BAD_REQUEST"}}]}\n',
         *
         */
        describe('updateUser Mutation', () => {
            let createdUser: UserType;
            beforeEach(async () => {
                createdUser = await UserDAO.create(createUserInput);
            });

            afterEach(async () => {
                await UserDAO.deleteUserByEmail(testUserEmail);
            });

            it('should throw CONFLICT error when unique attribute already exists', async () => {
                let anotherCreatedUser: UserType;
                const anotherTestEmail = 'updated@email.net';
                try {
                    anotherCreatedUser = await UserDAO.create({...createUserInput, email: anotherTestEmail, username: 'updatedUser'}); // another user for conflict
                } catch (error) {
                    fail('it should not reach here');
                }

                const updateUserInput: UpdateUserInputType = {
                    id: anotherCreatedUser.id,
                    email: testUserEmail,
                };
                const updateUserResponse = await request(url).post('').send(getUpdateUserMutation(updateUserInput));
                expect(updateUserResponse.error).toBeTruthy();
                expect(updateUserResponse.status).toBe(409);

                // cleanup
                await UserDAO.deleteUserByEmail(anotherTestEmail);
            });

            it('should throw BAD_USER_INPUT error when invalid input is provided, but the input type schema is valid', async () => {
                const invalidPhoneNumber = 'mockPhoneNumber';
                const updateUserInput: UpdateUserInputType = {
                    id: createdUser.id,
                    phone_number: invalidPhoneNumber,
                };

                const updateUserResponse = await request(url).post('').send(getUpdateUserMutation(updateUserInput));
                expect(updateUserResponse.error).toBeTruthy();
                expect(updateUserResponse.status).toBe(400);
                expect(updateUserResponse.body.errors[0].message).toBe(ERROR_MESSAGES.INVALID_PHONE_NUMBER);
            });

            it('should throw NOT_FOUND error when valid input is provided, but the user does not exist', async () => {
                const mockId = '62a23958e5a9e9b88f853a67';
                const updateUserInput: UpdateUserInputType = {
                    id: mockId,
                    given_name: 'updatedName',
                };

                const updateUserResponse = await request(url).post('').send(getUpdateUserMutation(updateUserInput));
                expect(updateUserResponse.error).toBeTruthy();
                expect(updateUserResponse.status).toBe(404);
                expect(updateUserResponse.body.errors[0].message).toBe(ERROR_MESSAGES.NOT_FOUND('User', 'ID', mockId));
            });

            it('should throw NOT_FOUND error when an invalid mongodb id is entered', async () => {
                const mockId = 'mockId';
                const updateUserInput: UpdateUserInputType = {
                    id: mockId,
                    given_name: 'updatedName',
                };

                const updateUserResponse = await request(url).post('').send(getUpdateUserMutation(updateUserInput));
                expect(updateUserResponse.error).toBeTruthy();
                expect(updateUserResponse.status).toBe(404);
                expect(updateUserResponse.body.errors[0].message).toBe(ERROR_MESSAGES.NOT_FOUND('User', 'ID', mockId));
            });

            it('should throw BAD_USER_INPUT error when invalid input type is provided', async () => {
                const updateUserInput = {
                    id: createdUser.id,
                    non_existing_param: 'mockParam',
                };

                const updateUserResponse = await request(url).post('').send(getUpdateUserMutation(updateUserInput));
                expect(updateUserResponse.error).toBeTruthy();
                expect(updateUserResponse.status).toBe(400);
                expect(updateUserResponse.body.errors[0].extensions.code).toBe('BAD_USER_INPUT');
            });
        });
    });
});
