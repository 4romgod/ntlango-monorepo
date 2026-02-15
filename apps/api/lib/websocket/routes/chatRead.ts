import type { APIGatewayProxyResultV2 } from 'aws-lambda';
import { ChatMessageDAO, WebSocketConnectionDAO } from '@/mongodb/dao';
import { HttpStatusCode } from '@/constants';
import { logger } from '@/utils/logger';
import { WEBSOCKET_EVENT_TYPES } from '@/websocket/constants';
import { ensureDatabaseConnection } from '@/websocket/database';
import {
  createRealtimeEventEnvelope,
  deduplicateConnections,
  isGoneConnectionError,
  postToConnection,
} from '@/websocket/gateway';
import { parseBody, response } from '@/websocket/response';
import { touchConnection } from '@/websocket/routes/touch';
import type { WebSocketRequestEvent } from '@/websocket/types';

interface ChatReadPayload {
  withUserId?: unknown;
}

interface ChatReadEventPayload {
  readerUserId: string;
  withUserId: string;
  markedCount: number;
  readAt: string;
}

interface ChatConversationUpdatedMessage {
  messageId: string;
  senderUserId: string;
  recipientUserId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface ChatConversationUpdatedEventPayload {
  conversationWithUserId: string;
  unreadCount: number;
  unreadTotal: number;
  reason: 'chat.read';
  updatedAt: string;
  lastMessage: ChatConversationUpdatedMessage | null;
}

export const handleChatRead = async (event: WebSocketRequestEvent): Promise<APIGatewayProxyResultV2> => {
  await ensureDatabaseConnection();
  const connectionId = await touchConnection(event);
  const payload = parseBody<ChatReadPayload>(event.body);

  const withUserId = typeof payload?.withUserId === 'string' ? payload.withUserId.trim() : '';
  if (!withUserId) {
    return response(HttpStatusCode.BAD_REQUEST, {
      message: 'Invalid payload. withUserId is required.',
    });
  }

  const readerConnection = await WebSocketConnectionDAO.readConnectionByConnectionId(connectionId);
  if (!readerConnection) {
    logger.warn('Chat read rejected because connection metadata was not found', { connectionId });
    return response(HttpStatusCode.UNAUTHENTICATED, {
      message: 'Connection is not registered. Reconnect and try again.',
    });
  }

  const readerUserId = readerConnection.userId;
  const markedCount = await ChatMessageDAO.markConversationRead(readerUserId, withUserId);
  const [
    readerConnections,
    withUserConnections,
    readerUnreadCount,
    withUserUnreadCount,
    readerUnreadTotal,
    withUserUnreadTotal,
    latestMessage,
  ] = await Promise.all([
    WebSocketConnectionDAO.readConnectionsByUserId(readerUserId),
    WebSocketConnectionDAO.readConnectionsByUserId(withUserId),
    ChatMessageDAO.countUnreadForConversation(readerUserId, withUserId),
    ChatMessageDAO.countUnreadForConversation(withUserId, readerUserId),
    ChatMessageDAO.countUnreadTotal(readerUserId),
    ChatMessageDAO.countUnreadTotal(withUserId),
    ChatMessageDAO.readLatestInConversation(readerUserId, withUserId),
  ]);
  const readAt = new Date().toISOString();
  const updatedAt = latestMessage?.createdAt?.toISOString() ?? readAt;
  const lastMessagePayload: ChatConversationUpdatedMessage | null = latestMessage
    ? {
        messageId: latestMessage.chatMessageId,
        senderUserId: latestMessage.senderUserId,
        recipientUserId: latestMessage.recipientUserId,
        message: latestMessage.message,
        isRead: latestMessage.isRead,
        createdAt: latestMessage.createdAt.toISOString(),
      }
    : null;

  const readEventPayload = createRealtimeEventEnvelope<ChatReadEventPayload>(WEBSOCKET_EVENT_TYPES.CHAT_READ, {
    readerUserId,
    withUserId,
    markedCount,
    readAt,
  });

  let readEventDeliveredCount = 0;
  let conversationDeliveredCount = 0;
  let failedCount = 0;
  let staleCount = 0;
  let deliveredToReaderCount = 0;
  let deliveredToWithUserCount = 0;

  const targetConnections = deduplicateConnections(readerConnections, withUserConnections);

  await Promise.all(
    [...targetConnections.values()].map(async (connection) => {
      const isReaderConnection = connection.userId === readerUserId;
      const conversationUpdatedEventPayload = createRealtimeEventEnvelope<ChatConversationUpdatedEventPayload>(
        WEBSOCKET_EVENT_TYPES.CHAT_CONVERSATION_UPDATED,
        {
          conversationWithUserId: isReaderConnection ? withUserId : readerUserId,
          unreadCount: isReaderConnection ? readerUnreadCount : withUserUnreadCount,
          unreadTotal: isReaderConnection ? readerUnreadTotal : withUserUnreadTotal,
          reason: 'chat.read',
          updatedAt,
          lastMessage: lastMessagePayload,
        },
      );

      try {
        await postToConnection(connection, readEventPayload);
        readEventDeliveredCount += 1;
        if (isReaderConnection) {
          deliveredToReaderCount += 1;
        }
        if (connection.userId === withUserId) {
          deliveredToWithUserCount += 1;
        }
        await postToConnection(connection, conversationUpdatedEventPayload);
        conversationDeliveredCount += 1;
      } catch (error) {
        if (isGoneConnectionError(error)) {
          staleCount += 1;
          await WebSocketConnectionDAO.removeConnection(connection.connectionId);
          logger.info('Removed stale websocket connection while broadcasting chat read event', {
            connectionId: connection.connectionId,
            readerUserId,
            withUserId,
          });
          return;
        }

        failedCount += 1;
        logger.warn('Failed to broadcast websocket chat read event', {
          connectionId: connection.connectionId,
          readerUserId,
          withUserId,
          error,
        });
      }
    }),
  );

  logger.info('Processed websocket chat read event', {
    connectionId,
    readerUserId,
    withUserId,
    markedCount,
    readerConnections: readerConnections.length,
    withUserConnections: withUserConnections.length,
    readerUnreadCount,
    withUserUnreadCount,
    readerUnreadTotal,
    withUserUnreadTotal,
    readEventDeliveredCount,
    conversationDeliveredCount,
    deliveredToReaderCount,
    deliveredToWithUserCount,
    failedCount,
    staleCount,
  });

  return response(HttpStatusCode.OK, {
    message: 'Chat conversation marked as read',
    withUserId,
    markedCount,
    deliveredCount: readEventDeliveredCount,
    conversationDeliveredCount,
    unreadTotal: readerUnreadTotal,
    deliveredToReaderCount,
    deliveredToWithUserCount,
  });
};
