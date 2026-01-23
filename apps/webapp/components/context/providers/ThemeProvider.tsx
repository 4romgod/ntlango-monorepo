'use client';

import '@/components/global.css';
import React, { ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useAppContext } from '@/hooks/useAppContext';

export default function CustomThemeProvider({ children }: { children: ReactNode }) {
  const { appTheme } = useAppContext();

  return (
    <ThemeProvider theme={appTheme!}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
