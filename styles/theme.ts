// import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#aa33be',
    },
    secondary: {
      main: '#f73379',
    },
    error: {
      main: '#f50057',
    },
    background: {
      default: '#fff',
    },
  },
  typography: {
    fontFamily: ['Poppins', 'Roboto'].join(','),
  },
});

export default theme;
