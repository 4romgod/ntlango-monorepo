import { CONNECTION_TTL_HOURS } from '@/websocket/constants';
import { getConnectionMetadata } from '@/websocket/event';
import type { WebSocketRequestEvent } from '@/websocket/types';
import { WebSocketConnectionDAO } from '@/mongodb/dao';

export const touchConnection = async (event: WebSocketRequestEvent): Promise<string> => {
  const { connectionId } = getConnectionMetadata(event);
  await WebSocketConnectionDAO.touchConnection(connectionId, CONNECTION_TTL_HOURS);
  return connectionId;
};
