import { memo } from 'react'
import { Card, CardActionArea, CardMedia, CardContent, Typography, Chip, Box } from '@mui/material'
import { Link as RouterLink } from 'react-router'
import type { Product } from '@/features/products/types'

interface ProductCardProps {
  product: Product
}

function ProductCardComponent({ product }: ProductCardProps) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={RouterLink} to={`/tables/${product.id}`} sx={{ flexGrow: 1 }}>
        <CardMedia
          component="img"
          height="160"
          image={product.thumbnail}
          alt={product.title}
          sx={{ objectFit: 'contain', bgcolor: 'grey.100' }}
        />
        <CardContent>
          <Typography variant="subtitle1" noWrap>
            {product.title}
          </Typography>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}
          >
            <Typography variant="h6" color="primary">
              ${product.price}
            </Typography>
            <Chip label={`★ ${product.rating}`} size="small" />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

// React.memo skips re-rendering this card if its `product` prop is
// shallow-equal to last render. Without it, every card in the grid would
// re-render on every parent state change (e.g. each keystroke in the search
// box) even though only the fetched data — not each card's own props —
// actually changed. Vue's reactivity system gives you this for free; in
// React you opt in explicitly.
export const ProductCard = memo(ProductCardComponent)
