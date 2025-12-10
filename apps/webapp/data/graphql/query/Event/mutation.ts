import { graphql } from '@/data/graphql/types';

export const DeleteEventByIdDocument = graphql(`
  mutation DeleteEventById($eventId: String!) {
    deleteEventById(eventId: $eventId) {
      eventId
      slug
      title
      description
      recurrenceRule
      location {
        locationType
        coordinates {
          latitude
          longitude
        }
        address {
          street
          city
          state
          zipCode
          country
        }
        details
      }
      organizerList {
        userId
        email
        username
        address
        birthdate
        family_name
        userRole
      }
    }
  }
`);
