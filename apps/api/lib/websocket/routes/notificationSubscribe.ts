import type { APIGatewayProxyResultV2 } from 'aws-lambda';
import { logger } from '@/utils/logger';
import { ensureDatabaseConnection } from '@/websocket/database';
import { parseBody, response } from '@/websocket/response';
import type { WebSocketRequestEvent } from '@/websocket/types';
import { touchConnection } from '@/websocket/routes/touch';
import { HttpStatusCode } from '@/constants';

export const handleNotificationSubscribe = async (event: WebSocketRequestEvent): Promise<APIGatewayProxyResultV2> => {
  await ensureDatabaseConnection();
  const connectionId = await touchConnection(event);
  const payload = parseBody<{ topics?: unknown }>(event.body);

  const topics =
    payload && Array.isArray(payload.topics)
      ? payload.topics.filter((topic): topic is string => typeof topic === 'string')
      : [];

  logger.info('Notification subscription acknowledged', {
    connectionId,
    topics,
  });

  return response(HttpStatusCode.OK, { message: 'Subscribed', topics });
};
