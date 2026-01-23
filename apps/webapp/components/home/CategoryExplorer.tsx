import { Box, Container, Typography, Stack } from '@mui/material';
import EventCategoryCard from '@/components/events/category/EventCategoryCard';
import { SECTION_TITLE_STYLES, SPACING } from '@/lib/constants';
import { EventCategory } from '@/data/graphql/types/graphql';

interface CategoryExplorerProps {
  categories: EventCategory[];
}

export default function CategoryExplorer({ categories = [] }: CategoryExplorerProps) {
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

        <Box
          sx={{
            overflowX: 'auto',
            width: '100%',
            pb: 1,
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE/Edge
            '&::-webkit-scrollbar': { display: 'none' }, // Chrome/Safari
          }}
        >
          <Stack direction="row" spacing={2} sx={{ minWidth: 0 }}>
            {categories.map((category, index) => (
              <Box key={index} sx={{ minWidth: 120, flex: '0 0 auto' }}>
                <EventCategoryCard eventCategory={category} />
              </Box>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
