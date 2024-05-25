import {UpdateEventInputType, CreateEventInputType, EventQueryParams} from '../../graphql/types';
import {validateMongodbId} from './common';

class EventValidator {
    static async create(event: CreateEventInputType) {}

    static async readEventById(eventId: string) {
        validateMongodbId(eventId, `Event with id ${eventId} does not exist`);
    }

    static async readEventBySlug(slug: string) {}

    static async readEvents(queryParams?: EventQueryParams) {}

    static async updateEvent(event: UpdateEventInputType) {
        validateMongodbId(event.id, `Event with id ${event.id} does not exist`);
    }

    static async deleteEvent(eventId: string) {
        validateMongodbId(eventId, `Event with id ${eventId} does not exist`);
    }

    static async rsvp(eventId: string) {
        validateMongodbId(eventId, `Event with id ${eventId} does not exist`);
    }

    static async cancelRsvp(eventId: string) {
        validateMongodbId(eventId, `Event with id ${eventId} does not exist`);
    }
}

export default EventValidator;
