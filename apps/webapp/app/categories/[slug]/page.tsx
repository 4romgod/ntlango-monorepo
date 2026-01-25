import Link from 'next/link';
import { alpha, Box, Button, Container, Stack, Typography } from '@mui/material';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getClient } from '@/data/graphql';
import { GetAllEventsDocument, GetEventCategoryBySlugDocument } from '@/data/graphql/types/graphql';
import EventTileGrid from '@/components/events/EventTileGrid';
import { ROUTES } from '@/lib/constants';
import { getEventCategoryIcon } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Categories · Ntlango',
  description: 'Browse every event stacked under a single category.',
};

export const revalidate = 60;

type CategoryPageParams = {
  slug: string;
};

type CategoryPageProps = {
  params: Promise<CategoryPageParams>;
};

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const client = getClient();

  const [{ data: categoryData }, { data: eventsData }] = await Promise.all([
    client.query({
      query: GetEventCategoryBySlugDocument,
      variables: { slug },
    }),
    client.query({
      query: GetAllEventsDocument,
      variables: {
        options: {
          filters: [{ field: 'eventCategories.slug', value: slug }],
          pagination: { limit: 40 },
        },
      },
    }),
  ]);

  const category = categoryData?.readEventCategoryBySlug;
  if (!category) {
    notFound();
  }

  const events = eventsData?.readEvents ?? [];
  const IconComponent = getEventCategoryIcon(category.iconName);
  const categoryColor = category.color;
  const avatarBackground = categoryColor ? alpha(categoryColor, 0.15) : 'action.selected';
  const iconColor = categoryColor ?? 'text.primary';

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
            spacing={3}
          >
            <Stack direction="row" alignItems="center" spacing={3}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '16px',
                  backgroundColor: avatarBackground,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: iconColor,
                }}
              >
                <IconComponent width={26} height={26} />
              </Box>
              <Stack spacing={0.5}>
                <Typography variant="overline" sx={{ letterSpacing: 4, color: 'text.secondary' }}>
                  EVENT CATEGORY
                </Typography>
                <Typography variant="h3" fontWeight={800}>
                  {category.name}
                </Typography>
              </Stack>
            </Stack>

            <Button
              component={Link}
              href={ROUTES.CATEGORIES.ROOT}
              variant="outlined"
              sx={{ borderRadius: 10, textTransform: 'none', fontWeight: 600 }}
            >
              Browse all categories
            </Button>
          </Stack>

          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640 }}>
            {category.description ||
              'Events curated for this interest will show up below. Subscribe or host your next event today.'}
          </Typography>

          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600}>
              {events.length} event{events.length === 1 ? '' : 's'} matching {category.name}
            </Typography>
            <EventTileGrid events={events} skeletonCount={3} />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
