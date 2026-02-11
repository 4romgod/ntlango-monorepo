import { Container } from '@mui/material';
import EventsPageClient from '@/components/events/EventsPageClient';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Upcoming Events',
  description:
    'Browse upcoming events, filter by category and location, and RSVP to experiences that match your interests.',
  keywords: ['upcoming events', 'local events', 'RSVP', 'event discovery'],
});

export const revalidate = 60;

export default async function Events() {
  return (
    <Container>
      <EventsPageClient />
    </Container>
  );
}
