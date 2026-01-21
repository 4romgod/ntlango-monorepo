'use client';
import { Box, Button, Typography, Card, CardContent, Skeleton, Stack } from '@mui/material';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GetAllEventsDocument } from '@/data/graphql/query/Event/query';
import EventTileGrid from '../events/event-tile-grid';
import { useSession } from 'next-auth/react';
import { getAuthHeader } from '@/lib/utils';

export default function TrendingEventsSection() {
  const { data: session } = useSession();
  const token = session?.user?.token;

  const { data, loading, error } = useQuery(GetAllEventsDocument, {
    variables: { options: {} },
    fetchPolicy: 'cache-and-network',
    context: {
      headers: getAuthHeader(token),
    },
  });

  const events = (data?.readEvents ?? []).slice().sort((a, b) => (b.rsvpCount ?? 0) - (a.rsvpCount ?? 0));

  return (
    <Box sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 1, md: 2 } }}>
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mb: { xs: 1, md: 2 }, fontSize: { xs: '1.1rem', md: '1.25rem' } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Trending Events
          <Button color="secondary" component={Link} href="/events" size="small">
            See all events
          </Button>
        </Box>
      </Typography>
      {loading || !data ? (
        <Stack gap={{ xs: 1.5, md: 2 }}>
          {[1, 2].map((i) => (
            <Card key={i} variant="outlined" sx={{ borderRadius: 3, p: { xs: 1.5, md: 3 } }}>
              <CardContent>
                <Skeleton variant="text" width="40%" height={28} />
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : error ? (
        <Typography color="error">Failed to load trending events.</Typography>
      ) : events.length === 0 ? (
        <Typography color="text.secondary">No trending events right now. Check back soon!</Typography>
      ) : (
        <Stack gap={{ xs: 1.5, md: 2 }}>
          <EventTileGrid events={events.slice(0, 4)} loading={loading} />
        </Stack>
      )}
    </Box>
  );
}
