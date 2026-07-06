import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Navigate } from 'react-router'
import { Box, Paper, TextField, Button, Typography, Alert } from '@mui/material'
import { useLoginMutation } from '@/features/auth/authApi'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setCredentials } from '@/features/auth/authSlice'

export function LoginPage() {
  // Local, form-only state — this never needs to live in Redux because
  // nothing outside this component (and its children) cares about it.
  const [username, setUsername] = useState('emilys')
  const [password, setPassword] = useState('emilyspass')

  // RTK Query mutation hook: gives back a trigger function plus
  // isLoading/error, so there's no hand-rolled `isSubmitting` state here.
  const [login, { isLoading, error }] = useLoginMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const token = useAppSelector((state) => state.auth.token)

  // Already authenticated → skip the login screen entirely.
  if (token) {
    return <Navigate to="/products" replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const result = await login({ username, password }).unwrap()
      dispatch(
        setCredentials({
          token: result.accessToken,
          user: {
            id: result.id,
            username: result.username,
            email: result.email,
            firstName: result.firstName,
            lastName: result.lastName,
            image: result.image,
          },
        }),
      )
      navigate('/products')
    } catch {
      // `error` from useLoginMutation already reflects the failure in the UI.
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Sign in
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Use any DummyJSON test user, e.g. emilys / emilyspass
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Invalid username or password
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </Paper>
    </Box>
  )
}
