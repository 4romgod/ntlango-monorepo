import type { APIGatewayProxyResultV2 } from 'aws-lambda';
import { ensureDatabaseConnection } from '@/websocket/database';
import { response } from '@/websocket/response';
import type { WebSocketRequestEvent } from '@/websocket/types';
import { touchConnection } from '@/websocket/routes/touch';
import { HttpStatusCode } from '@/constants';

export const handlePing = async (event: WebSocketRequestEvent): Promise<APIGatewayProxyResultV2> => {
  await ensureDatabaseConnection();
  await touchConnection(event);
  return response(HttpStatusCode.OK, { message: 'pong' });
};
