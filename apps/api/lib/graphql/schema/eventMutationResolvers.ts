import {GraphQLID, Thunk, GraphQLFieldConfigMap, GraphQLNonNull} from 'graphql';
import {CreateEventInputType, EventType, UpdateEventInputType} from '../types';
import {EventDAO} from '../../mongodb/dao';

const events: Thunk<GraphQLFieldConfigMap<any, any>> = {
    createEvent: {
        type: EventType,
        args: {
            input: {type: GraphQLNonNull(CreateEventInputType)},
        },
        resolve(parent, {input}, context, resolveInfo) {
            return EventDAO.create(input);
        },
    },
    updateEvent: {
        type: EventType,
        args: {
            id: {type: GraphQLNonNull(GraphQLID)},
            input: {type: GraphQLNonNull(UpdateEventInputType)},
        },
        resolve(parent, {id, input}, context, resolveInfo) {
            return EventDAO.updateEvent(id, input);
        },
    },
    deleteEvent: {
        type: EventType,
        args: {
            id: {type: GraphQLNonNull(GraphQLID)},
        },
        resolve(parent, {id}, context, resolveInfo) {
            return EventDAO.deleteEvent(id);
        },
    },
};

export default events;
