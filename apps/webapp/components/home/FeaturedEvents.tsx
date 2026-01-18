import { Box, Container } from '@mui/material';
import EventsCarousel from '@/components/events/carousel';
import { EventPreview } from '@/data/graphql/query/Event/types';

interface FeaturedEventsProps {
  events: EventPreview[];
  title?: string;
}

export default function FeaturedEvents({ events, title = 'Upcoming Events' }: FeaturedEventsProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <Box
      id="featured-events"
      sx={{
        backgroundColor: 'background.paper',
        py: { xs: 5, md: 7 },
      }}
    >
      <Container>
        <EventsCarousel
          events={events}
          title={title}
          autoplay={false}
          autoplayInterval={6000}
          itemWidth={260}
          showIndicators={true}
          viewAllEventsButton={true}
        />
      </Container>
    </Box>
  );
}
