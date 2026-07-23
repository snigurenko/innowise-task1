import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '@/app/baseQuery'
import type { Product, ProductsResponse } from './types'

export interface GetProductsArgs {
  limit: number
  skip: number
  search?: string
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Product'],
  endpoints: (builder) => ({

    getProducts: builder.query<ProductsResponse, GetProductsArgs>({
      query: ({ limit, skip, search }) =>
        search
          ? `/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`
          : `/products?limit=${limit}&skip=${skip}`,

      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product' as const, id: 'LIST' },
            ]
          : [{ type: 'Product' as const, id: 'LIST' }],
    }),

    getProduct: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product' as const, id }],
    }),
  }),
})

export const { useGetProductsQuery, useGetProductQuery } = productsApi
