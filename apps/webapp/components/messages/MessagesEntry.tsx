'use client';

import { Box, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useChatConversations, useResolveConversationUsers } from '@/hooks';
import { ROUTES } from '@/lib/constants';
import MessagesPanel from '@/components/messages/MessagesPanel';

const CHAT_CONVERSATIONS_LIMIT = 100;
const LAST_OPEN_CHAT_USERNAME_KEY = 'ntlango:last-open-chat-username';

export default function MessagesEntry() {
  const router = useRouter();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const { conversations, loading, error } = useChatConversations({ limit: CHAT_CONVERSATIONS_LIMIT });
  const resolvedUsersByConversationId = useResolveConversationUsers(conversations);
  const [hasRedirected, setHasRedirected] = useState(false);

  const availableUsernames = useMemo(() => {
    return conversations
      .map(
        (conversation) =>
          conversation.conversationWithUser?.username ||
          resolvedUsersByConversationId[conversation.conversationWithUserId]?.username,
      )
      .filter((username): username is string => Boolean(username));
  }, [conversations, resolvedUsersByConversationId]);

  useEffect(() => {
    if (!isDesktop || hasRedirected || loading || error || availableUsernames.length === 0) {
      return;
    }

    const storedLastOpenUsername =
      typeof window !== 'undefined' ? window.localStorage.getItem(LAST_OPEN_CHAT_USERNAME_KEY) : null;

    const targetUsername =
      storedLastOpenUsername && availableUsernames.includes(storedLastOpenUsername)
        ? storedLastOpenUsername
        : availableUsernames[0];

    if (!targetUsername) {
      return;
    }

    setHasRedirected(true);
    router.replace(ROUTES.ACCOUNT.MESSAGE_WITH_USERNAME(targetUsername));
  }, [availableUsernames, error, hasRedirected, isDesktop, loading, router]);

  if (isDesktop && loading && conversations.length === 0) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (isDesktop && availableUsernames.length > 0) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  return <MessagesPanel />;
}
