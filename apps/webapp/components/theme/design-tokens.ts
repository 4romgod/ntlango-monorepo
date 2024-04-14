import { PaletteMode, ThemeOptions } from '@mui/material';
import { inter } from '@/components/theme/fonts';
import { indigo as primaryColor } from '@mui/material/colors';

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
    ...(mode === 'light'
      ? {
          primary: {
            light: primaryColor[300],
            main: primaryColor[500],
            dark: primaryColor[700],
          },
          secondary: {
            light: '#ebe252',
            main: '#c9ba45',
            dark: '#947e35',
          },
          error: {
            main: '#f44336',
          },
          background: {
            default: '#FFFFFF',
            paper: '#f6f7fe',
          },
          text: {
            primary: '#121318',
            secondary: '#666666',
          },
        }
      : {
          primary: {
            light: primaryColor[300],
            main: primaryColor[500],
            dark: primaryColor[700],
          },
          secondary: {
            light: '#ebe252',
            main: '#c9ba45',
            dark: '#947e35',
          },
          error: {
            main: '#f44336',
          },
          background: {
            default: '#121318',
            paper: '#323338',
          },
          text: {
            primary: '#FFFFFF',
            secondary: '#CCCCCC',
          },
        }),
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
