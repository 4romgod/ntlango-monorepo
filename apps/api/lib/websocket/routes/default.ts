import type { APIGatewayProxyResultV2 } from 'aws-lambda';
import { logger } from '@/utils/logger';
import { ensureDatabaseConnection } from '@/websocket/database';
import { parseBody, response } from '@/websocket/response';
import type { WebSocketRequestEvent } from '@/websocket/types';
import { touchConnection } from '@/websocket/routes/touch';
import { HttpStatusCode } from '@/constants';

export const handleDefault = async (event: WebSocketRequestEvent): Promise<APIGatewayProxyResultV2> => {
  await ensureDatabaseConnection();
  const connectionId = await touchConnection(event);
  const payload = parseBody<{ action?: unknown }>(event.body);
  const action = typeof payload?.action === 'string' ? payload.action : 'unknown';

  logger.warn('Unhandled websocket action', { connectionId, action });

  return response(HttpStatusCode.OK, {
    message: 'Action received on default route. No-op in phase 1.',
    action,
  });
};
