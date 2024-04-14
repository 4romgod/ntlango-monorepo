import React from 'react';
import { Typography, Grid, Box } from '@mui/material';
import { Event } from '@/lib/graphql/types/graphql';
import EventBoxDesktop from '@/components/events/event-box/desktop';
import EventBoxMobile from '@/components/events/event-box/mobile';

export type EventTileGridProps = {
  eventsByCategory: {
    [category: string]: Event[];
  };
};

export default function EventTileGrid({
  eventsByCategory,
}: EventTileGridProps) {
  return (
    <>
      {Object.keys(eventsByCategory).map((categoryName) => (
        <Box component="div" key={categoryName} marginBottom={10}>
          <Typography variant="h4" gutterBottom id={categoryName}>
            {categoryName}
          </Typography>
          <Grid container spacing={5}>
            {eventsByCategory[categoryName].map((event) => (
              <Grid
                item
                key={`EventTileGrid.${categoryName}.${event.id}`}
                xs={12}
                sm={6}
                lg={4}
              >
                <Box component="div" sx={{ display: { sm: 'none' } }}>
                  <EventBoxMobile event={event} />
                </Box>
                <Box
                  component="div"
                  sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                  <EventBoxDesktop event={event} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </>
  );
}
