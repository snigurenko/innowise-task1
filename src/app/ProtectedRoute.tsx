import { Navigate, Outlet } from 'react-router'
import { useAppSelector } from '@/app/hooks'

// React Router has no built-in global "beforeEach" guard API like Vue Router.
// The idiomatic replacement is a small wrapper component: read auth state,
// then either render the matched child route (<Outlet/>) or redirect.
export function ProtectedRoute() {
  const token = useAppSelector((state) => state.auth.token)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
