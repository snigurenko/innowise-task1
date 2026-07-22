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
  Badge,
} from '@mui/material'
import { Link as RouterLink, Outlet, useNavigate, useLocation } from 'react-router'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import DeviceHubOutlinedIcon from '@mui/icons-material/DeviceHubOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout } from '@/features/auth/authSlice'

const NAV_ITEMS = [
  { label: 'Home', to: '/', icon: HomeOutlinedIcon },
  { label: 'Tables', to: '/tables', icon: GridViewOutlinedIcon },
  { label: 'Process', to: '/tables/1', icon: DeviceHubOutlinedIcon },
  { label: 'Documentation', to: '/documentation', icon: DescriptionOutlinedIcon },
  { label: 'Chat', to: '/chat', icon: ChatBubbleOutlineOutlinedIcon },
]

// Shared shell (top nav + content outlet) for every authenticated page — the
// React Router equivalent of a parent route rendering <router-view/> for its
// children. Styled after the reference "pharmaceutical company" dashboard:
// icon+label nav centered in the bar, utility icons + avatar on the right.
export function Layout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAppSelector((state) => state.auth.user)
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)

  const openMenu = (e: MouseEvent<HTMLElement>) => setMenuAnchor(e.currentTarget)
  const closeMenu = () => setMenuAnchor(null)

  const handleLogout = () => {
    closeMenu()
    dispatch(logout())
    navigate('/login')
  }

  // "Tables" and "Process" both live under /tables/*, so a plain prefix
  // match would highlight both nav items at once — match each one exactly
  // instead so only the item you're actually on lights up.
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
            <IconButton size="small">
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: '#FCE9D0',
                  color: '#B4690E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LightModeOutlinedIcon fontSize="small" />
              </Box>
            </IconButton>
            <IconButton size="small">
              <Badge color="error" variant="dot">
                <NotificationsNoneOutlinedIcon fontSize="small" />
              </Badge>
            </IconButton>
            <IconButton size="small">
              <AppsOutlinedIcon fontSize="small" />
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
