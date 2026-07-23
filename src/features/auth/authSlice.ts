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

if (storedToken !== null && !isStoredTokenValid) {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')
}

const initialState: AuthState = {
  user: isStoredTokenValid && storedUser ? (JSON.parse(storedUser) as User) : null,
  token: isStoredTokenValid ? storedToken : null,
}

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
