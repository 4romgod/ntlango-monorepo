import { Metadata } from 'next';
import { getClient } from '@/data/graphql';
import { EventCategory, GetAllEventCategoriesDocument, GetAllEventsDocument } from '@/data/graphql/types/graphql';
import { EventPreview } from '@/data/graphql/query/Event/types';
import EventsClientWrapper from '@/components/events/events-client-wrapper';

export const metadata: Metadata = {
  title: {
    default: 'Ntlango | Events',
    template: 'Ntlango | Events',
  },
  icons: {
    icon: '/logo-img.png',
    shortcut: '/logo-img.png',
    apple: '/logo-img.png',
  },
};

// Enable ISR with 60-second revalidation for performance
export const revalidate = 60;

export default async function Events() {
  // Parallelize queries for faster page load
  const [{ data: events }, { data: eventCategories }] = await Promise.all([
    getClient().query({
      query: GetAllEventsDocument,
    }),
    getClient().query({
      query: GetAllEventCategoriesDocument,
    }),
  ]);

  const allCategories: EventCategory[] = eventCategories.readEventCategories;
  const eventsList = (events.readEvents ?? []) as EventPreview[];

  return <EventsClientWrapper events={eventsList} categories={allCategories} />;
}
