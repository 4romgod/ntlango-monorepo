import React from 'react';
import { Typography, Grid, Box, Divider } from '@mui/material';
import { EventType } from '@/data/graphql/types/graphql';
import EventBox from '@/components/events/event-box';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export type EventTileGridProps = {
  eventsByCategory: {
    [category: string]: EventType[];
  };
};

export default function EventTileGrid({ eventsByCategory }: EventTileGridProps) {
  return (
    <>
      {Object.keys(eventsByCategory).map((categoryName) => (
        <Box component="div" key={categoryName} marginBottom={10}>
          <Typography variant="h4" gutterBottom id={categoryName}>
            {categoryName}
          </Typography>
          <Divider />
          <Grid container spacing={5}>
            {eventsByCategory[categoryName].map((event) => (
              <Grid item key={`EventTileGrid.${categoryName}.${event.eventId}`} xs={12}>
                <Box component="div">
                  <Link href={ROUTES.EVENTS.EVENT(event.slug)}>
                    <EventBox event={event} />
                  </Link>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </>
  );
}
