import { graphql } from '@/data/graphql/types';

export const GetAllEventsDocument = graphql(`
  query GetAllEvents($options: QueryOptionsInput) {
    readEvents(options: $options) {
      eventId
      slug
      title
      description
      eventCategoryList {
        eventCategoryId
        slug
        name
        iconName
        description
        color
      }
      capacity
      status
      tags
      comments
      privacySetting
      eventLink
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
      recurrenceRule
      media {
        featuredImageUrl
      }
      organizerList {
        userId
        email
        username
        address
        birthdate
        family_name
        gender
        given_name
        phone_number
        profile_picture
        userRole
      }
      rSVPList {
        userId
        email
        username
        address
        birthdate
        family_name
        gender
        given_name
        phone_number
        profile_picture
        userRole
      }
    }
  }
`);

export const GetEventBySlugDocument = graphql(`
  query GetEventBySlug($slug: String!) {
    readEventBySlug(slug: $slug) {
      eventId
      slug
      title
      description
      eventCategoryList {
        eventCategoryId
        slug
        name
        iconName
        description
        color
      }
      capacity
      status
      tags
      comments
      privacySetting
      eventLink
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
      recurrenceRule
      media {
        featuredImageUrl
      }
      organizerList {
        userId
        email
        username
        address
        birthdate
        family_name
        gender
        given_name
        phone_number
        profile_picture
        userRole
      }
      rSVPList {
        userId
        email
        username
        address
        birthdate
        family_name
        gender
        given_name
        phone_number
        profile_picture
        userRole
      }
    }
  }
`);
