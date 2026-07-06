import { useMemo, useState } from 'react'
import { Box, Grid, TextField, Pagination, Typography, CircularProgress, Alert } from '@mui/material'
import { useGetProductsQuery } from '@/features/products/productsApi'
import { ProductCard } from '@/features/products/components/ProductCard'

const PAGE_SIZE = 12

export function ProductsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  // useGetProductsQuery is a generated RTK Query hook. Changing its argument
  // object automatically produces a new cache key — RTK Query fetches once
  // per unique (limit, skip, search) combination and serves repeats from
  // cache, so navigating back to a page you've already seen is instant.
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
      <Typography variant="h4" component="h1" gutterBottom>
        Products
      </Typography>
      <TextField
        label="Search products"
        fullWidth
        sx={{ mb: 3, maxWidth: 400 }}
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
        <>
          <Grid container spacing={3} sx={{ opacity: isFetching ? 0.6 : 1 }}>
            {data.products.map((product) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_e, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  )
}
