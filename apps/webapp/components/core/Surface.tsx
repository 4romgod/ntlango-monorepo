'use client';

import { Box, BoxProps, useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface SurfaceProps extends BoxProps {
  children: ReactNode;
  disableShadow?: boolean;
}

export default function Surface({ children, disableShadow = false, sx, ...rest }: SurfaceProps) {
  const theme = useTheme();

  const surfacePalette = theme.palette.surface;
  const borderColor = surfacePalette?.border ?? theme.palette.divider;
  const shadowValue =
    surfacePalette?.shadow ??
    (theme.palette.mode === 'light' ? '0 18px 50px rgba(15, 23, 42, 0.08)' : '0 24px 60px rgba(0, 0, 0, 0.55)');

  return (
    <Box
      {...rest}
      sx={{
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${borderColor}`,
        boxShadow: disableShadow ? undefined : shadowValue,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
