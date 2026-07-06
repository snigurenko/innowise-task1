import { createBrowserRouter } from 'react-router'
import { Layout } from '@/app/Layout'
import { ProtectedRoute } from '@/app/ProtectedRoute'
import { LoginPage } from '@/pages/LoginPage'
import { HomePage } from '@/pages/HomePage'
import { ProductsPage } from '@/pages/ProductsPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { DocumentationPage } from '@/pages/DocumentationPage'
import { ChatPage } from '@/pages/ChatPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

// React Router v8's "data mode" (createBrowserRouter + <RouterProvider/>,
// wired up in App.tsx) ≈ the routes array you'd pass to Vue Router's
// createRouter({ routes: [...] }) — a declarative route tree instead of
// nested <Route> JSX (though that declarative JSX form also still exists).
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/tables', element: <ProductsPage /> },
          { path: '/tables/:id', element: <ProductDetailPage /> },
          { path: '/documentation', element: <DocumentationPage /> },
          { path: '/chat', element: <ChatPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
