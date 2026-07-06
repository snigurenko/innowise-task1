import { Box, Typography, Button } from '@mui/material'
import { Link as RouterLink } from 'react-router'

export function NotFoundPage() {
  return (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h2">404</Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Page not found.
      </Typography>
      <Button component={RouterLink} to="/" variant="contained">
        Go home
      </Button>
    </Box>
  )
}
