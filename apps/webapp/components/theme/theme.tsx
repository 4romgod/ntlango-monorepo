'use client';

import { useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import { Box, CssBaseline, PaletteMode, ThemeProvider } from '@mui/material';
import Navbar from '@/components/navigation/navbar';
import Footer from '@/components/footer';
import { getDesignTokens } from '@/components/theme/design-tokens';

export default function CustomThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [themeMode, setThemeMode] = useState<PaletteMode>('light');
  const theme = useMemo(
    () => createTheme(getDesignTokens(themeMode)),
    [themeMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <body>
        <Navbar setThemeMode={setThemeMode} themeMode={themeMode} />
        <Box
          component="div"
          id="main-content"
          position={'relative'}
          marginTop={10}
        >
          {children}
        </Box>
        <Footer setThemeMode={setThemeMode} themeMode={themeMode} />
      </body>
    </ThemeProvider>
  );
}
