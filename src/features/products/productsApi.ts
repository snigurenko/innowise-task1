import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '@/app/baseQuery'
import type { ProductsResponse } from './types'

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Product'],
  endpoints: (builder) => ({

    getProducts: builder.query<ProductsResponse, void>({
      query: () => `/products?limit=0`,

      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product' as const, id: 'LIST' },
            ]
          : [{ type: 'Product' as const, id: 'LIST' }],
    }),
  }),
})

export const { useGetProductsQuery } = productsApi
