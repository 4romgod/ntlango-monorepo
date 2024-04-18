import { Box } from '@mui/material';
import ToggleThemeMode, { ToggleThemeModeProps } from './theme/toggle-theme-mode';

export default function Footer({ setThemeMode, themeMode }: ToggleThemeModeProps) {
  return (
    <Box component="div">
      <ToggleThemeMode setThemeMode={setThemeMode} themeMode={themeMode} />
    </Box>
  );
}
