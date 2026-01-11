'use client';

import { Box, Typography, Grid, Paper } from '@mui/material';
import { People, TrendingUp, Diversity3 } from '@mui/icons-material';
import CustomContainer from '@/components/custom-container';

type HeroSectionProps = {
  totalUsers: number;
  activeUsers: number;
};

export default function HeroSection({ totalUsers, activeUsers }: HeroSectionProps) {
  return (
    <Box
      sx={{
        background: (theme) => theme.palette.hero.gradient,
        color: 'white',
        py: 8,
        mb: 6,
      }}
    >
      <CustomContainer>
        <Box textAlign="center" maxWidth="800px" mx="auto">
          <People sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Discover Your Community
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, mb: 4, fontWeight: 400 }}>
            Connect with event-goers, organizers, and creators in your area
          </Typography>

          {/* Stats */}
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'hero.cardBorder',
                  borderRadius: 3,
                  boxShadow: 2,
                }}
              >
                <TrendingUp sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {activeUsers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Members
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'hero.cardBorder',
                  borderRadius: 3,
                  boxShadow: 2,
                }}
              >
                <Diversity3 sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {totalUsers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Community Members
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </CustomContainer>
    </Box>
  );
}
