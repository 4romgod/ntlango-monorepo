import { gql } from '@apollo/client';

/**
 * Query to fetch organizations with follower counts
 * Used in sidebar discovery widgets to showcase top organizations
 * Client-side sorting by followersCount is performed after fetching
 */
export const GET_POPULAR_ORGANIZATIONS = gql`
  query GetPopularOrganizations {
    readOrganizations {
      orgId
      slug
      name
      description
      logo
      followersCount
      isFollowable
      tags
    }
  }
`;
