import type { Metadata } from 'next';
import EventAttendeesPageClient from '@/components/events/EventAttendeesPageClient';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Event Attendees',
  description: 'Review attendee lists and participation for this event.',
  noIndex: true,
});

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <EventAttendeesPageClient slug={slug} />;
}
