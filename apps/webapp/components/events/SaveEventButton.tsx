'use client';

import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import { useSaveEvent } from '@/hooks';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { useAppContext } from '@/hooks/useAppContext';
import { logger, extractApolloErrorMessage } from '@/lib/utils';
import NProgress from 'nprogress';

interface SaveEventButtonProps {
  eventId: string;
  isSaved: boolean;
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
  onSaveChange?: (isSaved: boolean) => void;
}

/**
 * Button to save/unsave (bookmark) an event.
 * Uses the Follow system under the hood with targetType = Event.
 */
export default function SaveEventButton({
  eventId,
  isSaved,
  size = 'medium',
  showTooltip = true,
  onSaveChange,
}: SaveEventButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { setToastProps } = useAppContext();
  const { toggleSave, isLoading } = useSaveEvent();

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event card click
    e.preventDefault();

    if (!session?.user?.token) {
      NProgress.start();
      router.push(ROUTES.AUTH.LOGIN);
      return;
    }

    try {
      await toggleSave(eventId, isSaved);
      onSaveChange?.(!isSaved);

      setToastProps({
        open: true,
        message: isSaved ? 'Event removed from saved' : 'Event saved!',
        severity: 'success',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        autoHideDuration: 2000,
      });
    } catch (error: unknown) {
      logger.error('Error toggling save status:', error);

      const defaultMessage = isSaved
        ? 'Failed to unsave event. Please try again.'
        : 'Failed to save event. Please try again.';
      const errorMessage = extractApolloErrorMessage(error, defaultMessage);

      setToastProps({
        open: true,
        message: errorMessage,
        severity: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        autoHideDuration: 4000,
      });
    }
  };

  const button = (
    <IconButton
      onClick={handleToggleSave}
      disabled={isLoading}
      size={size}
      sx={{
        color: isSaved ? 'primary.main' : 'text.secondary',
        bgcolor: isSaved ? 'primary.lighter' : 'transparent',
        '&:hover': {
          color: isSaved ? 'primary.dark' : 'primary.main',
          bgcolor: isSaved ? 'primary.light' : 'action.hover',
        },
      }}
    >
      {isLoading ? (
        <CircularProgress size={size === 'small' ? 16 : size === 'large' ? 28 : 22} />
      ) : isSaved ? (
        <Bookmark />
      ) : (
        <BookmarkBorder />
      )}
    </IconButton>
  );

  if (showTooltip) {
    return <Tooltip title={isSaved ? 'Remove from saved' : 'Save event'}>{button}</Tooltip>;
  }

  return button;
}
