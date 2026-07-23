import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router/dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { store } from '@/app/store'
import { router } from '@/app/router'
import { getTheme } from '@/app/theme'
import { useAppSelector } from '@/app/hooks'

function ThemedApp() {
  const mode = useAppSelector((state) => state.theme.mode)
  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export function App() {
  return (
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  )
}
