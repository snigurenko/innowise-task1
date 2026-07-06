import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { LoginRequest, LoginResponse } from './types'

// RTK Query "API slice" for auth. This is the direct replacement for a
// hand-written Pinia action that calls axios and manages loading/error state
// itself — createApi generates a typed hook (useLoginMutation) that tracks
// isLoading/isSuccess/error for you.
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com' }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
})

export const { useLoginMutation } = authApi
