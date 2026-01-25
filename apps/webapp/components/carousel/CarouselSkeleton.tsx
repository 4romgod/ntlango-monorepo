'use client';

import React from 'react';
import { Box, Typography, Stack, Skeleton, Paper } from '@mui/material';

interface CarouselSkeletonProps {
  title?: string;
  itemCount?: number;
  viewAll?: boolean;
  renderSkeletonItem?: (index: number) => React.ReactNode;
  itemWidth?: number;
}

const defaultSkeletonItem = () => (
  <Paper
    elevation={0}
    sx={{
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      overflow: 'hidden',
      px: 2,
      py: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
    }}
  >
    <Skeleton variant="rectangular" height={150} />
    <Skeleton variant="text" width="60%" height={30} />
    <Skeleton variant="text" width="40%" />
  </Paper>
);

export default function CarouselSkeleton({
  title,
  itemCount = 3,
  viewAll = true,
  renderSkeletonItem,
  itemWidth = 320,
}: CarouselSkeletonProps) {
  const skeletonItem = renderSkeletonItem ?? defaultSkeletonItem;
  return (
    <Box sx={{ width: '100%' }}>
      {(title || viewAll) && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          {title ? (
            <Typography variant="h5" fontWeight={700}>
              <Skeleton variant="text" width={180} height={34} />
            </Typography>
          ) : (
            <Skeleton variant="text" width={120} height={34} />
          )}
          {viewAll && <Skeleton variant="rounded" width={100} height={32} />}
        </Stack>
      )}

      <Box
        sx={{
          display: 'flex',
          gap: 3,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          pb: 2,
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {Array.from({ length: itemCount }).map((_, index) => (
          <Box
            key={`skeleton-${index}`}
            sx={{
              flex: '0 0 auto',
              width: { xs: '80%', sm: itemWidth },
              scrollSnapAlign: 'start',
            }}
          >
            {skeletonItem(index)}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
