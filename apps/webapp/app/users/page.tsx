import UsersPageClient from '@/components/users/UsersPageClient';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Community Members',
  description: 'Discover people in the Ntlango community, follow profiles, and connect through shared interests.',
  keywords: ['community', 'user profiles', 'follow creators', 'event community'],
});

export const revalidate = 120;

export default async function Page() {
  return <UsersPageClient />;
}
