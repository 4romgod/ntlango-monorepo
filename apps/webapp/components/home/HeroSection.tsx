'use client';

import Link from 'next/link';
import { Explore } from '@mui/icons-material';
import { Box, Button, Card, Chip, Grid, Typography } from '@mui/material';
import CustomContainer from '@/components/custom-container';
import { ROUTES, BUTTON_STYLES, BUTTON_PRIMARY_STYLES } from '@/lib/constants';
import { RRule } from 'rrule';
import { EventPreview } from '@/data/graphql/query/Event/types';

interface HeroSectionProps {
  heroEvent: EventPreview | null;
}

export default function HeroSection({ heroEvent }: HeroSectionProps) {
  const heroEventRsvps = heroEvent?.participants?.length ?? 0;

  return (
    <Box
      id="hero-section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 7, md: 10 },
        px: { xs: 2, md: 3 },
        backgroundColor: 'hero.background',
        color: 'hero.textSecondary',
      }}
    >
      <CustomContainer>
        <Grid container spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Chip
              label="Gather boldly, host with ease"
              color="secondary"
              variant="outlined"
              sx={{
                mb: 3,
                borderColor: 'hero.cardBorder',
                color: 'hero.text',
                fontWeight: 700,
                letterSpacing: 0.6,
                backgroundColor: 'hero.cardBg',
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '2.6rem' },
                lineHeight: 1.1,
                mb: 2,
                color: 'hero.text',
              }}
            >
              Where unforgettable experiences find their people.
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 400,
                fontSize: { xs: '1rem', md: '1.08rem' },
                color: 'hero.textSecondary',
                mb: 3,
                opacity: 0.85,
              }}
            >
              Ntlango is the modern layer for community-led events—discover inspiring gatherings or host your own with
              gorgeous, human-first pages.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                component={Link}
                href={ROUTES.EVENTS.ROOT}
                startIcon={<Explore />}
                sx={{ ...BUTTON_PRIMARY_STYLES }}
              >
                Explore events
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                component={Link}
                href={ROUTES.ACCOUNT.EVENTS.CREATE}
                sx={{
                  ...BUTTON_STYLES,
                  px: 4,
                  py: 1.5,
                  borderColor: 'hero.cardBorder',
                  color: 'hero.text',
                  '&:hover': { borderColor: 'hero.text', backgroundColor: 'hero.cardBg' },
                }}
              >
                Host with Ntlango
              </Button>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            {heroEvent && (
              <Card
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'hero.cardBorder',
                  backgroundColor: 'hero.cardBg',
                  color: 'hero.textSecondary',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
                }}
              >
                <Typography variant="overline" sx={{ color: 'hero.textSecondary', opacity: 0.7, letterSpacing: 1 }}>
                  Featured gathering
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'hero.text', mt: 1 }}>
                  {heroEvent.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'hero.textSecondary', opacity: 0.75, mt: 1.5 }}>
                  {heroEvent.recurrenceRule && RRule.fromString(heroEvent.recurrenceRule).toText()}
                </Typography>
                <Box
                  sx={{
                    mt: 3,
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'hero.cardBorder',
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      paddingTop: '60%',
                      backgroundImage: `url(${heroEvent.media?.featuredImageUrl || 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?auto=format&fit=crop&w=1200&q=80'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    mt: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                  }}
                >
                  <Typography variant="body1" sx={{ color: 'hero.text', fontWeight: 600 }}>
                    {heroEventRsvps} RSVPs
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    component={Link}
                    href={ROUTES.EVENTS.EVENT(heroEvent.slug)}
                    sx={BUTTON_STYLES}
                  >
                    View details
                  </Button>
                </Box>
              </Card>
            )}
          </Grid>
        </Grid>
      </CustomContainer>
    </Box>
  );
}
