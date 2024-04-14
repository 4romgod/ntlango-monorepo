import React from 'react';
import { Typography, Grid, Box } from '@mui/material';
import EventSmallBox from '@/components/events/event-small-box';
import { Event } from '@/lib/graphql/types/graphql';

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
                <EventSmallBox event={event} />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </>
  );
}
