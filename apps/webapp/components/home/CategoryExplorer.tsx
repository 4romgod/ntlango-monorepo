import Link from 'next/link';
import { Explore } from '@mui/icons-material';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import EventCategoryBox from '@/components/events/category/box';
import { ROUTES, BUTTON_STYLES, SECTION_TITLE_STYLES, SPACING } from '@/lib/constants';
import { EventCategory } from '@/data/graphql/types/graphql';

interface CategoryExplorerProps {
  categories: EventCategory[];
}

export default function CategoryExplorer({ categories }: CategoryExplorerProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <Box
      id="explore-categories"
      sx={{
        backgroundColor: 'background.default',
        py: { xs: 5, md: 7 },
      }}
    >
      <Container>
        <Typography
          variant="h4"
          sx={{
            ...SECTION_TITLE_STYLES,
            mb: 1,
            textAlign: 'center',
            fontSize: { xs: '1.5rem', md: '2rem' },
          }}
        >
          Choose your kind of magic
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
          Discover spaces built for music lovers, builders, founders, foodies, and everyone in between.
        </Typography>

        <Grid container spacing={SPACING.standard} justifyContent="center">
          {categories.map((category, index) => (
            <Grid size={{ xs: 6, sm: 4, md: 2 }} key={index}>
              <EventCategoryBox eventCategory={category} />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<Explore />}
            component={Link}
            href={ROUTES.EVENTS.ROOT}
            sx={{ ...BUTTON_STYLES, px: 3 }}
          >
            Explore all categories
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
