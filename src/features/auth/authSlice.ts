import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { User } from './types'
import { isTokenExpired } from './tokenUtils'

interface AuthState {
  user: User | null
  token: string | null
}

const storedToken = localStorage.getItem('accessToken')
const storedUser = localStorage.getItem('user')
const isStoredTokenValid = storedToken !== null && !isTokenExpired(storedToken)

// A token that outlived its `exp` is worthless — drop it now instead of
// letting the app boot into a "logged in" state ProtectedRoute would
// bounce out of on the next check anyway.
if (storedToken !== null && !isStoredTokenValid) {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')
}

const initialState: AuthState = {
  user: isStoredTokenValid && storedUser ? (JSON.parse(storedUser) as User) : null,
  token: isStoredTokenValid ? storedToken : null,
}

// A Redux Toolkit "slice" ≈ a Pinia store: createSlice generates action
// creators + a reducer from a plain object of "mutations". Inside a reducer
// you can write `state.user = ...` even though the underlying state is
// immutable — RTK uses Immer under the hood to translate that into a new
// state tree for you.
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      localStorage.setItem('accessToken', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export const authReducer = authSlice.reducer
