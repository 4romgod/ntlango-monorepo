import {UpdateUserInputType} from '../../../graphql/types';

export const getCreateUserMutation = (user: any) => {
    return {
        query: `mutation CreateUser($input: CreateUserInputType!) {
            createUser(input: $input) {
              id
              email
              username
              address
            }
        }`,
        variables: {
            input: user,
        },
    };
};

export const getUpdateUserMutation = (user: UpdateUserInputType) => {
    return {
        query: `mutation UpdateUser($input: UpdateUserInputType!) {
            updateUser(input: $input) {
              id
              email
              username
              address
              family_name
            }
        }`,
        variables: {
            input: user,
        },
    };
};

export const getDeleteUserByIdMutation = (userId: string) => {
    return {
        query: `mutation DeleteUserById($userId: String!) {
            deleteUserById(id: $userId) {
              id
              email
              username
            }
        }`,
        variables: {userId: userId},
    };
};
