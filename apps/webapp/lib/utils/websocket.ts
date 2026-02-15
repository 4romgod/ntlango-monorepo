/**
 * WebSocket utility functions for realtime connections
 */

export const RECONNECT_BASE_MS = 1000;
export const RECONNECT_MAX_MS = 30000;
export const PING_INTERVAL_MS = 30000;

/**
 * Normalizes a WebSocket URL by converting http(s) protocols to ws(s)
 */
export const normalizeWebSocketBaseUrl = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith('https://')) {
    return `wss://${trimmed.slice('https://'.length)}`;
  }

  if (trimmed.startsWith('http://')) {
    return `ws://${trimmed.slice('http://'.length)}`;
  }

  return trimmed;
};

/**
 * Adds authentication token to WebSocket URL as query parameter
 */
export const addTokenToWebSocketUrl = (baseUrl: string, token: string): string => {
  try {
    const url = new URL(baseUrl);
    url.searchParams.set('token', token);
    return url.toString();
  } catch {
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}token=${encodeURIComponent(token)}`;
  }
};

/**
 * Computes exponential backoff delay with jitter for WebSocket reconnection
 */
export const computeReconnectDelay = (attempt: number): number => {
  const exponentialDelay = Math.min(RECONNECT_MAX_MS, RECONNECT_BASE_MS * 2 ** attempt);
  const jitter = Math.floor(Math.random() * 500);
  return exponentialDelay + jitter;
};
