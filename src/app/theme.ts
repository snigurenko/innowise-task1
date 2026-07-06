import { createTheme } from '@mui/material/styles'

// A single, small theme object is the MUI equivalent of a Vuetify/Tailwind
// design-token config — colors, radii, and typography defined once and
// consumed everywhere via the ThemeProvider in App.tsx.
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
  },
  shape: { borderRadius: 8 },
})
