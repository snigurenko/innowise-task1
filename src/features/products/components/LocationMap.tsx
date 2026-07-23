import { Box } from '@mui/material'

interface LocationMapProps {
  lat: number
  lon: number
  label: string
}

export function LocationMap({ lat, lon, label }: LocationMapProps) {
  const delta = 0.01
  const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`

  return (
    <Box
      sx={{
        width: '100%',
        height: 160,
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'action.hover',
      }}
    >
      <Box
        component="iframe"
        title={`Map showing ${label}`}
        src={src}
        loading="lazy"
        sx={{ width: '100%', height: '100%', border: 0, display: 'block' }}
      />
    </Box>
  )
}
