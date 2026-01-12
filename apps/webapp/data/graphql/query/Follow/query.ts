import { graphql } from '@/data/graphql/types';

export const GetFollowingDocument = graphql(`
  query GetFollowing {
    readFollowing {
      followId
      followerUserId
      targetType
      targetId
      approvalStatus
      notificationPreferences {
        contentVisibility
      }
      createdAt
    }
  }
`);

export const GetFollowersDocument = graphql(`
  query GetFollowers($targetType: FollowTargetType!, $targetId: ID!) {
    readFollowers(targetType: $targetType, targetId: $targetId) {
      followId
      followerUserId
      targetType
      targetId
      approvalStatus
      createdAt
    }
  }
`);

export const GetPendingFollowRequestsDocument = graphql(`
  query GetPendingFollowRequests($targetType: FollowTargetType!) {
    readPendingFollowRequests(targetType: $targetType) {
      followId
      followerUserId
      targetType
      targetId
      approvalStatus
      createdAt
    }
  }
`);
