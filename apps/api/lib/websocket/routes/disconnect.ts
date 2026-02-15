import type { APIGatewayProxyResultV2 } from 'aws-lambda';
import { WebSocketConnectionDAO } from '@/mongodb/dao';
import { logger } from '@/utils/logger';
import { ensureDatabaseConnection } from '@/websocket/database';
import { getConnectionMetadata } from '@/websocket/event';
import { response } from '@/websocket/response';
import type { WebSocketRequestEvent } from '@/websocket/types';
import { HttpStatusCode } from '@/constants';

export const handleDisconnect = async (event: WebSocketRequestEvent): Promise<APIGatewayProxyResultV2> => {
  await ensureDatabaseConnection();

  const { connectionId } = getConnectionMetadata(event);
  const removed = await WebSocketConnectionDAO.removeConnection(connectionId);

  logger.info('WebSocket client disconnected', {
    connectionId,
    removed,
  });

  return response(HttpStatusCode.OK, { message: 'Disconnected' });
};
