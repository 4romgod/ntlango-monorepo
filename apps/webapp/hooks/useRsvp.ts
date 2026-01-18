'use client';

import { useMutation, useQuery } from '@apollo/client';
import {
  UpsertEventParticipantDocument,
  CancelEventParticipantDocument,
  GetMyRsvpStatusDocument,
  GetMyRsvpsDocument,
  GetEventParticipantsDocument,
} from '@/data/graphql/query';
import { ParticipantStatus, ParticipantVisibility } from '@/data/graphql/types/graphql';
import { useSession } from 'next-auth/react';

export interface RsvpOptions {
  status?: ParticipantStatus;
  quantity?: number;
  sharedVisibility?: ParticipantVisibility;
}

/**
 * Hook to manage RSVP functionality for events.
 */
export function useRsvp() {
  const { data: session } = useSession();
  const token = session?.user?.token;
  const userId = session?.user?.userId;

  const [rsvpMutation, { loading: rsvpLoading }] = useMutation(UpsertEventParticipantDocument, {
    context: {
      headers: {
        ...(token ? { token } : {}),
      },
    },
  });

  const [cancelMutation, { loading: cancelLoading }] = useMutation(CancelEventParticipantDocument, {
    context: {
      headers: {
        ...(token ? { token } : {}),
      },
    },
  });

  /**
   * RSVP to an event with the specified status.
   * Default status is "Going".
   */
  const rsvpToEvent = async (eventId: string, options: RsvpOptions = {}) => {
    if (!userId) {
      throw new Error('User must be logged in to RSVP');
    }

    const { status = ParticipantStatus.Going, quantity = 1, sharedVisibility } = options;

    return rsvpMutation({
      variables: {
        input: {
          eventId,
          userId,
          status,
          quantity,
          sharedVisibility,
        },
      },
    });
  };

  /**
   * Mark as "Going" to an event.
   */
  const goingToEvent = async (eventId: string, quantity = 1) => {
    return rsvpToEvent(eventId, { status: ParticipantStatus.Going, quantity });
  };

  /**
   * Mark as "Interested" in an event.
   */
  const interestedInEvent = async (eventId: string) => {
    return rsvpToEvent(eventId, { status: ParticipantStatus.Interested });
  };

  /**
   * Cancel RSVP to an event.
   */
  const cancelRsvp = async (eventId: string) => {
    if (!userId) {
      throw new Error('User must be logged in to cancel RSVP');
    }

    return cancelMutation({
      variables: {
        input: {
          eventId,
          userId,
        },
      },
    });
  };

  return {
    rsvpToEvent,
    goingToEvent,
    interestedInEvent,
    cancelRsvp,
    rsvpLoading,
    cancelLoading,
    isLoading: rsvpLoading || cancelLoading,
    isAuthenticated: !!userId,
  };
}

/**
 * Hook to get the current user's RSVP status for a specific event.
 */
export function useMyRsvpStatus(eventId: string) {
  const { data: session } = useSession();
  const token = session?.user?.token;

  const { data, loading, error, refetch } = useQuery(GetMyRsvpStatusDocument, {
    variables: { eventId },
    skip: !token || !eventId,
    fetchPolicy: 'cache-and-network',
    context: {
      headers: {
        ...(token ? { token } : {}),
      },
    },
  });

  return {
    rsvp: data?.myRsvpStatus ?? null,
    status: data?.myRsvpStatus?.status ?? null,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to get all events the current user has RSVP'd to.
 */
export function useMyRsvps(includeCancelled = false) {
  const { data: session } = useSession();
  const token = session?.user?.token;

  const { data, loading, error, refetch } = useQuery(GetMyRsvpsDocument, {
    variables: { includeCancelled },
    skip: !token,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    context: {
      headers: {
        ...(token ? { token } : {}),
      },
    },
  });

  return {
    rsvps: data?.myRsvps ?? [],
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to get all participants for a specific event.
 */
export function useEventParticipants(eventId: string) {
  const { data: session } = useSession();
  const token = session?.user?.token;

  const { data, loading, error, refetch } = useQuery(GetEventParticipantsDocument, {
    variables: { eventId },
    skip: !eventId,
    fetchPolicy: 'cache-and-network',
    context: {
      headers: {
        ...(token ? { token } : {}),
      },
    },
  });

  return {
    participants: data?.readEventParticipants ?? [],
    loading,
    error,
    refetch,
  };
}
