import { PaletteMode, ThemeOptions } from '@mui/material';
import { inter } from '@/components/theme/fonts';
import darkModeColors from '@/components/theme/colors/dark-mode';
import lightModeColors from '@/components/theme/colors/light-mode';

/**
 * Color Scheme: https://m2.material.io/design/color/the-color-system.html#tools-for-picking-colors
 */
export const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  typography: {
    fontFamily: inter.style.fontFamily,
    fontSize: 14,
  },
  palette: {
    mode,
    ...(mode === 'light' ? lightModeColors : darkModeColors),
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        ...(mode === 'light'
          ? {
              colorPrimary: {
                background: '#FFFFFF',
              },
            }
          : {
              colorPrimary: {
                background: '#121318',
              },
            }),
      },
    },
  },
});
