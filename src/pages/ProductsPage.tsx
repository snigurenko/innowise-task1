import { useMemo, useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Stack,
  LinearProgress,
  Pagination,
} from '@mui/material'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import { Link as RouterLink } from 'react-router'
import { useGetProductsQuery } from '@/features/products/productsApi'
import {
  getDisplayCode,
  getFacility,
  getDateRange,
  formatDate,
  isSuccessful,
  getProgress,
  getStatusSegments,
} from '@/features/products/pharmaMapping'

const PAGE_SIZE = 9

// Renders the "Tables" page as a data table (matching the reference design)
// instead of a card grid. Every column value comes from pharmaMapping.ts,
// which derives it from the real product returned by RTK Query.
export function ProductsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const { data, isLoading, isFetching, error } = useGetProductsQuery({
    limit: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
    search: search || undefined,
  })

  const pageCount = useMemo(
    () => (data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1),
    [data],
  )

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }} gutterBottom>
        List of medications in development
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Brief summary of testing processes
      </Typography>

      <TextField
        label="Search"
        size="small"
        fullWidth
        sx={{ mb: 3, maxWidth: 360 }}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setPage(1)
        }}
      />

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">Failed to load products.</Alert>}

      {data && (
        <Paper variant="outlined" sx={{ opacity: isFetching ? 0.6 : 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                {['Name', 'Location', 'Start date', 'End date', 'Success reaction', 'Process', 'Status'].map(
                  (label) => (
                    <TableCell key={label} sx={{ fontWeight: 700, fontSize: 12, color: 'text.secondary' }}>
                      {label.toUpperCase()}
                    </TableCell>
                  ),
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.products.map((product) => {
                const facility = getFacility(product.id)
                const { start, end } = getDateRange(product.id)
                const { current, total } = getProgress(product)
                const segments = getStatusSegments(product)
                const success = isSuccessful(product)

                return (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Typography
                        component={RouterLink}
                        to={`/tables/${product.id}`}
                        variant="body2"
                        sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none' }}
                      >
                        {getDisplayCode(product)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{facility.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatDate(start)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatDate(end)}</Typography>
                    </TableCell>
                    <TableCell>
                      {success ? (
                        <CheckCircleRoundedIcon sx={{ color: '#1E8E3E', bgcolor: '#EAF7EE', borderRadius: '50%' }} />
                      ) : (
                        <CancelRoundedIcon sx={{ color: '#D93025', bgcolor: '#FDEDED', borderRadius: '50%' }} />
                      )}
                    </TableCell>
                    <TableCell sx={{ minWidth: 140 }}>
                      <Typography variant="caption" color="text.secondary">
                        {current} / {total}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(current / total) * 100}
                        sx={{ borderRadius: 4, height: 6 }}
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 120 }}>
                      <Stack direction="row" spacing={0.5} sx={{ height: 6 }}>
                        {segments.map((seg, i) => (
                          <Box
                            key={i}
                            sx={{
                              flex: seg.weight,
                              bgcolor: seg.color,
                              borderRadius: 2,
                              height: '100%',
                            }}
                          />
                        ))}
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}
          >
            <Typography variant="caption" color="text.secondary">
              {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, data.total)} items of {data.total}
            </Typography>
            <Pagination count={pageCount} page={page} onChange={(_e, v) => setPage(v)} size="small" />
          </Stack>
        </Paper>
      )}
    </Box>
  )
}
