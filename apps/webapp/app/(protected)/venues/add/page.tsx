import type { Metadata } from 'next';
import { Box, Container, Stack, Typography } from '@mui/material';
import { auth } from '@/auth';
import VenueCreationForm from '@/components/venue/VenueCreationForm';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Add Venue',
  description: 'Create a reusable venue profile with address, map details, and amenities for future events.',
  noIndex: true,
});

export const dynamic = 'force-dynamic';

export default async function AddVenuePage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return null;
  }

  return (
    <Box component="main" sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 4, md: 6 } }}>
      <Container maxWidth="md">
        <Stack spacing={4}>
          <Stack spacing={1}>
            <Typography variant="overline" sx={{ color: 'secondary.main', fontWeight: 700, letterSpacing: 2 }}>
              VENUES
            </Typography>
            <Typography variant="h3" fontWeight={800}>
              Add a venue
            </Typography>
            <Typography color="text.secondary">
              Create a canonical venue record so that organizers can reuse the address, map pin, and amenities every
              time they schedule an event.
            </Typography>
          </Stack>
          <VenueCreationForm token={user.token} />
        </Stack>
      </Container>
    </Box>
  );
}
