import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router/dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { store } from '@/app/store'
import { router } from '@/app/router'
import { theme } from '@/app/theme'

// Composition root: Redux Provider ≈ Pinia being installed on the app;
// MUI's ThemeProvider + CssBaseline ≈ a global stylesheet/design tokens;
// RouterProvider replaces Vue Router's <router-view/> mount point.
export function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  )
}
