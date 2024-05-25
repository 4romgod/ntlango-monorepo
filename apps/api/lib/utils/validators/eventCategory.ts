import {UpdateEventCategoryInputType, CreateEventCategoryInputType} from '../../graphql/types';
import {validateMongodbId} from './common';

class EventCategoryValidator {
    static create(category: CreateEventCategoryInputType) {}

    static readEventCategoryById(eventId: string) {
        validateMongodbId(eventId, `Event Category with id ${eventId} does not exist`);
    }

    static readEventCategoryBySlug(slug: string) {}

    static readEventCategories() {}

    static updateEventCategory(category: UpdateEventCategoryInputType) {
        validateMongodbId(category.id, `Event Category with id ${category.id} does not exist`);
    }

    static deleteEventCategory(eventId: string) {
        validateMongodbId(eventId, `Event Category with id ${eventId} does not exist`);
    }
}

export default EventCategoryValidator;
