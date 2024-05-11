'use client';

import { Box, Container, Typography } from '@mui/material';
import ToggleThemeMode from '@/components/theme/toggle-theme-mode';
import { useCustomAppContext } from './app-context';

export default function Footer() {
  const { themeMode, setThemeMode } = useCustomAppContext();

  return (
    <Box component="footer" style={{ backgroundColor: 'grey' }}>
      <Container maxWidth="sm">
        <Typography variant="body1">My sticky footer can be found here.</Typography>
      </Container>
      <ToggleThemeMode setThemeMode={setThemeMode} themeMode={themeMode} />
    </Box>
  );
}
