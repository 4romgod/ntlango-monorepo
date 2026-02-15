import 'reflect-metadata';
import { startExpressApolloServer } from '@/graphql';
import { logger } from '@/utils/logger';
import { validateEnv } from '@/constants';
import { startLocalWebSocketServer } from '@/websocket/localServer';

// Validate environment configuration before starting server
validateEnv();

const parseBoolean = (value: string | undefined): boolean | null => {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) {
    return true;
  }

  if (['0', 'false', 'no', 'off'].includes(normalized)) {
    return false;
  }

  return null;
};

const shouldEnableLocalWebSocket = (() => {
  const explicitValue = parseBoolean(process.env.ENABLE_LOCAL_WEBSOCKET);
  if (explicitValue !== null) {
    return explicitValue;
  }

  return process.env.NODE_ENV !== 'production';
})();

const start = async () => {
  const server = await startExpressApolloServer();

  if (shouldEnableLocalWebSocket) {
    startLocalWebSocketServer(server.httpServer);
  } else {
    logger.info('Local websocket server is disabled', {
      enableLocalWebsocket: process.env.ENABLE_LOCAL_WEBSOCKET ?? 'unset',
    });
  }
};

start().catch((error) => {
  logger.error('An error occurred while attempting to start the server:', error);
});
