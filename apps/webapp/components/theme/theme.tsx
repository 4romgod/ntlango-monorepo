'use client';

import { ThemeOptions, createTheme } from '@mui/material/styles';
import { inter } from '@/components/theme/fonts';
import { CssBaseline, PaletteMode, ThemeProvider } from '@mui/material';
import { useState } from 'react';
import { red } from '@mui/material/colors';
import Navbar from '@/components/navigation/navbar';
import Footer from '@/components/footer';

const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  typography: {
    fontFamily: inter.style.fontFamily,
    fontSize: 10,
  },
  palette: {
    mode,
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
});

export default function CustomThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [themeMode, setThemeMode] = useState<PaletteMode>('light');

  return (
    <ThemeProvider theme={createTheme(getDesignTokens(themeMode))}>
      <CssBaseline />
      <body>
        <Navbar setThemeMode={setThemeMode} themeMode={themeMode} />
        {children}
        <Footer setThemeMode={setThemeMode} themeMode={themeMode} />
      </body>
    </ThemeProvider>
  );
}
