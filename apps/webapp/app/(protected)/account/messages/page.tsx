import { Box } from '@mui/material';
import dynamicComponent from 'next/dynamic';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { buildPageMetadata } from '@/lib/metadata';
import { ROUTES } from '@/lib/constants';

const MessagesEntry = dynamicComponent(() => import('@/components/messages/MessagesEntry'));
const MONGO_OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export const metadata: Metadata = buildPageMetadata({
  title: 'Messages',
  description: 'Read and manage your private conversations on Ntlango.',
  noIndex: true,
});

type MessagesPageProps = {
  searchParams?: {
    username?: string | string[];
    with?: string | string[];
  };
};

const getFirst = (value?: string | string[]): string | undefined => {
  if (!value) {
    return undefined;
  }

  return Array.isArray(value) ? value[0] : value;
};

export default function MessagesPage({ searchParams }: MessagesPageProps) {
  const explicitUsername = getFirst(searchParams?.username);
  const legacyWithParam = getFirst(searchParams?.with);
  const usernameFromQuery =
    explicitUsername || (legacyWithParam && !MONGO_OBJECT_ID_REGEX.test(legacyWithParam) ? legacyWithParam : undefined);

  if (usernameFromQuery) {
    redirect(ROUTES.ACCOUNT.MESSAGE_WITH_USERNAME(usernameFromQuery));
  }

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
      }}
    >
      <MessagesEntry />
    </Box>
  );
}
