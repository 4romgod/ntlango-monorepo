import 'reflect-metadata';
import {Arg, Mutation, Resolver, Query} from 'type-graphql';
import {EventDAO} from '../../mongodb/dao';
import {CreateEventInputType, EventQueryParams, EventType, UpdateEventInputType} from '../types';

@Resolver()
export class EventResolver {
    @Mutation(() => EventType)
    async createEvent(@Arg('input', () => CreateEventInputType) input: CreateEventInputType): Promise<EventType> {
        return EventDAO.create(input);
    }

    @Mutation(() => EventType)
    async updateEvent(@Arg('input', () => UpdateEventInputType) input: UpdateEventInputType): Promise<EventType> {
        return EventDAO.updateEvent(input);
    }

    @Mutation(() => EventType)
    async deleteEvent(@Arg('eventId') eventId: string): Promise<EventType> {
        return EventDAO.deleteEvent(eventId);
    }

    @Query(() => EventType)
    async readEventById(@Arg('eventId') eventId: string): Promise<EventType | null> {
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
