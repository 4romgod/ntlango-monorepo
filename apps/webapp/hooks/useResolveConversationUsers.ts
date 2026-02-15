'use client';

import { useApolloClient } from '@apollo/client';
import { useEffect, useState } from 'react';
import { GetUserByIdDocument } from '@/data/graphql/types/graphql';

export type ResolvedConversationUser = {
  displayName: string;
  username?: string;
  avatarSrc?: string;
};

type ConversationWithUser = {
  conversationWithUserId: string;
  conversationWithUser?: {
    username?: string | null;
    given_name?: string | null;
    family_name?: string | null;
    profile_picture?: string | null;
  } | null;
};

/**
 * Resolves user details for conversations where the user info is not embedded.
 * Fetches user data by ID and caches it to avoid redundant queries.
 */
export function useResolveConversationUsers(conversations: ConversationWithUser[]) {
  const apolloClient = useApolloClient();
  const [resolvedUsersByConversationId, setResolvedUsersByConversationId] = useState<
    Record<string, ResolvedConversationUser>
  >({});

  useEffect(() => {
    const unresolvedConversationIds = conversations
      .filter((conversation) => !conversation.conversationWithUser?.username)
      .map((conversation) => conversation.conversationWithUserId)
      .filter((conversationWithUserId) => !resolvedUsersByConversationId[conversationWithUserId]);

    if (unresolvedConversationIds.length === 0) {
      return;
    }

    let cancelled = false;

    const resolveMissingUsers = async () => {
      const resolvedEntries = await Promise.all(
        unresolvedConversationIds.map(async (userId) => {
          try {
            const { data } = await apolloClient.query({
              query: GetUserByIdDocument,
              variables: { userId },
              fetchPolicy: 'cache-first',
            });

            const user = data?.readUserById;
            if (!user) {
              return [userId, { displayName: 'Conversation' }] as const;
            }

            const fullName = [user.given_name, user.family_name].filter(Boolean).join(' ').trim();
            if (fullName) {
              return [
                userId,
                {
                  displayName: fullName,
                  username: user.username ?? undefined,
                  avatarSrc: user.profile_picture ?? undefined,
                },
              ] as const;
            }

            if (user.username) {
              return [
                userId,
                {
                  displayName: `@${user.username}`,
                  username: user.username,
                  avatarSrc: user.profile_picture ?? undefined,
                },
              ] as const;
            }

            return [userId, { displayName: 'Conversation', avatarSrc: user.profile_picture ?? undefined }] as const;
          } catch {
            return [userId, { displayName: 'Conversation' }] as const;
          }
        }),
      );

      if (cancelled) {
        return;
      }

      setResolvedUsersByConversationId((previousState) => {
        const nextState = { ...previousState };
        resolvedEntries.forEach(([conversationWithUserId, details]) => {
          nextState[conversationWithUserId] = details;
        });
        return nextState;
      });
    };

    void resolveMissingUsers();

    return () => {
      cancelled = true;
    };
  }, [apolloClient, conversations, resolvedUsersByConversationId]);

  return resolvedUsersByConversationId;
}
