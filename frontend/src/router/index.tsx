import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from '@components/layout/MainLayout'
import AdminLayout from '@components/admin/AdminLayout'
import ProtectedRoute from '@components/auth/ProtectedRoute'
import HomePage from '@pages/HomePage'
import ProductsPage from '@pages/ProductsPage'
import ProductDetailsPage from '@pages/ProductDetailsPage'
import CartPage from '@pages/CartPage'
import WishlistPage from '@pages/WishlistPage'
import CheckoutPage from '@pages/CheckoutPage'
import OrderSuccessPage from '@pages/OrderSuccessPage'
import ProfilePage from '@pages/ProfilePage'
import SettingsPage from '@pages/SettingsPage'
import NotFoundPage from '@pages/NotFoundPage'
import DashboardPage from '@pages/admin/DashboardPage'
import ProductsPageAdmin from '@pages/admin/ProductsPage'
import OrdersPage from '@pages/admin/OrdersPage'
import CustomersPage from '@pages/admin/CustomersPage'
import AdminSettingsPage from '@pages/admin/SettingsPage'
import LoginPage from '@pages/auth/LoginPage'
import RegisterPage from '@pages/auth/RegisterPage'
import ForgotPasswordPage from '@pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '@pages/auth/ResetPasswordPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/:id', element: <ProductDetailsPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'wishlist', element: <WishlistPage /> },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      { path: 'order-success', element: <OrderSuccessPage /> },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password/:token', element: <ResetPasswordPage /> },
  {
    path: '/admin',
    element: <ProtectedRoute requiredRole="admin" />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'products', element: <ProductsPageAdmin /> },
          { path: 'orders', element: <OrdersPage /> },
          { path: 'customers', element: <CustomersPage /> },
          { path: 'settings', element: <AdminSettingsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])

export default function Router() {
  return <RouterProvider router={router} />
}
