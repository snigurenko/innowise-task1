import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router/dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { store } from '@/app/store'
import { router } from '@/app/router'
import { getTheme } from '@/app/theme'
import { useAppSelector } from '@/app/hooks'

// Reads the current mode from Redux and builds the matching MUI theme.
// Split out from App() because useAppSelector needs to run *inside*
// <Provider>, not alongside it.
function ThemedApp() {
  const mode = useAppSelector((state) => state.theme.mode)
  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

// Composition root: Redux Provider ≈ Pinia being installed on the app;
// MUI's ThemeProvider + CssBaseline ≈ a global stylesheet/design tokens;
// RouterProvider replaces Vue Router's <router-view/> mount point.
export function App() {
  return (
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  )
}
