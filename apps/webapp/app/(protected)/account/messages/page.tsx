import { Box } from '@mui/material';
import dynamicComponent from 'next/dynamic';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/metadata';

const MessagesPanel = dynamicComponent(() => import('@/components/messages/MessagesPanel'));

export const metadata: Metadata = buildPageMetadata({
  title: 'Messages',
  description: 'Read and manage your private conversations on Ntlango.',
  noIndex: true,
});

export default function MessagesPage() {
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
      }}
    >
      <MessagesPanel />
    </Box>
  );
}
