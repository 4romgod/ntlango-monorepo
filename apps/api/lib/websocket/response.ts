import type { APIGatewayProxyResultV2 } from 'aws-lambda';

export const response = (statusCode: number, body: Record<string, unknown>): APIGatewayProxyResultV2 => ({
  statusCode,
  body: JSON.stringify(body),
});

export const parseBody = <T>(body: string | null | undefined): T | null => {
  if (!body) {
    return null;
  }

  try {
    return JSON.parse(body) as T;
  } catch {
    return null;
  }
};
