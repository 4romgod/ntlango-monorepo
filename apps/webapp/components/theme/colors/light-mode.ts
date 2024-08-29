import { PaletteOptions } from '@mui/material';
import { cyan, lime, deepOrange, grey } from '@mui/material/colors';

const lightModeColors: PaletteOptions = {
  primary: {
    light: cyan[500],
    main: cyan[700],
    dark: cyan[900],
    contrastText: '#FFFFFF',
  },
  secondary: {
    light: lime[500],
    main: lime[700],
    dark: lime[900],
    contrastText: '#FFFFFF',
  },
  error: {
    main: deepOrange[500],
  },
  background: {
    default: '#F5F5F5',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
  },
  success: {
    main: '#4CAF50',
  },
};

export default lightModeColors;
