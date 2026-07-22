import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { logout } from '@/features/auth/authSlice'
import { isTokenExpired } from '@/features/auth/tokenUtils'

// React Router has no built-in global "beforeEach" guard API like Vue Router.
// The idiomatic replacement is a small wrapper component: read auth state,
// then either render the matched child route (<Outlet/>) or redirect.
export function ProtectedRoute() {
  const token = useAppSelector((state) => state.auth.token)
  const dispatch = useAppDispatch()
  const expired = token !== null && isTokenExpired(token)

  // Clearing stale auth state is a side effect, so it belongs in an
  // effect, not in the render path that decides what to show.
  useEffect(() => {
    if (expired) dispatch(logout())
  }, [expired, dispatch])

  if (!token || expired) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
