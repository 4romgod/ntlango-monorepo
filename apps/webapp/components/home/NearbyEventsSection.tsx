'use client';
import { Box, Typography, Card, CardContent, Skeleton, Stack } from '@mui/material';
import EventCarousel from '@/components/events/carousel';
import { useQuery } from '@apollo/client';
import { GetAllEventsDocument } from '@/data/graphql/query/Event/query';
import { useSession } from 'next-auth/react';
import { getAuthHeader } from '@/lib/utils';

// Helper: get this weekend's date range
function getThisWeekendRange() {
  const now = new Date();
  const day = now.getDay();
  // Friday (5) to Sunday (0)
  const friday = new Date(now);
  friday.setDate(now.getDate() + ((5 - day + 7) % 7));
  friday.setHours(0, 0, 0, 0);
  const sunday = new Date(friday);
  sunday.setDate(friday.getDate() + 2);
  sunday.setHours(23, 59, 59, 999);
  return { start: friday.toISOString(), end: sunday.toISOString() };
}

export default function NearbyEventsSection() {
    const { data: session } = useSession();
    const token = session?.user?.token;
  
  // TODO For demo, use a static location (could use user profile or geolocation API)
  const location = {
    city: undefined,
    state: undefined,
    country: undefined,
    latitude: undefined,
    longitude: undefined,
    radiusKm: 50,
  };
  const { start, end } = getThisWeekendRange();
  const { data, loading, error } = useQuery(GetAllEventsDocument, {
    variables: {
      options: {
        location,
        dateFilterOption: undefined,
        customDate: start,
      },
    },
    fetchPolicy: 'cache-and-network',
    context: {
      headers: getAuthHeader(token),
    },
  });

  const events = data?.readEvents ?? [];

  return (
    <Box sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 1, md: 2 } }}>
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mb: { xs: 1, md: 2 }, fontSize: { xs: '1.1rem', md: '1.25rem' } }}
      >
        Nearby / This Weekend
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
        <Typography color="error">Failed to load nearby events.</Typography>
      ) : events.length === 0 ? (
        <Typography color="text.secondary">No nearby events this weekend. Check back soon!</Typography>
      ) : (
        <Stack gap={{ xs: 1.5, md: 2 }}>
          <EventCarousel events={events} />
        </Stack>
      )}
    </Box>
  );
}
