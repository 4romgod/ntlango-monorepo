import { GetNotificationsQuery } from '@/data/graphql/types/graphql';

export type NotificationConnection = NonNullable<GetNotificationsQuery['notifications']>;
export type Notification = NotificationConnection['notifications'][number];
