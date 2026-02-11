import ErrorPage from '@/components/errors/ErrorPage';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Access Denied',
  description: 'You do not have permission to view this page.',
  noIndex: true,
});

export default function ForbiddenPage() {
  return (
    <ErrorPage
      statusCode={403}
      title="Access denied"
      message="You don’t have permission to view this content. Make sure you’re logged in with the right account or contact support."
    />
  );
}
