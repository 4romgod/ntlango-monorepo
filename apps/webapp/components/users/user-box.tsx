import { Typography, Grid, Avatar, Box, Paper, Chip, Stack } from '@mui/material';
import { Person, Star } from '@mui/icons-material';
import { User } from '@/data/graphql/types/graphql';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { getAvatarSrc, getDisplayName } from '@/lib/utils';

export default function UserBox({ user }: { user: User }) {
  const displayName = getDisplayName(user) !== 'Account' 
    ? getDisplayName(user)
    : user.username;
  
  // Count interests if available
  const interestsCount = Array.isArray(user.interests) ? user.interests.length : 0;

  return (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
      <Link href={ROUTES.USERS.USER(user.username)} style={{ textDecoration: 'none' }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            height: '100%',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'primary.main',
              boxShadow: '0 4px 20px #4f46e520',
              transform: 'translateY(-4px)',
            },
          }}
        >
          {/* Avatar & Name */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Avatar
              src={getAvatarSrc(user)}
              alt={displayName}
              sx={{
                width: 80,
                height: 80,
                mb: 2,
                border: '3px solid',
                borderColor: 'primary.main',
              }}
            >
              <Person sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h6" fontWeight="bold" textAlign="center" gutterBottom>
              {displayName}
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              @{user.username}
            </Typography>
          </Box>

          {/* Bio */}
          {user.bio && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                minHeight: '40px',
              }}
            >
              {user.bio}
            </Typography>
          )}
        </Paper>
      </Link>
    </Grid>
  );
}
