import {Express} from 'express';
import {ServerContext, createGraphQlServer} from '@/server';
import {ApolloServer} from '@apollo/server';
import request from 'supertest';
import {usersMockData} from '@/mongodb/mockData';
import {API_DOMAIN, GRAPHQL_API_PATH} from '@/constants';
import {Server} from 'http';
import {
    getCreateUserMutation,
    getLoginUserMutation,
    getUpdateUserMutation,
    getDeleteUserByIdMutation,
    getReadUsersWithoutOptionsQuery,
    getReadUserByIdQuery,
    getDeleteUserByEmailMutation,
    getDeleteUserByUsernameMutation,
    getReadUsersWithOptionsQuery,
    getReadUserByEmailQuery,
    getReadUserByUsernameQuery,
} from '@/test/utils';
import {UserDAO} from '@/mongodb/dao';
import {CreateUserInputType, Gender, QueryOptionsInput, UserType, UserWithTokenType} from '@/graphql/types';
import {ERROR_MESSAGES} from '@/validation';
import {verifyToken} from '@/utils/auth';

describe('User Resolver', () => {
    let expressApp: Express;
    let apolloServer: ApolloServer<ServerContext>;
    let httpServer: Server;
    const TEST_PORT = 1000;
    const url = `${API_DOMAIN}:${TEST_PORT}${GRAPHQL_API_PATH}`;
    const testUserEmail = 'test@example.com';
    const testUsername = 'testUsername';
    const testPassword = 'testPassword';

    const createUserInput: CreateUserInputType = {
        ...usersMockData.at(0)!,
        email: testUserEmail,
        username: testUsername,
        password: testPassword,
    };

    beforeAll(() => {
        const initialSetup = async () => {
            const createServerResults = await createGraphQlServer({port: TEST_PORT});
            expressApp = createServerResults.expressApp;
            apolloServer = createServerResults.apolloServer;
            httpServer = createServerResults.httpServer;
        };
        return initialSetup();
    });

    afterAll(() => {
        const cleanup = async () => {
            apolloServer.stop();
            httpServer.close();
        };
        return cleanup();
    });

    describe('Positive', () => {
        describe('createUser Mutation', () => {
            afterEach(async () => {
                await UserDAO.deleteUserByEmail(testUserEmail);
            });

            it('should create new user when valid input is provided', async () => {
                console.log('createUser Mutation');
                const createUserMutation = getCreateUserMutation(createUserInput);

                const createUserResponse = await request(url).post('').send(createUserMutation);
                expect(createUserResponse.status).toBe(200);
                expect(createUserResponse.error).toBeFalsy();

                const createdUser = createUserResponse.body.data.createUser;

                expect(createdUser).toHaveProperty('userId');
                expect(createdUser.email).toBe(testUserEmail);
            });
        });

        describe('loginUser Mutation', () => {
            let createdUser: UserWithTokenType;
            beforeEach(async () => {
                createdUser = await UserDAO.create(createUserInput);
            });

            afterEach(async () => {
                await UserDAO.deleteUserByEmail(testUserEmail);
            });

            it('should login a user when valid input is provided', async () => {
                const loginUserMutation = getLoginUserMutation({
                    email: testUserEmail,
                    password: testPassword,
                });
                const loginUserResponse = await request(url).post('').send(loginUserMutation);
                expect(loginUserResponse.status).toBe(200);
                expect(loginUserResponse.error).toBeFalsy();

                const tokenData = loginUserResponse.body.data.loginUser.token;
                const decodedUser = verifyToken(tokenData) as UserType;
                expect(decodedUser.userId).toBe(createdUser.userId);
            });
        });

        describe('updateUser Mutation', () => {
            const updatedEmail = 'updated@email.com';
            let createdUser: UserWithTokenType;

            beforeEach(async () => {
                createdUser = await UserDAO.create(createUserInput);
            });

            afterEach(async () => {
                await UserDAO.deleteUserByEmail(updatedEmail);
            });

            it('should update a user when valid input is provided', async () => {
                const updateUserMutation = getUpdateUserMutation({
                    ...createUserInput,
                    userId: createdUser.userId,
                    email: updatedEmail,
                });

                const updateUserResponse = await request(url).post('').set('token', createdUser.token).send(updateUserMutation);
                expect(updateUserResponse.status).toBe(200);
                expect(updateUserResponse.error).toBeFalsy();

                const updatedUser = updateUserResponse.body.data.updateUser;

                expect(updatedUser).toHaveProperty('userId');
                expect(updatedUser.email).toBe(updatedEmail);
            });
        });

        describe('Delete User Mutation', () => {
            let createdUser: UserWithTokenType;
            beforeEach(async () => {
                createdUser = await UserDAO.create(createUserInput);
            });

            it('should delete a user by userId', async () => {
                const deleteUserMutation = getDeleteUserByIdMutation(createdUser.userId);

                const deleteUserResponse = await request(url).post('').set('token', createdUser.token).send(deleteUserMutation);
                expect(deleteUserResponse.status).toBe(200);
                expect(deleteUserResponse.error).toBeFalsy();

                const deletedUser = deleteUserResponse.body.data.deleteUserById;

                expect(deletedUser).toHaveProperty('userId');
                expect(deletedUser.email).toBe(testUserEmail);
            });

            it('should delete a user by email', async () => {
                const deleteUserMutation = getDeleteUserByEmailMutation(createdUser.email);

                const deleteUserResponse = await request(url).post('').set('token', createdUser.token).send(deleteUserMutation);
                expect(deleteUserResponse.status).toBe(200);
                expect(deleteUserResponse.error).toBeFalsy();

                const deletedUser = deleteUserResponse.body.data.deleteUserByEmail;

                expect(deletedUser).toHaveProperty('userId');
                expect(deletedUser.email).toBe(testUserEmail);
            });

            it('should delete a user by username', async () => {
                const deleteUserMutation = getDeleteUserByUsernameMutation(createdUser.username);

                const deleteUserResponse = await request(url).post('').set('token', createdUser.token).send(deleteUserMutation);
                expect(deleteUserResponse.status).toBe(200);
                expect(deleteUserResponse.error).toBeFalsy();

                const deletedUser = deleteUserResponse.body.data.deleteUserByUsername;

                expect(deletedUser).toHaveProperty('userId');
                expect(deletedUser.email).toBe(testUserEmail);
            });
        });

        describe('Read User Query', () => {
            let createdUser: UserWithTokenType;
            beforeEach(async () => {
                createdUser = await UserDAO.create(createUserInput);
            });

            afterEach(async () => {
                await UserDAO.deleteUserByEmail(testUserEmail);
            });

            it('should retrieve user by userId', async () => {
                const readUserQuery = getReadUserByIdQuery(createdUser.userId);

                const readUserResponse = await request(url).post('').send(readUserQuery);
                expect(readUserResponse.status).toBe(200);
                expect(readUserResponse.error).toBeFalsy();

                const retrievedUser = readUserResponse.body.data.readUserById;
                expect(retrievedUser).toBeTruthy();
                expect(retrievedUser).toHaveProperty('userId');
                expect(retrievedUser.email).toBe(testUserEmail);
            });

            it('should retrieve user by email', async () => {
                const readUserQuery = getReadUserByEmailQuery(createdUser.email);

                const readUserResponse = await request(url).post('').send(readUserQuery);
                expect(readUserResponse.status).toBe(200);
                expect(readUserResponse.error).toBeFalsy();

                const retrievedUser = readUserResponse.body.data.readUserByEmail;
                expect(retrievedUser).toBeTruthy();
                expect(retrievedUser).toHaveProperty('userId');
                expect(retrievedUser.email).toBe(testUserEmail);
            });

            it('should retrieve user by username', async () => {
                const readUserQuery = getReadUserByUsernameQuery(createdUser.username);

                const readUserResponse = await request(url).post('').send(readUserQuery);
                expect(readUserResponse.status).toBe(200);
                expect(readUserResponse.error).toBeFalsy();

                const retrievedUser = readUserResponse.body.data.readUserByUsername;
                expect(retrievedUser).toBeTruthy();
                expect(retrievedUser).toHaveProperty('userId');
                expect(retrievedUser.email).toBe(testUserEmail);
            });
        });

        describe('readUsers Query', () => {
            let createdUser: UserWithTokenType;
            beforeEach(async () => {
                createdUser = await UserDAO.create(createUserInput);
            });

            afterEach(async () => {
                await UserDAO.deleteUserByEmail(testUserEmail);
            });

            it('should retrieve users when query has no options', async () => {
                const readUsersQuery = getReadUsersWithoutOptionsQuery();

                const readUsersResponse = await request(url).post('').send(readUsersQuery);
                expect(readUsersResponse.status).toBe(200);
                expect(readUsersResponse.error).toBeFalsy();

                const retrievedUsers = readUsersResponse.body.data.readUsers;
                const retrievedTestUser = retrievedUsers.find((user: any) => user.userId === createdUser.userId);
                expect(retrievedTestUser).toBeTruthy();
                expect(retrievedTestUser).toHaveProperty('userId');
                expect(retrievedTestUser.email).toBe(testUserEmail);
            });

            it('should retrieve users when query has options', async () => {
                const options: QueryOptionsInput = {
                    filters: [
                        {
                            field: 'gender',
                            value: Gender.Male,
                        },
                    ],
                };
                const readUsersQuery = getReadUsersWithOptionsQuery(options);

                const readUsersResponse = await request(url).post('').send(readUsersQuery);
                expect(readUsersResponse.status).toBe(200);
                expect(readUsersResponse.error).toBeFalsy();

                const retrievedUsers = readUsersResponse.body.data.readUsers;
                const retrievedTestUser = retrievedUsers.find((user: any) => user.userId === createdUser.userId);
                expect(retrievedTestUser).toBeTruthy();
                expect(retrievedTestUser).toHaveProperty('userId');
                expect(retrievedTestUser.email).toBe(testUserEmail);
            });
        });
    });

    describe('Negative', () => {
        describe('createUser Mutation', () => {
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

            it('should throw BAD_USER_INPUT error when input type schema is valid invalid but the input values are invalid', async () => {
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

            it('should throw BAD_USER_INPUT error when invalid input schema is provided', async () => {
                const invalidCreateUserMutation = getCreateUserMutation({
                    ...createUserInput,
                    email: null,
                });

                const createUserResponse = await request(url).post('').send(invalidCreateUserMutation);
                expect(createUserResponse.error).toBeTruthy();
                expect(createUserResponse.status).toBe(400);
                // TODO assert the error message
            });
        });

        describe('loginUser Mutation', () => {
            beforeEach(async () => {
                await UserDAO.create(createUserInput);
            });

            afterEach(async () => {
                await UserDAO.deleteUserByEmail(testUserEmail);
            });

            it('should throw UNAUTHORIZED error when invalid email is provided', async () => {
                const fakeEmail = 'invalid_email@example.com';
                const invalidLoginMutation = getLoginUserMutation({
                    email: fakeEmail,
                    password: testPassword,
                });

                const loginUserResponse = await request(url).post('').send(invalidLoginMutation);
                expect(loginUserResponse.status).toBe(401);
                expect(loginUserResponse.error).toBeTruthy();
                expect(loginUserResponse.body.errors[0].message).toBe(ERROR_MESSAGES.PASSWORD_MISSMATCH);
            });

            it('should throw UNAUTHORIZED error when invalid password is provided', async () => {
                const invalidLoginMutation = getLoginUserMutation({
                    email: testUserEmail,
                    password: 'incorrect_password',
                });

                const loginUserResponse = await request(url).post('').send(invalidLoginMutation);
                expect(loginUserResponse.status).toBe(401);
                expect(loginUserResponse.error).toBeTruthy();
                expect(loginUserResponse.body.errors[0].message).toBe(ERROR_MESSAGES.PASSWORD_MISSMATCH);
            });

            it('should throw BAD_REQUEST error when empty email or password is provided', async () => {
                const emptyEmailLoginMutation = getLoginUserMutation({
                    email: '',
                    password: testPassword,
                });

                let loginUserResponse = await request(url).post('').send(emptyEmailLoginMutation);
                expect(loginUserResponse.status).toBe(400);
                expect(loginUserResponse.error).toBeTruthy();
                expect(loginUserResponse.body.errors[0].message).toBe(ERROR_MESSAGES.INVALID_EMAIL);

                const emptyPasswordLoginMutation = getLoginUserMutation({
                    email: testUserEmail,
                    password: '',
                });

                loginUserResponse = await request(url).post('').send(emptyPasswordLoginMutation);
                expect(loginUserResponse.status).toBe(400);
                expect(loginUserResponse.error).toBeTruthy();
                expect(loginUserResponse.body.errors[0].message).toBe(ERROR_MESSAGES.INVALID_PASSWORD);
            });
        });

        describe('updateUser Mutation', () => {
            let createdUser: UserWithTokenType;
            beforeEach(async () => {
                createdUser = await UserDAO.create(createUserInput);
            });

            afterEach(async () => {
                await UserDAO.deleteUserByEmail(testUserEmail);
            });

            it('should throw CONFLICT error when unique attribute already exists', async () => {
                const anotherUsername = 'updatedUser';
                try {
                    await UserDAO.create({...createUserInput, email: 'updated@email.net', username: anotherUsername}); // another user for conflict
                } catch (error) {
                    console.log(error);
                    fail('it should not reach here');
                }

                const updateUserMutation = getUpdateUserMutation({
                    userId: createdUser.userId,
                    username: anotherUsername,
                });

                const updateUserResponse = await request(url).post('').set('token', createdUser.token).send(updateUserMutation);
                expect(updateUserResponse.error).toBeTruthy();
                expect(updateUserResponse.status).toBe(409);

                await UserDAO.deleteUserByEmail('updated@email.net');
            });

            it('should throw BAD_USER_INPUT error when invalid input is provided, but the input type schema is valid', async () => {
                const invalidPhoneNumber = 'mockPhoneNumber';
                const updateUserMutation = getUpdateUserMutation({
                    userId: createdUser.userId,
                    phone_number: invalidPhoneNumber,
                });

                const updateUserResponse = await request(url).post('').set('token', createdUser.token).send(updateUserMutation);
                expect(updateUserResponse.error).toBeTruthy();
                expect(updateUserResponse.status).toBe(400);
                expect(updateUserResponse.body.errors[0].message).toBe(ERROR_MESSAGES.INVALID_PHONE_NUMBER);
            });

            it('should throw UNAUTHORIZED error when valid input is provided, but the user is updating another user', async () => {
                const mockId = '62a23958e5a9e9b88f853a67';
                const updateUserMutation = getUpdateUserMutation({
                    userId: mockId,
                    given_name: 'updatedName',
                });

                const updateUserResponse = await request(url).post('').set('token', createdUser.token).send(updateUserMutation);
                expect(updateUserResponse.error).toBeTruthy();
                expect(updateUserResponse.status).toBe(403);
                expect(updateUserResponse.body.errors[0].message).toBe(ERROR_MESSAGES.UNAUTHORIZED);
            });

            it('should throw UNAUTHORIZED error even when an invalid mongodb id is entered', async () => {
                const mockId = 'mockId';
                const updateUserMutation = getUpdateUserMutation({
                    userId: mockId,
                    given_name: 'updatedName',
                });

                const updateUserResponse = await request(url).post('').set('token', createdUser.token).send(updateUserMutation);
                expect(updateUserResponse.error).toBeTruthy();
                expect(updateUserResponse.status).toBe(403);
                expect(updateUserResponse.body.errors[0].message).toBe(ERROR_MESSAGES.UNAUTHORIZED);
            });

            it('should throw BAD_USER_INPUT error when invalid input type is provided', async () => {
                const updateUserMutation = getUpdateUserMutation({
                    userId: createdUser.userId,
                    non_existing_param: 'mockParam',
                });

                const updateUserResponse = await request(url).post('').set('token', createdUser.token).send(updateUserMutation);
                expect(updateUserResponse.error).toBeTruthy();
                expect(updateUserResponse.status).toBe(400);
                expect(updateUserResponse.body.errors[0].extensions.code).toBe('BAD_USER_INPUT');
            });
        });

        describe('deleteUserById Mutation', () => {
            let createdUser: UserWithTokenType;
            beforeEach(async () => {
                createdUser = await UserDAO.create(createUserInput);
            });

            afterEach(async () => {
                await UserDAO.deleteUserByEmail(testUserEmail);
            });

            it('should throw UNAUTHENTICATED error when invalid token is provided', async () => {
                const deleteUserMutation = getDeleteUserByIdMutation(createdUser.userId);

                const deleteUserResponse = await request(url).post('').set('token', 'invalidToken').send(deleteUserMutation);
                expect(deleteUserResponse.error).toBeTruthy();
                expect(deleteUserResponse.status).toBe(401);
            });

            it("should throw UNAUTHORIZED error when token valid but user doesn't have the permission to delete another user", async () => {
                const mockUserId = createdUser.userId.substring(0, -3) + '2e3';
                const deleteUserMutation = getDeleteUserByIdMutation(mockUserId);

                const deleteUserResponse = await request(url).post('').set('token', createdUser.token).send(deleteUserMutation);
                expect(deleteUserResponse.error).toBeTruthy();
                expect(deleteUserResponse.status).toBe(403);
            });
        });

        describe('deleteUserByEmail Mutation', () => {
            let createdUser: UserWithTokenType;
            beforeEach(async () => {
                createdUser = await UserDAO.create(createUserInput);
            });

            afterEach(async () => {
                await UserDAO.deleteUserByEmail(testUserEmail);
            });

            it('should throw UNAUTHENTICATED error when invalid token is provided', async () => {
                const deleteUserMutation = getDeleteUserByEmailMutation(createdUser.email);

                const deleteUserResponse = await request(url).post('').set('token', 'invalidToken').send(deleteUserMutation);
                expect(deleteUserResponse.error).toBeTruthy();
                expect(deleteUserResponse.status).toBe(401);
            });

            it("should throw UNAUTHORIZED error when token valid but user doesn't have the permission to delete another user", async () => {
                const mockEmail = 'mockEmail@example.com';
                const deleteUserMutation = getDeleteUserByEmailMutation(mockEmail);

                const deleteUserResponse = await request(url).post('').set('token', createdUser.token).send(deleteUserMutation);
                expect(deleteUserResponse.error).toBeTruthy();
                expect(deleteUserResponse.status).toBe(403);
            });
        });

        describe('deleteUserByUsername Mutation', () => {
            let createdUser: UserWithTokenType;
            beforeEach(async () => {
                createdUser = await UserDAO.create(createUserInput);
            });

            afterEach(async () => {
                await UserDAO.deleteUserByEmail(testUserEmail);
            });

            it('should throw UNAUTHENTICATED error when invalid token is provided', async () => {
                const deleteUserMutation = getDeleteUserByUsernameMutation(createdUser.username);

                const deleteUserResponse = await request(url).post('').set('token', 'invalidToken').send(deleteUserMutation);
                expect(deleteUserResponse.error).toBeTruthy();
                expect(deleteUserResponse.status).toBe(401);
            });

            it("should throw UNAUTHORIZED error when token valid but user doesn't have the permission to delete another user", async () => {
                const mockUsername = 'mockUsername';
                const deleteUserMutation = getDeleteUserByUsernameMutation(mockUsername);

                const deleteUserResponse = await request(url).post('').set('token', createdUser.token).send(deleteUserMutation);
                expect(deleteUserResponse.error).toBeTruthy();
                expect(deleteUserResponse.status).toBe(403);
            });
        });
    });
});
