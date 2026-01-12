'use client';

import { useMutation, useQuery } from '@apollo/client';
import {
  FollowDocument,
  UnfollowDocument,
  GetFollowingDocument,
  GetFollowersDocument,
  AcceptFollowRequestDocument,
  RejectFollowRequestDocument,
  UpdateFollowNotificationPreferencesDocument,
} from '@/data/graphql/query';
import type { FollowTargetType } from '@/data/graphql/types/graphql';
import { FollowContentVisibility } from '@/data/graphql/types/graphql';
import { useSession } from 'next-auth/react';

export function useFollow() {
  const { data: session } = useSession();
  const token = session?.user?.token;

  const [followMutation, { loading: followLoading }] = useMutation(FollowDocument, {
    refetchQueries: ['GetFollowing'],
    context: {
      headers: {
        ...(token ? { token } : {}),
      },
    },
  });

  const [unfollowMutation, { loading: unfollowLoading }] = useMutation(UnfollowDocument, {
    refetchQueries: ['GetFollowing'],
    context: {
      headers: {
        ...(token ? { token } : {}),
      },
    },
  });

  const follow = async (targetType: FollowTargetType, targetId: string) => {
    return followMutation({
      variables: {
        input: {
          targetType,
          targetId,
        },
      },
    });
  };

  const unfollow = async (targetType: FollowTargetType, targetId: string) => {
    return unfollowMutation({
      variables: {
        targetType,
        targetId,
      },
    });
  };

  return {
    follow,
    unfollow,
    followLoading,
    unfollowLoading,
    isLoading: followLoading || unfollowLoading,
  };
}

export function useFollowing() {
  const { data: session } = useSession();
  const token = session?.user?.token;

  const { data, loading, error, refetch } = useQuery(GetFollowingDocument, {
    context: {
      headers: {
        ...(token ? { token } : {}),
      },
    },
  });

  return {
    following: data?.readFollowing ?? [],
    loading,
    error,
    refetch,
  };
}

export function useFollowers(targetType: FollowTargetType, targetId: string) {
  const { data: session } = useSession();
  const token = session?.user?.token;

  const { data, loading, error, refetch } = useQuery(GetFollowersDocument, {
    variables: {
      targetType,
      targetId,
    },
    skip: !targetId,
    context: {
      headers: {
        ...(token ? { token } : {}),
      },
    },
  });

  return {
    followers: data?.readFollowers ?? [],
    loading,
    error,
    refetch,
  };
}

export function useFollowRequests() {
  const { data: session } = useSession();
  const token = session?.user?.token;

  const [acceptRequest, { loading: acceptLoading }] = useMutation(AcceptFollowRequestDocument, {
    refetchQueries: ['GetPendingFollowRequests', 'GetFollowers'],
    context: {
      headers: {
        ...(token ? { token } : {}),
      },
    },
  });

  const [rejectRequest, { loading: rejectLoading }] = useMutation(RejectFollowRequestDocument, {
    refetchQueries: ['GetPendingFollowRequests'],
    context: {
      headers: {
        ...(token ? { token } : {}),
      },
    },
  });

  const accept = async (followId: string) => {
    return acceptRequest({
      variables: { followId },
    });
  };

  const reject = async (followId: string) => {
    return rejectRequest({
      variables: { followId },
    });
  };

  return {
    accept,
    reject,
    acceptLoading,
    rejectLoading,
    isLoading: acceptLoading || rejectLoading,
  };
}

export function useUpdateFollowPreferences() {
  const { data: session } = useSession();
  const token = session?.user?.token;

  const [updatePreferences, { loading }] = useMutation(UpdateFollowNotificationPreferencesDocument, {
    refetchQueries: ['GetFollowing'],
    context: {
      headers: {
        ...(token ? { token } : {}),
      },
    },
  });

  const muteFollow = async (followId: string) => {
    return updatePreferences({
      variables: {
        input: {
          followId,
          notificationPreferences: {
            contentVisibility: FollowContentVisibility.Muted,
          },
        },
      },
    });
  };

  const unmuteFollow = async (followId: string) => {
    return updatePreferences({
      variables: {
        input: {
          followId,
          notificationPreferences: {
            contentVisibility: FollowContentVisibility.Active,
          },
        },
      },
    });
  };

  return {
    muteFollow,
    unmuteFollow,
    loading,
  };
}
