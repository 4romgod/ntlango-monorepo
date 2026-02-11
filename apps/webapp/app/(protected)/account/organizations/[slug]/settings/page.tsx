import OrganizationSettingsClient from '@/components/organization/OrganizationSettingsClient';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/metadata';

interface Props {
  params: Promise<{ slug: string }>;
}

export const metadata: Metadata = buildPageMetadata({
  title: 'Organization Settings',
  description: 'Update organization profile, members, and permissions.',
  noIndex: true,
});

export default async function OrganizationSettingsPage({ params }: Props) {
  const { slug } = await params;
  return <OrganizationSettingsClient slug={slug} />;
}
