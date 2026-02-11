import type { Metadata } from 'next';
import CreateOrganizationPageClient from './page-client';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Create Organization',
  description: 'Create a new organization profile, upload branding, and start building your team.',
  noIndex: true,
});

export default function CreateOrganizationPage() {
  return <CreateOrganizationPageClient />;
}
