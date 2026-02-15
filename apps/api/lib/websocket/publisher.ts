import type { Notification } from '@ntlango/commons/types';
import { NotificationDAO, WebSocketConnectionDAO } from '@/mongodb/dao';
import { logger } from '@/utils/logger';
import { WEBSOCKET_EVENT_TYPES } from '@/websocket/constants';
import {
  createRealtimeEventEnvelope,
  isGoneConnectionError,
  postToConnection,
  type RealtimeEventEnvelope,
} from '@/websocket/gateway';

interface NotificationEventPayload {
  notification: Notification;
  unreadCount: number;
}

export const publishNotificationCreated = async (notification: Notification): Promise<void> => {
  try {
    const userId = notification.recipientUserId;
    const connections = await WebSocketConnectionDAO.readConnectionsByUserId(userId);

    if (connections.length === 0) {
      logger.debug('No active websocket connections for notification recipient', { userId });
      return;
    }

    const unreadCount = await NotificationDAO.countUnread(userId);
    const eventPayload: RealtimeEventEnvelope<NotificationEventPayload> = createRealtimeEventEnvelope(
      WEBSOCKET_EVENT_TYPES.NOTIFICATION_NEW,
      {
        notification,
        unreadCount,
      },
    );

    await Promise.all(
      connections.map(async (connection) => {
        try {
          await postToConnection(connection, eventPayload);
        } catch (error) {
          if (isGoneConnectionError(error)) {
            await WebSocketConnectionDAO.removeConnection(connection.connectionId);
            logger.info('Removed stale websocket connection after GoneException', {
              connectionId: connection.connectionId,
              userId,
            });
            return;
          }

          logger.warn('Failed to publish websocket notification event', {
            connectionId: connection.connectionId,
            userId,
            error,
          });
        }
      }),
    );
  } catch (error) {
    logger.error('Failed to publish notification event', {
      error,
      recipientUserId: notification.recipientUserId,
      notificationId: notification.notificationId,
    });
  }
};

export const publishNotificationsCreated = async (notifications: Notification[]): Promise<void> => {
  await Promise.all(notifications.map((notification) => publishNotificationCreated(notification)));
};
