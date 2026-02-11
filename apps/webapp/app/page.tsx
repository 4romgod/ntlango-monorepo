import HomeClient from '@/components/home/HomeClient';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Discover Local Events, Venues, and Communities',
  description:
    'Find upcoming events, explore venues, and connect with organizations and people who share your interests on Ntlango.',
  keywords: ['events', 'venues', 'organizations', 'community', 'event discovery', 'Ntlango'],
});

// Enable ISR with 60-second revalidation for performance
export const revalidate = 60;

export default function HomePage() {
  return <HomeClient />;
}
