import 'reflect-metadata';
import {Arg, Mutation, Resolver, Query} from 'type-graphql';
import {EventDAO} from '../../mongodb/dao';
import {CreateEventInputType, EventQueryParams, EventType, UpdateEventInputType} from '../types';
import {validateMongodbId} from '../../utils/validators';

@Resolver()
export class EventResolver {
    @Mutation(() => EventType)
    async createEvent(@Arg('input', () => CreateEventInputType) input: CreateEventInputType): Promise<EventType> {
        return EventDAO.create(input);
    }

    @Mutation(() => EventType)
    async updateEvent(@Arg('input', () => UpdateEventInputType) input: UpdateEventInputType): Promise<EventType> {
        validateMongodbId(input.id, `Event with id ${input.id} does not exist`);
        return EventDAO.updateEvent(input);
    }

    @Mutation(() => EventType)
    async deleteEvent(@Arg('eventId') eventId: string): Promise<EventType> {
        validateMongodbId(eventId, `Event with id ${eventId} does not exist`);
        return EventDAO.deleteEvent(eventId);
    }

    @Query(() => EventType)
    async readEventById(@Arg('eventId') eventId: string): Promise<EventType | null> {
        validateMongodbId(eventId, `Event with id ${eventId} does not exist`);
        return EventDAO.readEventById(eventId);
    }

    @Query(() => EventType)
    async readEventBySlug(@Arg('slug') slug: string): Promise<EventType | null> {
        return EventDAO.readEventBySlug(slug);
    }

    @Query(() => [EventType])
    async readEvents(@Arg('queryParams', {nullable: true}) queryParams?: EventQueryParams): Promise<EventType[]> {
        return EventDAO.readEvents(queryParams);
    }
}
