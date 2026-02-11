import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { getClient } from '@/data/graphql';
import { GetAllEventCategoryGroupsDocument } from '@/data/graphql/types/graphql';
import type { EventCategoryGroup } from '@/data/graphql/types/graphql';
import CategoryCard from '@/components/categories/CategoryCard';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Event Categories',
  description: 'Explore curated event categories to quickly find music, business, wellness, arts, and more.',
  keywords: ['event categories', 'discover events by interest', 'music events', 'community events'],
});

export const revalidate = 60;

export default async function CategoriesPage() {
  const { data } = await getClient().query({
    query: GetAllEventCategoryGroupsDocument,
  });

  const groups: EventCategoryGroup[] = data?.readEventCategoryGroups ?? [];
  const totalCategories = groups.reduce((count, group) => count + (group.eventCategories?.length ?? 0), 0);

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Stack spacing={5}>
          <Stack spacing={2}>
            <Typography variant="overline" sx={{ letterSpacing: 4, color: 'primary.main', fontWeight: 700 }}>
              EXPLORE
            </Typography>
            <Typography variant="h3" fontWeight={800} sx={{ lineHeight: 1.15 }}>
              Discover events by category
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640 }}>
              Browse curated event categories grouped by the types of experiences people love. Tap a category to see
              every upcoming event that matches that interest.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              {groups.length} category groups · {totalCategories} categories
            </Typography>
          </Stack>

          {groups.length === 0 ? (
            <Typography color="text.secondary">No categories are available right now. Check back soon!</Typography>
          ) : (
            <Stack spacing={6}>
              {groups.map((group) => (
                <Box key={group.slug}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems="baseline"
                    spacing={1}
                  >
                    <Typography variant="h5" fontWeight={700}>
                      {group.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {group.eventCategories?.length ?? 0} categories
                    </Typography>
                  </Stack>
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    {(group.eventCategories ?? []).map((category) => (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category.eventCategoryId}>
                        <CategoryCard category={category} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
