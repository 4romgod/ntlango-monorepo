import { Metadata } from 'next';
import { getClient } from '@/data/graphql';
import { EventCategory, GetAllEventCategoriesDocument, GetAllEventsDocument } from '@/data/graphql/types/graphql';
import { EventPreview } from '@/data/graphql/query/Event/types';
import { GET_POPULAR_ORGANIZATIONS } from '@/data/graphql/query/Organization';
import EventsClientWrapper from '@/components/events/events-client-wrapper';
import { PopularOrganization } from '@/components/events/popular-organizer-box';

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

export const revalidate = 60;

export default async function Events() {
  const [{ data: events }, { data: eventCategories }, { data: organizations }] = await Promise.all([
    getClient().query({
      query: GetAllEventsDocument,
    }),
    getClient().query({
      query: GetAllEventCategoriesDocument,
    }),
    getClient().query({
      query: GET_POPULAR_ORGANIZATIONS,
    }),
  ]);

  const allCategories: EventCategory[] = eventCategories.readEventCategories;
  const eventsList = (events.readEvents ?? []) as EventPreview[];
  
  // Find the organization with highest follower count
  const orgsList = organizations.readOrganizations ?? [];
  const popularOrganization: PopularOrganization | null = orgsList.length > 0
    ? (orgsList as PopularOrganization[]).reduce((prev, current) => 
        (prev.followersCount > current.followersCount) ? prev : current
      )
    : null;

  const stats = {
    totalEvents: eventsList.length,
    activeOrganizations: orgsList.length,
  };

  return <EventsClientWrapper events={eventsList} categories={allCategories} popularOrganization={popularOrganization} stats={stats} />;
}
