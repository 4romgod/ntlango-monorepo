import EventBoxDesktop from '@/components/events/event-box/desktop';
import { GetAllEventsDocument } from '@/data/graphql/types/graphql';
import { getClient } from '@/data/graphql';
import { auth } from '@/auth';
import { ROUTES } from '@/lib/constants';
import Link from 'next/link';

export default async function EventsPage() {
  const session = await auth();
  if (!session) {
    return;
  }

  const { data: events } = await getClient().query({
    query: GetAllEventsDocument,
    variables: {
      queryParams: {
        organizers: [session.user.id],
      },
    },
  });

  return (
    <main>
      <div>
        {events.readEvents.map((event) => {
          return (
            <Link key={event.id} href={ROUTES.ACCOUNT.EVENTS.EVENT(event.slug)}>
              <EventBoxDesktop key={event.id} event={event} />;
            </Link>
          );
        })}
      </div>
      <h1>Events Page</h1>
    </main>
  );
}
