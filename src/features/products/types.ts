export interface Product {
  id: number
  title: string
  description: string
  price: number
  rating: number
  thumbnail: string
  images: string[]
  brand?: string
  category: string
  stock: number
  discountPercentage?: number
  availabilityStatus?: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}
