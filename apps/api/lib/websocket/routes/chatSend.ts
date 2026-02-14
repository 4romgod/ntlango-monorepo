import type { APIGatewayProxyResultV2 } from 'aws-lambda';
import { logger } from '@/utils/logger';
import { ensureDatabaseConnection } from '@/websocket/database';
import { parseBody, response } from '@/websocket/response';
import type { WebSocketRequestEvent } from '@/websocket/types';
import { touchConnection } from '@/websocket/routes/touch';
import { HttpStatusCode } from '@/constants';

export const handleChatSend = async (event: WebSocketRequestEvent): Promise<APIGatewayProxyResultV2> => {
  await ensureDatabaseConnection();
  const connectionId = await touchConnection(event);
  const payload = parseBody<{ recipientUserId?: unknown; message?: unknown }>(event.body);

  const recipientUserId = typeof payload?.recipientUserId === 'string' ? payload.recipientUserId.trim() : '';
  const message = typeof payload?.message === 'string' ? payload.message.trim() : '';

  if (!recipientUserId || !message) {
    return response(HttpStatusCode.BAD_REQUEST, {
      message: 'Invalid payload. recipientUserId and message are required.',
    });
  }

  logger.info('Chat message accepted for phased rollout', {
    connectionId,
    recipientUserId,
    messageLength: message.length,
  });

  return response(HttpStatusCode.OK, {
    message: 'Chat send acknowledged. Delivery will be implemented in the next phase.',
    recipientUserId,
  });
};
