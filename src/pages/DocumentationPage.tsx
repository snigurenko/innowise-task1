import { Box, Typography, Paper, Stack, Chip, Divider } from '@mui/material'

const STACK = [
  'React 19 + TypeScript',
  'Vite',
  'React Router (v8, data mode)',
  'Redux Toolkit + RTK Query',
  'MUI',
  'Recharts',
]

// A lightweight in-app docs page (nav item "Documentation" in the reference
// design). Mirrors the top of the project README so a reviewer can read the
// essentials without leaving the app.
export function DocumentationPage() {
  return (
    <Box sx={{ maxWidth: 820 }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
        Documentation
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        A single-page app for browsing and tracking drug/vaccine testing records, built on top
        of the public DummyJSON product catalog.
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>
          Tech stack
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {STACK.map((item) => (
            <Chip key={item} label={item} size="small" />
          ))}
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>
          Pages
        </Typography>
        <Stack spacing={1.5}>
          <Typography variant="body2">
            <strong>Home</strong> — dashboard with aggregate stats and charts computed from the
            product catalog (RTK Query).
          </Typography>
          <Typography variant="body2">
            <strong>Tables</strong> — searchable, paginated table of records, each row backed by
            a real DummyJSON product.
          </Typography>
          <Typography variant="body2">
            <strong>Process</strong> — full detail view for a single record: location, dates,
            an image gallery/lightbox, and a downloadable calendar invite.
          </Typography>
          <Typography variant="body2">
            <strong>Chat</strong> — a bonus WebSocket chat connected to a public echo server.
          </Typography>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>
          About the data
        </Typography>
        <Typography variant="body2" color="text.secondary">
          The UI is styled after a pharmaceutical-company dashboard reference design, but the
          underlying data is the generic DummyJSON <code>/products</code> endpoint. Fields like
          facility name, trial dates, and progress are derived deterministically from each
          product's real id/rating/stock/price — see{' '}
          <code>src/features/products/pharmaMapping.ts</code> for exactly how.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Full setup instructions and dependency list are in the project's <code>README.md</code>.
        </Typography>
      </Paper>
    </Box>
  )
}
