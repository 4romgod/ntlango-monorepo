import 'reflect-metadata';
import { EVENT_CATEGORY_DESCRIPTIONS, EVENT_DESCRIPTIONS } from '@/constants';
import { ID, Field, InputType, ObjectType } from 'type-graphql';
import { EventCategoryType } from './eventCategory';

@ObjectType('EventCategoryGroupType', { description: EVENT_CATEGORY_DESCRIPTIONS.GROUP.TYPE })
export class EventCategoryGroupType {
  @Field((type) => ID, {description: EVENT_CATEGORY_DESCRIPTIONS.ID})
  eventCategoryGroupId: string;

  @Field((type) => String, { description: EVENT_CATEGORY_DESCRIPTIONS.GROUP.NAME })
  name: string;

  @Field((type) => String, {description: EVENT_CATEGORY_DESCRIPTIONS.GROUP.NAME})
  slug: string;

  @Field(() => [EventCategoryType], { description: EVENT_DESCRIPTIONS.EVENT.EVENT_CATEGORY_LIST })
  eventCategoryList: EventCategoryType[];
}

@InputType('UpdateEventCategoryGroupInputType', { description: EVENT_CATEGORY_DESCRIPTIONS.GROUP.UPDATE_INPUT })
export class UpdateEventCategoryGroupInputType {
  @Field((type) => ID, {description: EVENT_CATEGORY_DESCRIPTIONS.ID})
  eventCategoryGroupId: string;

  @Field((type) => String, { description: EVENT_CATEGORY_DESCRIPTIONS.GROUP.NAME })
  name: string;

  @Field(() => [String], { description: EVENT_DESCRIPTIONS.EVENT.EVENT_CATEGORY_LIST })
  eventCategoryList: string[];
}

@InputType('CreateEventCategoryGroupInputType', { description: EVENT_CATEGORY_DESCRIPTIONS.GROUP.CREATE_INPUT })
export class CreateEventCategoryGroupInputType {
  @Field((type) => String, { description: EVENT_CATEGORY_DESCRIPTIONS.GROUP.NAME })
  name: string;

  @Field(() => [String], { description: EVENT_DESCRIPTIONS.EVENT.EVENT_CATEGORY_LIST })
  eventCategoryList: string[];
}
