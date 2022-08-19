import { createTheme } from '@mui/material';

import '@fontsource/roboto';

const theme = createTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#F50057',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
  },
  typography: {
    fontFamily: 'Roboto',
  },
});

export default theme;
