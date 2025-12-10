import 'reflect-metadata';
import { Arg, Mutation, Resolver, Authorized, Query } from 'type-graphql';
import { QueryOptionsInput, UserRole } from '@/graphql/types';
import { EventCategoryGroupDAO } from '@/mongodb/dao';
import { RESOLVER_DESCRIPTIONS } from '@/constants';
import { CreateEventCategoryGroupInputType, EventCategoryGroupType, UpdateEventCategoryGroupInputType } from '../types/eventCategoryGroup';

@Resolver()
export class EventCategoryGroupResolver {
  @Authorized([UserRole.Admin])
  @Mutation(() => EventCategoryGroupType, { description: RESOLVER_DESCRIPTIONS.EVENT_CATEGORY_GROUP.createEventCategoryGroup })
  async createEventCategoryGroup(@Arg('input', () => CreateEventCategoryGroupInputType) input: CreateEventCategoryGroupInputType): Promise<EventCategoryGroupType> {
    return EventCategoryGroupDAO.create(input);
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => EventCategoryGroupType, { description: RESOLVER_DESCRIPTIONS.EVENT_CATEGORY_GROUP.updateEventCategoryGroup })
  async updateEventCategoryGroup(@Arg('input', () => UpdateEventCategoryGroupInputType) input: UpdateEventCategoryGroupInputType): Promise<EventCategoryGroupType> {
    return EventCategoryGroupDAO.updateEventCategoryGroup(input);
  }

  @Authorized([UserRole.Admin])
  @Mutation(() => EventCategoryGroupType, { description: RESOLVER_DESCRIPTIONS.EVENT_CATEGORY_GROUP.deleteEventCategoryGroupBySlug })
  async deleteEventCategoryGroupBySlug(@Arg('slug', () => String) slug: string): Promise<EventCategoryGroupType> {
    return EventCategoryGroupDAO.deleteEventCategoryGroupBySlug(slug);
  }

  @Query(() => EventCategoryGroupType, { description: RESOLVER_DESCRIPTIONS.EVENT_CATEGORY_GROUP.readEventCategoryGroupBySlug })
  async readEventCategoryGroupBySlug(@Arg('slug', () => String) slug: string): Promise<EventCategoryGroupType | null> {
    return EventCategoryGroupDAO.readEventCategoryGroupBySlug(slug);
  }

  @Query(() => [EventCategoryGroupType], { description: RESOLVER_DESCRIPTIONS.EVENT_CATEGORY_GROUP.readEventCategoryGroups })
  async readEventCategoryGroups(@Arg('options', () => QueryOptionsInput, { nullable: true }) options?: QueryOptionsInput): Promise<EventCategoryGroupType[]> {
    return EventCategoryGroupDAO.readEventCategoryGroups(options);
  }
}