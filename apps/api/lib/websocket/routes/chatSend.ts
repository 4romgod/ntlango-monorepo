import type { APIGatewayProxyResultV2 } from 'aws-lambda';
import { ChatMessageDAO, WebSocketConnectionDAO } from '@/mongodb/dao';
import { logger } from '@/utils/logger';
import { CHAT_MESSAGE_MAX_LENGTH, WEBSOCKET_EVENT_TYPES } from '@/websocket/constants';
import { ensureDatabaseConnection } from '@/websocket/database';
import {
  createRealtimeEventEnvelope,
  deduplicateConnections,
  isGoneConnectionError,
  postToConnection,
} from '@/websocket/gateway';
import { parseBody, response } from '@/websocket/response';
import type { WebSocketRequestEvent } from '@/websocket/types';
import { touchConnection } from '@/websocket/routes/touch';
import { HttpStatusCode } from '@/constants';

interface ChatSendPayload {
  recipientUserId?: unknown;
  message?: unknown;
}

interface ChatMessageEventPayload {
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
  reason: 'chat.send';
  updatedAt: string;
  lastMessage: ChatMessageEventPayload;
}

export const handleChatSend = async (event: WebSocketRequestEvent): Promise<APIGatewayProxyResultV2> => {
  await ensureDatabaseConnection();
  const connectionId = await touchConnection(event);
  const payload = parseBody<ChatSendPayload>(event.body);

  const recipientUserId = typeof payload?.recipientUserId === 'string' ? payload.recipientUserId.trim() : '';
  const message = typeof payload?.message === 'string' ? payload.message.trim() : '';

  if (!recipientUserId || !message) {
    return response(HttpStatusCode.BAD_REQUEST, {
      message: 'Invalid payload. recipientUserId and message are required.',
    });
  }

  if (message.length > CHAT_MESSAGE_MAX_LENGTH) {
    return response(HttpStatusCode.BAD_REQUEST, {
      message: `Message exceeds max length of ${CHAT_MESSAGE_MAX_LENGTH} characters.`,
    });
  }

  const senderConnection = await WebSocketConnectionDAO.readConnectionByConnectionId(connectionId);
  if (!senderConnection) {
    logger.warn('Chat send rejected because connection metadata was not found', { connectionId });
    return response(HttpStatusCode.UNAUTHENTICATED, {
      message: 'Connection is not registered. Reconnect and try again.',
    });
  }

  const senderUserId = senderConnection.userId;
  const [recipientConnections, senderConnections] = await Promise.all([
    WebSocketConnectionDAO.readConnectionsByUserId(recipientUserId),
    WebSocketConnectionDAO.readConnectionsByUserId(senderUserId),
  ]);

  const targetConnections = deduplicateConnections(recipientConnections, senderConnections);

  const chatMessage = await ChatMessageDAO.create({
    senderUserId,
    recipientUserId,
    message,
  });
  const messageId = chatMessage.chatMessageId;
  const createdAt = chatMessage.createdAt.toISOString();
  const messageEventPayload = createRealtimeEventEnvelope<ChatMessageEventPayload>(WEBSOCKET_EVENT_TYPES.CHAT_MESSAGE, {
    messageId,
    senderUserId,
    recipientUserId,
    message,
    isRead: chatMessage.isRead,
    createdAt,
  });
  const [senderUnreadCount, recipientUnreadCount, senderUnreadTotal, recipientUnreadTotal] = await Promise.all([
    ChatMessageDAO.countUnreadForConversation(senderUserId, recipientUserId),
    ChatMessageDAO.countUnreadForConversation(recipientUserId, senderUserId),
    ChatMessageDAO.countUnreadTotal(senderUserId),
    ChatMessageDAO.countUnreadTotal(recipientUserId),
  ]);

  let messageDeliveredCount = 0;
  let conversationDeliveredCount = 0;
  let failedCount = 0;
  let staleCount = 0;

  await Promise.all(
    [...targetConnections.values()].map(async (connection) => {
      const isSenderConnection = connection.userId === senderUserId;
      const conversationUpdatedEventPayload = createRealtimeEventEnvelope<ChatConversationUpdatedEventPayload>(
        WEBSOCKET_EVENT_TYPES.CHAT_CONVERSATION_UPDATED,
        {
          conversationWithUserId: isSenderConnection ? recipientUserId : senderUserId,
          unreadCount: isSenderConnection ? senderUnreadCount : recipientUnreadCount,
          unreadTotal: isSenderConnection ? senderUnreadTotal : recipientUnreadTotal,
          reason: 'chat.send',
          updatedAt: createdAt,
          lastMessage: {
            messageId,
            senderUserId,
            recipientUserId,
            message,
            isRead: chatMessage.isRead,
            createdAt,
          },
        },
      );

      try {
        await postToConnection(connection, messageEventPayload);
        messageDeliveredCount += 1;
        await postToConnection(connection, conversationUpdatedEventPayload);
        conversationDeliveredCount += 1;
      } catch (error) {
        if (isGoneConnectionError(error)) {
          staleCount += 1;
          await WebSocketConnectionDAO.removeConnection(connection.connectionId);
          logger.info('Removed stale websocket connection while delivering chat message', {
            connectionId: connection.connectionId,
            senderUserId,
            recipientUserId,
          });
          return;
        }

        failedCount += 1;
        logger.warn('Failed to deliver websocket chat message', {
          connectionId: connection.connectionId,
          senderUserId,
          recipientUserId,
          error,
        });
      }
    }),
  );

  logger.info('Processed websocket chat message', {
    connectionId,
    senderUserId,
    recipientUserId,
    messageId,
    messageLength: message.length,
    recipientConnections: recipientConnections.length,
    senderUnreadCount,
    recipientUnreadCount,
    senderUnreadTotal,
    recipientUnreadTotal,
    messageDeliveredCount,
    conversationDeliveredCount,
    failedCount,
    staleCount,
  });

  return response(HttpStatusCode.OK, {
    message: 'Chat message processed',
    messageId,
    createdAt,
    isRead: chatMessage.isRead,
    recipientUserId,
    deliveredCount: messageDeliveredCount,
    conversationDeliveredCount,
    unreadTotal: senderUnreadTotal,
    recipientOnline: recipientConnections.length > 0,
  });
};
