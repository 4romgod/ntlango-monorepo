import {GraphQLID, GraphQLList, GraphQLString, Thunk, GraphQLFieldConfigMap, GraphQLNonNull} from 'graphql';
import {EventType} from '../types';
import {EventDAO} from '../../mongodb/dao';

const events: Thunk<GraphQLFieldConfigMap<any, any>> = {
    readEventById: {
        type: EventType,
        args: {
            id: {type: GraphQLNonNull(GraphQLID)},
        },
        resolve(parent, {id}, context, resolveInfo) {
            return EventDAO.readEventById(id);
        },
    },
    readEvents: {
        type: GraphQLNonNull(GraphQLList(GraphQLNonNull(EventType))),
        resolve(parent, args, context, resolveInfo) {
            return EventDAO.readEvents();
        },
    },
    queryEvents: {
        // TODO update this
        type: GraphQLNonNull(GraphQLList(GraphQLNonNull(EventType))),
        resolve(parent, args, context, resolveInfo) {
            return EventDAO.readEvents({title: args.title});
        },
    },
};

export default events;
