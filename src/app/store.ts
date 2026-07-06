import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from '@/features/auth/authSlice'
import { authApi } from '@/features/auth/authApi'
import { productsApi } from '@/features/products/productsApi'

// One store for the whole app — analogous to a single root Pinia instance.
// Each RTK Query api's `reducerPath` becomes a top-level key, and its
// `.middleware` must be added so caching, refetching and cache lifetimes work.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, productsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
