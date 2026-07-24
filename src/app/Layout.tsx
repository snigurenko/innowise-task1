import { useState } from 'react'
import type { MouseEvent } from 'react'
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Stack,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { Link as RouterLink, Outlet, useNavigate, useLocation } from 'react-router'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import DeviceHubOutlinedIcon from '@mui/icons-material/DeviceHubOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout } from '@/features/auth/authSlice'
import { toggleTheme } from '@/features/theme/themeSlice'

const NAV_ITEMS = [
  { label: 'Home', to: '/', icon: HomeOutlinedIcon },
  { label: 'Tables', to: '/tables', icon: GridViewOutlinedIcon },
  { label: 'Process', to: '/tables/1', icon: DeviceHubOutlinedIcon },
  { label: 'Documentation', to: '/documentation', icon: DescriptionOutlinedIcon },
]

export function Layout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAppSelector((state) => state.auth.user)
  const themeMode = useAppSelector((state) => state.theme.mode)
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)

  const openMenu = (e: MouseEvent<HTMLElement>) => setMenuAnchor(e.currentTarget)
  const closeMenu = () => setMenuAnchor(null)

  const handleLogout = () => {
    closeMenu()
    dispatch(logout())
    navigate('/login')
  }

  const handleToggleTheme = () => dispatch(toggleTheme())

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/'
    if (to === '/tables') return location.pathname === '/tables'
    if (to.startsWith('/tables/')) return /^\/tables\/.+/.test(location.pathname)
    return location.pathname.startsWith(to)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar sx={{ gap: 1, minHeight: 64 }}>
          <Stack direction="row" spacing={0.5} sx={{ flexGrow: 1 }}>
            {NAV_ITEMS.map(({ label, to, icon: Icon }) => {
              const active = isActive(to)
              return (
                <Box
                  key={label}
                  component={RouterLink}
                  to={to}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 2,
                    textDecoration: 'none',
                    color: active ? 'primary.main' : 'text.secondary',
                    bgcolor: active ? 'primary.light' : 'transparent',
                    fontWeight: 600,
                    fontSize: 14,
                    opacity: active ? 1 : 0.85,
                    '&:hover': { bgcolor: active ? 'primary.light' : 'action.hover' },
                  }}
                >
                  <Icon fontSize="small" />
                  {label}
                </Box>
              )
            })}
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton size="small" onClick={handleToggleTheme}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: themeMode === 'dark' ? '#2C303D' : '#FCE9D0',
                  color: themeMode === 'dark' ? '#F5C97A' : '#B4690E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {themeMode === 'dark' ? (
                  <DarkModeOutlinedIcon fontSize="small" />
                ) : (
                  <LightModeOutlinedIcon fontSize="small" />
                )}
              </Box>
            </IconButton>
            <IconButton size="small" onClick={openMenu} sx={{ ml: 0.5 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
                {(user?.firstName?.[0] ?? user?.username?.[0] ?? '?').toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
              <MenuItem disabled sx={{ opacity: '1 !important' }}>
                <ListItemText
                  primary={user ? `${user.firstName} ${user.lastName}` : 'Guest'}
                  secondary={user?.email}
                />
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Log out</ListItemText>
              </MenuItem>
            </Menu>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
