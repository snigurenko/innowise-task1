import { Box } from '@mui/material'

interface LocationMapProps {
  lat: number
  lon: number
  label: string
}

// The DummyJSON /products response never includes real geo-coordinates, but
// every facility in pharmaMapping.ts sits in an actual Warsaw district, so
// there are genuine lat/lon pairs to center this on. Embeds the public
// OpenStreetMap viewer directly (no API key needed) — the earlier
// implementation pointed at a static-map image host that wasn't reachable at
// all, leaving a broken image icon.
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
