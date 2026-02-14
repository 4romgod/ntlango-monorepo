'use client';

import { useApolloClient } from '@apollo/client';
import { useEffect, useMemo, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { GetNotificationsDocument, GetUnreadNotificationCountDocument } from '@/data/graphql/query';
import type { Notification } from '@/data/graphql/query/Notification/types';
import { WEBSOCKET_URL } from '@/lib/constants';
import { logger } from '@/lib/utils';

const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 30000;
const PING_INTERVAL_MS = 30000;
const DEFAULT_NOTIFICATION_PAGE_LIMIT = 20;

type RealtimeEnvelope = {
  type?: unknown;
  payload?: unknown;
};

type RealtimeNotificationPayload = {
  notification: Notification;
  unreadCount: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const isRealtimeNotificationPayload = (value: unknown): value is RealtimeNotificationPayload => {
  if (!isRecord(value)) {
    return false;
  }

  const notification = value.notification;
  const unreadCount = value.unreadCount;

  if (!isRecord(notification) || typeof unreadCount !== 'number') {
    return false;
  }

  return typeof notification.notificationId === 'string' && typeof notification.recipientUserId === 'string';
};

const normalizeWebSocketBaseUrl = (value: string): string | null => {
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

const addTokenToWebSocketUrl = (baseUrl: string, token: string): string => {
  try {
    const url = new URL(baseUrl);
    url.searchParams.set('token', token);
    return url.toString();
  } catch {
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}token=${encodeURIComponent(token)}`;
  }
};

const computeReconnectDelay = (attempt: number): number => {
  const exponentialDelay = Math.min(RECONNECT_MAX_MS, RECONNECT_BASE_MS * 2 ** attempt);
  const jitter = Math.floor(Math.random() * 500);
  return exponentialDelay + jitter;
};

export function useNotificationRealtime(enabled: boolean = true) {
  const client = useApolloClient();
  const { data: session } = useSession();
  const token = session?.user?.token;
  const websocketBaseUrl = useMemo(() => normalizeWebSocketBaseUrl(WEBSOCKET_URL), []);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const shouldReconnectRef = useRef(false);

  useEffect(() => {
    if (!enabled || !token || !websocketBaseUrl) {
      return;
    }

    shouldReconnectRef.current = true;

    const clearPing = () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
    };

    const clearReconnectTimeout = () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    const handleRealtimeNotification = (payload: RealtimeNotificationPayload) => {
      const { notification, unreadCount } = payload;

      client.writeQuery({
        query: GetUnreadNotificationCountDocument,
        data: {
          unreadNotificationCount: unreadCount,
        },
      });

      const updateNotificationListCache = (unreadOnly: boolean) => {
        client.cache.updateQuery(
          {
            query: GetNotificationsDocument,
            variables: { limit: DEFAULT_NOTIFICATION_PAGE_LIMIT, unreadOnly },
          },
          (existing) => {
            if (!existing?.notifications) {
              return existing;
            }

            const currentItems = existing.notifications.notifications;
            const alreadyExists = currentItems.some((item) => item.notificationId === notification.notificationId);

            let nextItems = currentItems;
            if (!alreadyExists && (!unreadOnly || notification.isRead === false)) {
              const maxItems = Math.max(currentItems.length, DEFAULT_NOTIFICATION_PAGE_LIMIT);
              nextItems = [notification as (typeof currentItems)[number], ...currentItems].slice(0, maxItems);
            }

            return {
              ...existing,
              notifications: {
                ...existing.notifications,
                unreadCount,
                notifications: nextItems,
              },
            };
          },
        );
      };

      updateNotificationListCache(false);
      updateNotificationListCache(true);
    };

    const connect = () => {
      if (!shouldReconnectRef.current) {
        return;
      }

      clearReconnectTimeout();
      clearPing();

      const socketUrl = addTokenToWebSocketUrl(websocketBaseUrl, token);
      const socket = new WebSocket(socketUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        reconnectAttemptsRef.current = 0;
        logger.info('WebSocket connected for realtime notifications');

        try {
          socket.send(
            JSON.stringify({
              action: 'notification.subscribe',
              topics: ['bell'],
            }),
          );
        } catch (error) {
          logger.warn('Failed to send notification subscription message', error);
        }

        pingIntervalRef.current = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ action: 'ping' }));
          }
        }, PING_INTERVAL_MS);
      };

      socket.onmessage = (event) => {
        if (typeof event.data !== 'string') {
          return;
        }

        let parsed: RealtimeEnvelope;
        try {
          parsed = JSON.parse(event.data) as RealtimeEnvelope;
        } catch {
          return;
        }

        if (parsed.type !== 'notification.new') {
          return;
        }

        if (!isRealtimeNotificationPayload(parsed.payload)) {
          logger.warn('Received malformed notification websocket payload');
          return;
        }

        handleRealtimeNotification(parsed.payload);
      };

      socket.onerror = (event) => {
        logger.warn('Notification websocket error', event);
      };

      socket.onclose = (event) => {
        clearPing();

        if (!shouldReconnectRef.current) {
          return;
        }

        const reconnectDelay = computeReconnectDelay(reconnectAttemptsRef.current);
        reconnectAttemptsRef.current += 1;

        logger.warn('Notification websocket disconnected, scheduling reconnect', {
          code: event.code,
          reason: event.reason || 'no reason',
          reconnectDelayMs: reconnectDelay,
        });

        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, reconnectDelay);
      };
    };

    connect();

    return () => {
      shouldReconnectRef.current = false;
      clearReconnectTimeout();
      clearPing();

      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [client, enabled, token, websocketBaseUrl]);
}
