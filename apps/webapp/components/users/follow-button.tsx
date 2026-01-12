'use client';

import { Button, CircularProgress } from '@mui/material';
import { PersonAdd, PersonRemove } from '@mui/icons-material';
import { useFollow, useFollowing } from '@/hooks';
import { FollowTargetType, FollowApprovalStatus } from '@/data/graphql/types/graphql';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { useAppContext } from '@/hooks/useAppContext';
import { logger } from '@/lib/utils';
import NProgress from 'nprogress';

interface FollowButtonProps {
  targetUserId: string;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export default function FollowButton({
  targetUserId,
  size = 'medium',
  fullWidth = false,
}: FollowButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { setToastProps } = useAppContext();
  const { follow, unfollow, isLoading } = useFollow();
  const { following } = useFollowing();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const followExists = following.some(
      f =>
        f.targetType === FollowTargetType.User &&
        f.targetId === targetUserId &&
        f.approvalStatus === FollowApprovalStatus.Accepted,
    );
    setIsFollowing(followExists);
  }, [following, targetUserId]);

  const handleFollowToggle = async () => {
    // Check authentication before allowing follow action
    if (!session?.user?.token) {
      NProgress.start();
      router.push(ROUTES.AUTH.LOGIN);
      return;
    }

    try {
      if (isFollowing) {
        await unfollow(FollowTargetType.User, targetUserId);
      } else {
        await follow(FollowTargetType.User, targetUserId);
      }
    } catch (error) {
      logger.error('Error toggling follow status:', error);
      setToastProps({
        open: true,
        message: isFollowing
          ? 'Failed to unfollow user. Please try again.'
          : 'Failed to follow user. Please try again.',
        severity: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        autoHideDuration: 4000,
      });
    }
  };

  return (
    <Button
      onClick={handleFollowToggle}
      variant="contained"
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
        borderRadius: 2,
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 2,
        '&:hover': {
          bgcolor: 'background.default',
          boxShadow: 4,
        },
      }}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
}
