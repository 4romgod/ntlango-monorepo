'use client';

import { Box, Typography, Avatar, Card, CardContent, Skeleton, Stack, AvatarGroup } from '@mui/material';
import { useFollowing } from '@/hooks/useFollow';
import { useQuery } from '@apollo/client';
import { GetMyRsvpsDocument } from '@/data/graphql/query/EventParticipant/query';
import { useSession } from 'next-auth/react';
import { getAuthHeader } from '@/lib/utils';

export default function FriendsGoingSection() {
  const { following, loading: followingLoading } = useFollowing();
  const { data: session } = useSession();
  const token = session?.user?.token;

  const { data, loading: rsvpLoading } = useQuery(GetMyRsvpsDocument, {
    skip: !token,
    fetchPolicy: 'cache-and-network',
    context: {
      headers: getAuthHeader(token),
    },
  });

  const friends = following.filter(f => f?.targetUser).map(f => f.targetUser);

  return (
    <Box sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 1, md: 2 } }}>
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mb: { xs: 1, md: 2 }, fontSize: { xs: '1.1rem', md: '1.25rem' } }}
      >
        Friends Going
      </Typography>
      {followingLoading || rsvpLoading ? (
        <Card variant="outlined" sx={{ borderRadius: 3, p: { xs: 1.5, md: 3 } }}>
          <CardContent>
            <AvatarGroup max={5} sx={{ mb: 1 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Avatar key={i} sx={{ width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 } }} />
              ))}
            </AvatarGroup>
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="90%" height={16} />
          </CardContent>
        </Card>
      ) : friends.length === 0 ? (
        <Typography color="text.secondary">
          None of your friends are going to events yet. Invite friends or follow people to see their activity here!
        </Typography>
      ) : (
        <Stack gap={{ xs: 1.5, md: 2 }}>
          {friends
            .filter(f => !!f)
            .slice(0, 5)
            .map((friend, idx: number) => (
              <Card key={friend.userId ?? idx} variant="outlined" sx={{ borderRadius: 3, p: { xs: 1.5, md: 3 } }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
                  <Avatar
                    src={friend.profile_picture || undefined}
                    sx={{ width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 } }}
                  />
                  <Box>
                    <Typography fontWeight={600} sx={{ fontSize: { xs: '0.95rem', md: '1.05rem' } }}>
                      {friend.username || friend.given_name || 'Friend'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Friend RSVP details are not available in this view.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
        </Stack>
      )}
    </Box>
  );
}
