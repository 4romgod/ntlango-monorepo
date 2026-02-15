import { WEBSOCKET_AUTH_QUERY_KEY } from '@/websocket/constants';
import type { WebSocketRequestEvent } from '@/websocket/types';

export const extractToken = (event: WebSocketRequestEvent): string | undefined => {
  const queryToken = event.queryStringParameters?.[WEBSOCKET_AUTH_QUERY_KEY];
  if (queryToken) {
    return queryToken;
  }

  const authHeader = event.headers?.authorization || event.headers?.Authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  return undefined;
};

export const getConnectionMetadata = (event: WebSocketRequestEvent) => {
  const { connectionId, domainName, stage } = event.requestContext;

  if (!connectionId || !domainName || !stage) {
    throw new Error('WebSocket request context is missing connection metadata');
  }

  return { connectionId, domainName, stage };
};
