import { useRef } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Box, Typography, Grid, Chip, Button, CircularProgress, Alert, Stack } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useGetProductByIdQuery } from '@/features/products/productsApi'
import { ImageLightbox } from '@/features/products/components/ImageLightbox'
import type { ImageLightboxHandle } from '@/features/products/components/ImageLightbox'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: product, isLoading, error } = useGetProductByIdQuery(Number(id))

  // useRef holds the lightbox's imperative handle across renders without
  // itself causing a re-render when it's attached — unlike useState, writing
  // to `.current` is silent as far as React's render cycle is concerned.
  const lightboxRef = useRef<ImageLightboxHandle>(null)

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !product) {
    return <Alert severity="error">Failed to load product.</Alert>
  }

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {product.images.map((src, i) => (
              <Box
                key={src}
                component="img"
                src={src}
                alt={`${product.title} ${i + 1}`}
                onClick={() => lightboxRef.current?.open(i)}
                sx={{
                  width: 96,
                  height: 96,
                  objectFit: 'cover',
                  borderRadius: 1,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              />
            ))}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h4" gutterBottom>
            {product.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {product.description}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip label={product.category} />
            <Chip label={`★ ${product.rating}`} />
            <Chip label={`${product.stock} in stock`} />
          </Stack>
          <Typography variant="h5" color="primary">
            ${product.price}
          </Typography>
        </Grid>
      </Grid>
      <ImageLightbox ref={lightboxRef} images={product.images} />
    </Box>
  )
}
