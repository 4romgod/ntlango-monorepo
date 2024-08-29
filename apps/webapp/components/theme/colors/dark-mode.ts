import { PaletteOptions } from '@mui/material';
import { cyan, lightGreen, deepOrange } from '@mui/material/colors';

const darkModeColors: PaletteOptions = {
  primary: {
    light: cyan[300],
    main: cyan[500],
    dark: cyan[700],
    contrastText: '#FFFFFF',
  },
  secondary: {
    light: lightGreen[300],
    main: lightGreen[500],
    dark: lightGreen[700],
    contrastText: '#FFFFFF',
  },
  error: {
    main: deepOrange[500],
  },
  background: {
    default: '#121318',
    paper: '#323338',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#CCCCCC',
  },
};

export default darkModeColors;
