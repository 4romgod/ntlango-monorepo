const FALLBACK_CONNECTION_TTL_HOURS = 24;
const parsedTtl = Number.parseInt(process.env.WEBSOCKET_CONNECTION_TTL_HOURS ?? '', 10);

export const CONNECTION_TTL_HOURS =
  Number.isFinite(parsedTtl) && parsedTtl > 0 ? parsedTtl : FALLBACK_CONNECTION_TTL_HOURS;

export const WEBSOCKET_AUTH_QUERY_KEY = 'token';

export const WEBSOCKET_ROUTES = {
  CONNECT: '$connect',
  DISCONNECT: '$disconnect',
  DEFAULT: '$default',
  PING: 'ping',
  NOTIFICATION_SUBSCRIBE: 'notification.subscribe',
  CHAT_SEND: 'chat.send',
} as const;
