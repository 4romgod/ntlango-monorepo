import {Gender, UserRole, UserType} from '@/graphql/types';
import {generateToken, verifyToken} from '@/utils/auth';
import {GraphQLError} from 'graphql';
import {ErrorTypes} from '@/utils';

describe('auth', () => {
    const createUserInput: UserType = {
        id: 'user001',
        email: 'user001@gmail.com',
        username: 'jackBaur',
        address: 'KZN, Durban, 8000',
        birthdate: '1994-06-26',
        family_name: 'Baur',
        gender: Gender.Male,
        given_name: 'Jack',
        encrypted_password: 'dfuyihjknbsndhj',
        phone_number: '+12345678990',
        profile_picture: '',
        userRole: UserRole.Admin,
    };

    describe('generateToken and verifyToken', () => {
        it('should return a valid user when valid token and secret string is provided', async () => {
            const token = generateToken(createUserInput);
            const decodedUser = verifyToken(token);
            expect(createUserInput).toEqual(decodedUser);
        });

        it('should throw UNAUTHENTICATED error when incorrect secret string is used to decode token', async () => {
            const token = generateToken(createUserInput);
            try {
                verifyToken(token, 'invalid_secret');
            } catch (error) {
                expect(error instanceof GraphQLError).toBeTruthy();
                if (error instanceof GraphQLError) {
                    expect(error.extensions.code).toBe(ErrorTypes.UNAUTHENTICATED.errorCode);
                    expect(error.extensions.http).toEqual({status: 401});
                }
            }
        });
    });

    describe('isAuthorizedByOperation', () => {
        it('mock test', () => {
            // TODO write real tests
        });
    });

    describe('isAuthorizedToUpdateEvent', () => {
        it('mock test', () => {
            // TODO write real tests
        });
    });

    describe('authChecker', () => {
        it('mock test', () => {
            // TODO write real tests
        });
    });
});
