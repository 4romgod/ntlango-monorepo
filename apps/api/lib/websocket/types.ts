import type { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';

export type WebSocketRequestEvent = APIGatewayProxyWebsocketEventV2 & {
  headers?: Record<string, string | undefined>;
  queryStringParameters?: Record<string, string | undefined>;
};
