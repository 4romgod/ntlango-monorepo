'use client';

import { useNotificationRealtime } from '@/hooks/useNotificationRealtime';

export default function NotificationRealtimeListener() {
  useNotificationRealtime(true);
  return null;
}
