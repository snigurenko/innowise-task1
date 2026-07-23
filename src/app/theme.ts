import { createTheme } from '@mui/material/styles'
import type { ThemeMode } from '@/features/theme/themeSlice'

export const getTheme = (mode: ThemeMode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: '#4F6FF0', dark: '#3B54C4', light: '#7C93F5' },
      success: { main: '#1E8E3E' },
      error: { main: '#D93025' },
      background:
        mode === 'dark'
          ? { default: '#12141C', paper: '#1B1E29' }
          : { default: '#F4F6FB', paper: '#FFFFFF' },
      divider: mode === 'dark' ? '#2C303D' : '#E7E9F0',
      text:
        mode === 'dark'
          ? { primary: '#E7E9F0', secondary: '#9AA0B4' }
          : { primary: '#1A1D29', secondary: '#6B7280' },
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
            backgroundColor: mode === 'dark' ? '#1B1E29' : '#FFFFFF',
            color: mode === 'dark' ? '#E7E9F0' : '#1A1D29',
            boxShadow: 'none',
            borderBottom: `1px solid ${mode === 'dark' ? '#2C303D' : '#E7E9F0'}`,
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
