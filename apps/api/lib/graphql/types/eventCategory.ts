import 'reflect-metadata';
import {EVENT_CATEGORY_DESCRIPTIONS} from '@/constants';
import {Field, InputType, ObjectType} from 'type-graphql';

@ObjectType({description: EVENT_CATEGORY_DESCRIPTIONS.TYPE})
export class EventCategoryType {
    @Field({description: EVENT_CATEGORY_DESCRIPTIONS.ID})
    eventCategoryId: string;

    @Field({description: EVENT_CATEGORY_DESCRIPTIONS.SLUG})
    slug: string;

    @Field({description: EVENT_CATEGORY_DESCRIPTIONS.NAME})
    name: string;

    @Field({description: EVENT_CATEGORY_DESCRIPTIONS.ICON_NAME})
    iconName: string;

    @Field({description: EVENT_CATEGORY_DESCRIPTIONS.DESCRIPTION})
    description: string;

    @Field({nullable: true, description: EVENT_CATEGORY_DESCRIPTIONS.COLOR})
    color?: string;
}

@InputType({description: EVENT_CATEGORY_DESCRIPTIONS.CREATE_INPUT})
export class CreateEventCategoryInputType {
    @Field({description: EVENT_CATEGORY_DESCRIPTIONS.NAME})
    name: string;

    @Field({description: EVENT_CATEGORY_DESCRIPTIONS.ICON_NAME})
    iconName: string;

    @Field({description: EVENT_CATEGORY_DESCRIPTIONS.DESCRIPTION})
    description: string;

    @Field({nullable: true, description: EVENT_CATEGORY_DESCRIPTIONS.COLOR})
    color?: string;
}

@InputType({description: EVENT_CATEGORY_DESCRIPTIONS.UPDATE_INPUT})
export class UpdateEventCategoryInputType {
    @Field({description: EVENT_CATEGORY_DESCRIPTIONS.ID})
    eventCategoryId: string;

    @Field({nullable: true, description: EVENT_CATEGORY_DESCRIPTIONS.NAME})
    name?: string;

    @Field({nullable: true, description: EVENT_CATEGORY_DESCRIPTIONS.ICON_NAME})
    iconName?: string;

    @Field({nullable: true, description: EVENT_CATEGORY_DESCRIPTIONS.DESCRIPTION})
    description?: string;

    @Field({nullable: true, description: EVENT_CATEGORY_DESCRIPTIONS.COLOR})
    color?: string;
}
