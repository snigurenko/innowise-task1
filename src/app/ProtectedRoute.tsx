import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { logout } from '@/features/auth/authSlice'
import { isTokenExpired } from '@/features/auth/tokenUtils'

export function ProtectedRoute() {
  const token = useAppSelector((state) => state.auth.token)
  const dispatch = useAppDispatch()
  const expired = token !== null && isTokenExpired(token)

  useEffect(() => {
    if (expired) dispatch(logout())
  }, [expired, dispatch])

  if (!token || expired) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
