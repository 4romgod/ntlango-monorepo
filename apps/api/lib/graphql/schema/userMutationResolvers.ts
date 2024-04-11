import {GraphQLNonNull, Thunk, GraphQLFieldConfigMap, GraphQLString, GraphQLID} from 'graphql';
import {UserType, CreateUserInputType, UpdateUserInputType} from '../types';
import {UserDAO} from '../../mongodb/dao';

const users: Thunk<GraphQLFieldConfigMap<any, any>> = {
    createUser: {
        type: UserType,
        args: {
            input: {type: GraphQLNonNull(CreateUserInputType)},
        },
        resolve(parent, {input}, context, resolveInfo) {
            return UserDAO.create(input);
        },
    },
    updateUser: {
        type: UserType,
        args: {
            id: {type: GraphQLNonNull(GraphQLID)},
            input: {type: GraphQLNonNull(UpdateUserInputType)},
        },
        resolve(parent, {id, input}, context, resolveInfo) {
            return UserDAO.updateUser(id, input);
        },
    },
    deleteUser: {
        type: UserType,
        args: {
            id: {type: GraphQLNonNull(GraphQLID)},
        },
        resolve(parent, {id}, context, resolveInfo) {
            return UserDAO.deleteUser(id);
        },
    },
};

export default users;
