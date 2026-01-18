import { graphql } from '@/data/graphql/types';

export const GetMyRsvpStatusDocument = graphql(`
  query GetMyRsvpStatus($eventId: String!) {
    myRsvpStatus(eventId: $eventId) {
      participantId
      eventId
      userId
      status
      quantity
      sharedVisibility
      rsvpAt
      cancelledAt
    }
  }
`);

export const GetMyRsvpsDocument = graphql(`
  query GetMyRsvps($includeCancelled: Boolean) {
    myRsvps(includeCancelled: $includeCancelled) {
      participantId
      eventId
      userId
      status
      quantity
      sharedVisibility
      rsvpAt
      cancelledAt
    }
  }
`);

export const GetEventParticipantsDocument = graphql(`
  query GetEventParticipants($eventId: String!) {
    readEventParticipants(eventId: $eventId) {
      participantId
      eventId
      userId
      status
      quantity
      sharedVisibility
      rsvpAt
      user {
        userId
        username
        given_name
        family_name
        profile_picture
      }
    }
  }
`);
