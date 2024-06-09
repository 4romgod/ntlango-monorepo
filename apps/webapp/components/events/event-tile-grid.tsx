import React from 'react';
import { Typography, Grid, Box } from '@mui/material';
import { EventType } from '@/data/graphql/types/graphql';
import EventBoxDesktop from '@/components/events/event-box/desktop';
import EventBoxMobile from '@/components/events/event-box/mobile';
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
          <Grid container spacing={5}>
            {eventsByCategory[categoryName].map((event) => (
              <Grid item key={`EventTileGrid.${categoryName}.${event.id}`} xs={12} sm={6}>
                <Box component="div" sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Link href={ROUTES.EVENTS.EVENT(event.slug)}>
                    <EventBoxDesktop event={event} />
                  </Link>
                </Box>
                <Box component="div" sx={{ display: { md: 'none' } }}>
                  <Link href={ROUTES.EVENTS.EVENT(event.slug)}>
                    <EventBoxMobile event={event} />
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
