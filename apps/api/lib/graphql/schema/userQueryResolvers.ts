import {GraphQLID, GraphQLList, GraphQLString, Thunk, GraphQLFieldConfigMap, GraphQLNonNull} from 'graphql';
import {UserType} from '../types';
import {UserDAO} from '../../mongodb/dao';

const users: Thunk<GraphQLFieldConfigMap<any, any>> = {
    readUserById: {
        type: UserType,
        args: {
            id: {type: GraphQLNonNull(GraphQLID)},
        },
        resolve(parent, {id}, context, resolveInfo) {
            return UserDAO.readUserById(id);
        },
    },
    readUsers: {
        type: GraphQLNonNull(GraphQLList(GraphQLNonNull(UserType))),
        resolve(parent, args, context, resolveInfo) {
            return UserDAO.readUsers();
        },
    },
    queryUsers: {
        type: GraphQLNonNull(GraphQLList(GraphQLNonNull(UserType))), // TODO work on this
        resolve(parent, args, context, resolveInfo) {
            return UserDAO.readUsers({gender: args.gender});
        },
    },
};

export default users;
