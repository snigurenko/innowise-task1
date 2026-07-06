import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { User } from './types'

interface AuthState {
  user: User | null
  token: string | null
}

const storedToken = localStorage.getItem('accessToken')
const storedUser = localStorage.getItem('user')

const initialState: AuthState = {
  user: storedUser ? (JSON.parse(storedUser) as User) : null,
  token: storedToken,
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
