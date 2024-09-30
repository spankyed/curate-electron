import { createTheme } from '@mui/material/styles';
import './index.css';
import { purple, deepPurple, grey, red, amber, blue, deepOrange, indigo, green } from '@mui/material/colors';
import darkScrollbar from '@mui/material/darkScrollbar';

// export const colors = {
//   main: 'rgba(0, 0, 0, 0.3)',
//   sidebar: '',
//   // primary: 'rgb(31,94,168)',
//   primary: [
//     // purple[600],
//     // deepPurple[600],
//     '#5a48a7',
//     ,
//   ]
// }
declare module '@mui/material/styles' {
  interface Palette {
    mom: Palette['primary'];
    amber: Palette['primary'];
    red: Palette['primary'];
  }

  interface PaletteOptions {
    mom?: PaletteOptions['primary'];
    amber?: PaletteOptions['primary'];
    red?: PaletteOptions['primary'];
  }
}

export const colors = createTheme({
  components: {
    MuiSelect: {
      defaultProps: {
        size: "small",
        color: "secondary",
      }
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
        color: "secondary",
      }
    },
    MuiButton: {
      defaultProps: {
        size: "small",
      }
    },
    MuiCssBaseline: {
      styleOverrides: (themeParam) => ({
        body: darkScrollbar(),
      }),
    },
  },
  palette: {
    mode: 'dark',
    success: {
      main: green[900],
    },
    primary: {
      // main: purple[900],
      // main: 'rgba(63,32,88)',
      // main: indigo[700],
      main: indigo[600],
      // main: blue[700],
      // main: deepPurple[900],
      // main: '#5a48a7',
      light: deepPurple[400],
      // light: '#5a48a7',
      dark: '#3b278e',
      // darker: blue[900],
    },
    secondary: {
      // main: '#7b1fa2',
      main: grey[700],
      light: grey[300],
      // main: deepOrange[900],
    },
    background: {
      // default: '#2c2c2c',
      // default: grey[800],
      default: '#171717',
      // paper: '#333',
      paper: grey[900],
    },
    warning:{
      main: red[900],
    },
    amber: {
      main: amber[900],
    },
    red: {
      main: red[600],
      // main: grey[900],
    },
    mom: {
      main: deepPurple[900],
    }
  },
});





