import { createTheme } from '@mui/material/styles'

// A single, small theme object is the MUI equivalent of a Vuetify/Tailwind
// design-token config — colors, radii, and typography defined once and
// consumed everywhere via the ThemeProvider in App.tsx.
//
// Palette matches the "pharmaceutical company" reference design (Figma:
// DEMO for Dima Bukovsky) — soft indigo accent, pale gray page background,
// white cards with a hairline border instead of heavy shadows.
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4F6FF0', dark: '#3B54C4', light: '#7C93F5' },
    success: { main: '#1E8E3E' },
    error: { main: '#D93025' },
    background: { default: '#F4F6FB', paper: '#FFFFFF' },
    divider: '#E7E9F0',
    text: { primary: '#1A1D29', secondary: '#6B7280' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#1A1D29',
          boxShadow: 'none',
          borderBottom: '1px solid #E7E9F0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
      },
    },
  },
})

// Extra design tokens that don't fit MUI's palette shape (chart series,
// status-bar segments) — kept alongside the theme so every themed component
// pulls colors from one place instead of hardcoding hex values inline.
export const pharmaColors = {
  chartBlue: '#4F6FF0',
  chartBlueLight: '#C9D3F5',
  statusBlue: '#4F6FF0',
  statusRed: '#F0524F',
  statusOrange: '#F5A623',
  statusGreen: '#34C759',
  successBg: '#EAF7EE',
  successText: '#1E8E3E',
  dangerBg: '#FDEDED',
  dangerText: '#D93025',
}
