'use client';

import { Button, CircularProgress } from '@mui/material';
import { PersonAdd, PersonRemove } from '@mui/icons-material';
import { useFollow, useFollowing } from '@/hooks';
import { FollowTargetType } from '@/data/graphql/types/graphql';
import { useEffect, useState } from 'react';

interface FollowButtonProps {
  targetUserId: string;
  variant?: 'contained' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export default function FollowButton({
  targetUserId,
  variant = 'contained',
  size = 'medium',
  fullWidth = false,
}: FollowButtonProps) {
  const { follow, unfollow, isLoading } = useFollow();
  const { following, refetch } = useFollowing();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const followExists = following.some(
      f => f.targetType === FollowTargetType.User && f.targetId === targetUserId,
    );
    setIsFollowing(followExists);
  }, [following, targetUserId]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollow(FollowTargetType.User, targetUserId);
      } else {
        await follow(FollowTargetType.User, targetUserId);
      }
      await refetch();
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  return (
    <Button
      onClick={handleFollowToggle}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={isLoading}
      startIcon={
        isLoading ? (
          <CircularProgress size={16} />
        ) : isFollowing ? (
          <PersonRemove />
        ) : (
          <PersonAdd />
        )
      }
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: 2,
        ...(variant === 'contained' && {
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 2,
          '&:hover': {
            bgcolor: 'background.default',
            boxShadow: 4,
          },
        }),
        ...(variant === 'outlined' && {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
          },
        }),
      }}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
}
