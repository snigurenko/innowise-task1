import { useRef } from 'react'
import { useParams, useNavigate } from 'react-router'
import {
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Paper,
  Divider,
  Avatar,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import DirectionsOutlinedIcon from '@mui/icons-material/DirectionsOutlined'
import { useGetProductsQuery } from '@/features/products/productsApi'
import { ImageLightbox } from '@/features/products/components/ImageLightbox'
import type { ImageLightboxHandle } from '@/features/products/components/ImageLightbox'
import { LocationMap } from '@/features/products/components/LocationMap'
import {
  getFacility,
  getAddress,
  getCoordinates,
  getDateRange,
  formatDate,
  getDisplayCode,
  getManufacturerColor,
  buildIcsDataUrl,
} from '@/features/products/pharmaMapping'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  // Same shared no-arg query as HomePage/ProductsPage — the full catalog is
  // already cached there, so this just reads one product out of it instead
  // of firing a separate /products/:id request.
  const { data, isLoading, error: fetchError } = useGetProductsQuery()
  const product = data?.products.find((p) => p.id === Number(id))
  const error = fetchError || (!isLoading && !product)

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
    return <Alert severity="error">Failed to load this record.</Alert>
  }

  const facility = getFacility(product.id)
  const address = getAddress(product)
  const coordinates = getCoordinates(product.id)
  const { start, end } = getDateRange(product.id)
  const manufacturer = product.brand ?? facility.name
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
              {product.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {facility.name}, {facility.city}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" spacing={1.5}>
                  <Box
                    sx={{
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                      borderRadius: 2,
                      p: 1,
                      height: 40,
                      width: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <LocationOnOutlinedIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Location
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {address}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" spacing={1.5}>
                  <Box
                    sx={{
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                      borderRadius: 2,
                      p: 1,
                      height: 40,
                      width: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CalendarMonthOutlinedIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Date &amp; Time
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(start)} - {formatDate(end)}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button variant="contained" size="large" sx={{ flexGrow: 1 }}>
                Start Process
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<EventOutlinedIcon />}
                component="a"
                href={buildIcsDataUrl(product)}
                download={`${product.title}.ics`}
              >
                Add to Calendar
              </Button>
            </Stack>
          </Paper>

          <Typography variant="h5" sx={{ fontWeight: 700 }} gutterBottom>
            About this event
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {product.description}
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
            {product.images.map((src, i) => (
              <Box
                key={src}
                component="img"
                src={src}
                alt={`${product.title} ${i + 1}`}
                onClick={() => lightboxRef.current?.open(i)}
                sx={{
                  width: 88,
                  height: 88,
                  objectFit: 'cover',
                  borderRadius: 1.5,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              />
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>
                Manufacturer
              </Typography>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  variant="rounded"
                  sx={{ bgcolor: getManufacturerColor(manufacturer), width: 40, height: 40 }}
                >
                  {manufacturer[0]}
                </Avatar>
                <Typography variant="body2">{manufacturer}</Typography>
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>
                Location
              </Typography>
              <LocationMap lat={coordinates.lat} lon={coordinates.lon} label={facility.city} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {address}
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<DirectionsOutlinedIcon />}
                sx={{ mt: 1.5 }}
                component="a"
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get directions
              </Button>
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>
                Tags
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label={getDisplayCode(product)} size="small" />
                <Chip label={product.category} size="small" />
              </Stack>
            </Box>
          </Stack>
        </Grid>
      </Grid>
      <ImageLightbox ref={lightboxRef} images={product.images} />
    </Box>
  )
}
