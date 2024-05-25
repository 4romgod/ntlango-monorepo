import {UpdateUserInputType, CreateUserInputType, UserQueryParams, LoginUserInputType} from '../../graphql/types';
import {validateMongodbId} from './common';

class UserValidator {
    static create(userData: CreateUserInputType) {}

    static login(loginData: LoginUserInputType) {}

    static readUserById(userId: string) {
        validateMongodbId(userId, `User with id ${userId} does not exist`);
    }

    static readUserByUsername(username: string) {}

    static readUsers(queryParams?: UserQueryParams) {}

    static updateUser(user: UpdateUserInputType) {
        validateMongodbId(user.id, `User with id ${user.id} does not exist`);
    }

    static async deleteUserById(userId: string) {
        validateMongodbId(userId, `User with id ${userId} does not exist`);
    }

    static async deleteUserByEmail(email: string) {}
}

export default UserValidator;
