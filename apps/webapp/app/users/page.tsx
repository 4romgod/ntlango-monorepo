import { getClient } from '@/data/graphql';
import { GetAllUsersDocument } from '@/data/graphql/types/graphql';
import { Container, Typography, Grid, Box, Paper, Chip } from '@mui/material';
import { People, TrendingUp, Diversity3 } from '@mui/icons-material';
import type { Metadata } from 'next';
import SearchInput from '@/components/search/search-box';
import UserBox from '@/components/users/user-box';
import CustomContainer from '@/components/custom-container';

export const metadata: Metadata = {
  title: 'Community · Ntlango',
  description: 'Discover and connect with people in your community who share your interests.',
};

// Enable ISR with 120-second revalidation
export const revalidate = 120;

export default async function Page() {
  const { data: usersRetrieved } = await getClient().query({ query: GetAllUsersDocument });

  const users = usersRetrieved.readUsers;
  const activeUsers = users.filter(u => u.username);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
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
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                  }}
                >
                  <Typography variant="h4" fontWeight="bold">
                    {activeUsers.length.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Members
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                  }}
                >
                  <Diversity3 sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Strong Community
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                  }}
                >
                  <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Growing Daily
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </CustomContainer>
      </Box>

      {/* Content Section */}
      <CustomContainer>
        <Box mb={8}>
          {/* Section Header */}
          <Box mb={4}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Diversity3 sx={{ color: 'primary.main' }} />
              <Typography variant="overline" color="text.secondary" fontWeight="bold">
                Browse Community
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Meet Your People
            </Typography>
            <Typography variant="body1" color="text.secondary" maxWidth="700px">
              From event enthusiasts to organizers, find people who share your vibe and interests.
            </Typography>
          </Box>

          {/* Search */}
          <Box mb={5}>
            <SearchInput
              itemList={users
                .map(user => {
                  const name = [user.given_name, user.family_name]
                    .filter(n => n && typeof n === 'string')
                    .join(' ');
                  return name || user.username;
                })
                .filter(Boolean)}
              sx={{
                maxWidth: '600px',
                mx: 'auto',
              }}
            />
          </Box>

          {/* User Grid */}
          <Grid container spacing={3}>
            {users.map(user => (
              <UserBox key={user.userId} user={user} />
            ))}
          </Grid>

          {/* Empty State */}
          {users.length === 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 8,
                textAlign: 'center',
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <People sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No users found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Be the first to join the community!
              </Typography>
            </Paper>
          )}
        </Box>
      </CustomContainer>
    </Box>
  );
}
