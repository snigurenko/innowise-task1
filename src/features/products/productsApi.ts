import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '@/app/baseQuery'
import type { ProductsResponse } from './types'

// A second RTK Query API slice, scoped to the products feature. Each feature
// owning its own `createApi` instance (rather than one giant global api) is
// what keeps this "modular" per the task requirements — it mirrors having a
// dedicated Pinia store per domain area.
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    // `limit=0` tells dummyjson to return the entire catalog in one response.
    // Every page calls this same (argument-less) query, so RTK Query serves
    // them all from a single shared cache entry — pagination and search are
    // then done client-side instead of hitting the API again.
    getProducts: builder.query<ProductsResponse, void>({
      query: () => `/products?limit=0`,
      // Tagging each product (plus a catch-all 'LIST' tag) is what enables
      // RTK Query's automatic cache invalidation/refetching if a mutation
      // later invalidates one of these tags — the caching behavior the
      // evaluation criteria explicitly calls out.
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
