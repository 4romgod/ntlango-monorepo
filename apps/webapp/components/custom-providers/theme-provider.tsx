'use client';

import '@/components/global.css';
import React, { ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useCustomAppContext } from '@/components/app-context';

export default function CustomThemeProvider({ children }: { children: ReactNode }) {
  const { appTheme } = useCustomAppContext();

  return (
    <ThemeProvider theme={appTheme!}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
