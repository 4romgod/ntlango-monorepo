import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import type { Notification } from '@ntlango/commons/types';
import { AWS_REGION } from '@/constants';
import { NotificationDAO, WebSocketConnectionDAO } from '@/mongodb/dao';
import { logger } from '@/utils/logger';

interface NotificationEventPayload {
  notification: Notification;
  unreadCount: number;
}

interface RealtimeEventEnvelope<TPayload> {
  type: string;
  payload: TPayload;
  sentAt: string;
}

const EVENT_TYPES = {
  NOTIFICATION_NEW: 'notification.new',
} as const;

const managementClientCache = new Map<string, ApiGatewayManagementApiClient>();

const toManagementEndpoint = (domainName: string, stage: string): string => {
  const normalizedDomain = domainName.startsWith('http') ? domainName : `https://${domainName}`;
  const withoutTrailingSlash = normalizedDomain.replace(/\/+$/, '');
  return `${withoutTrailingSlash}/${stage}`;
};

const getManagementClient = (domainName: string, stage: string): ApiGatewayManagementApiClient => {
  const endpoint = toManagementEndpoint(domainName, stage);
  const cachedClient = managementClientCache.get(endpoint);
  if (cachedClient) {
    return cachedClient;
  }

  const client = new ApiGatewayManagementApiClient({
    region: AWS_REGION,
    endpoint,
  });

  managementClientCache.set(endpoint, client);
  return client;
};

const isGoneConnectionError = (error: unknown): boolean => {
  const statusCode = (error as { $metadata?: { httpStatusCode?: number } })?.$metadata?.httpStatusCode;
  const errorName = (error as { name?: string })?.name;
  return statusCode === 410 || errorName === 'GoneException';
};

const postToConnection = async (connection: {
  connectionId: string;
  domainName: string;
  stage: string;
}, payload: RealtimeEventEnvelope<NotificationEventPayload>): Promise<void> => {
  const client = getManagementClient(connection.domainName, connection.stage);
  const command = new PostToConnectionCommand({
    ConnectionId: connection.connectionId,
    Data: Buffer.from(JSON.stringify(payload)),
  });

  await client.send(command);
};

export const publishNotificationCreated = async (notification: Notification): Promise<void> => {
  try {
    const userId = notification.recipientUserId;
    const connections = await WebSocketConnectionDAO.readConnectionsByUserId(userId);

    if (connections.length === 0) {
      logger.debug('No active websocket connections for notification recipient', { userId });
      return;
    }

    const unreadCount = await NotificationDAO.countUnread(userId);
    const eventPayload: RealtimeEventEnvelope<NotificationEventPayload> = {
      type: EVENT_TYPES.NOTIFICATION_NEW,
      payload: {
        notification,
        unreadCount,
      },
      sentAt: new Date().toISOString(),
    };

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
