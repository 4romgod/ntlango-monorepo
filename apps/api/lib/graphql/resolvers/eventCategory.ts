import 'reflect-metadata';
import {Arg, Mutation, Resolver, Query} from 'type-graphql';
import {CreateEventCategoryInputType, EventCategoryType, UpdateEventCategoryInputType} from '@/graphql/types';
import {EventCategoryDAO} from '@/mongodb/dao';
import {validateMongodbId} from '@/utils/validators';

@Resolver()
export class EventCategoryResolver {
    @Mutation(() => EventCategoryType)
    async createEventCategory(@Arg('input', () => CreateEventCategoryInputType) input: CreateEventCategoryInputType): Promise<EventCategoryType> {
        return EventCategoryDAO.create(input);
    }

    @Mutation(() => EventCategoryType)
    async updateEventCategory(@Arg('input', () => UpdateEventCategoryInputType) input: UpdateEventCategoryInputType): Promise<EventCategoryType> {
        return EventCategoryDAO.updateEventCategory(input);
    }

    @Mutation(() => EventCategoryType)
    async deleteEvent(@Arg('id') id: string): Promise<EventCategoryType> {
        validateMongodbId(id);
        return EventCategoryDAO.deleteEventCategory(id);
    }

    @Query(() => EventCategoryType)
    async readEventCategoryById(@Arg('eventCategoryId') eventCategoryId: string): Promise<EventCategoryType | null> {
        return EventCategoryDAO.readEventCategoryById(eventCategoryId);
    }

    @Query(() => EventCategoryType)
    async readEventCategoryBySlug(@Arg('slug') slug: string): Promise<EventCategoryType | null> {
        return EventCategoryDAO.readEventCategoryBySlug(slug);
    }

    @Query(() => [EventCategoryType])
    async readEventCategories(): Promise<EventCategoryType[]> {
        return EventCategoryDAO.readEventCategories();
    }
}
