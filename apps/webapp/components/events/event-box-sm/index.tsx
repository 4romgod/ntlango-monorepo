'use client';

import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { CardContent, Typography } from '@mui/material';
import { Event } from '@/data/graphql/types/graphql';
import { Box } from '@mui/material';
import { CalendarToday, LocationOn, CheckBoxRounded } from '@mui/icons-material';
import { RRule } from 'rrule';
import Link from 'next/link';

export default function EventBoxSm({ event }: { event: Event }) {
  const { recurrenceRule, participants, location, media, heroImage } = event;
  const recurrenceText = RRule.fromString(recurrenceRule).toText();
  const imageUrl = heroImage || media?.featuredImageUrl || 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80';
  const cityLabel = location?.address?.city || 'Featured';
  const locationLabel = location?.address
    ? `${location.address.country}, ${location.address.city}`
    : 'Location TBA';
  const participantCount = participants?.length ?? 0;

  return (
    <Link href={`/events/${event.slug}`}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.12)'
          },
          borderRadius: 2,
          overflow: 'hidden',
          minHeight: 240,
        }}
      >
        <Box sx={{ position: 'relative', paddingTop: '52%', overflow: 'hidden' }}>
          <CardMedia
            component="img"
            image={imageUrl}
            alt={event.title}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              px: 1,
              py: 0.5,
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.92)',
              color: 'primary.dark',
              fontWeight: 700,
              fontSize: '0.7rem',
              letterSpacing: 0.4,
              textTransform: 'uppercase',
            }}
          >
            {cityLabel}
          </Box>
        </Box>
        <CardContent sx={{ flexGrow: 1, p: 1.25 }}>
          <Typography gutterBottom variant="subtitle2" component="h2" fontWeight="bold" sx={{ mb: 0.4 }}>
            {event.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.4 }}>
            <CalendarToday fontSize="inherit" sx={{ color: 'text.secondary', mr: 0.75, fontSize: '0.78rem' }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.78rem' }}>
              {recurrenceText}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.4 }}>
            <LocationOn fontSize="inherit" sx={{ color: 'text.secondary', mr: 0.75, fontSize: '0.78rem' }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.78rem' }}>
              {locationLabel}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckBoxRounded fontSize="inherit" sx={{ color: 'text.secondary', mr: 0.75, fontSize: '0.78rem' }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.78rem' }}>
              {participantCount} RSVP&lsquo;s
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Link>
  )
}
