/**
 * Admin Sidebar Component
 * 
 * Purpose: Navigation sidebar for admin dashboard
 * Why it exists: Provides navigation between admin sections
 * Features: Glassmorphism design, responsive, active state indicators
 */

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiSettings, FiMenu, FiX, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'

interface NavItem {
  path: string
  label: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
  { path: '/admin/products', label: 'Products', icon: FiPackage },
  { path: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
  { path: '/admin/customers', label: 'Customers', icon: FiUsers },
  { path: '/admin/settings', label: 'Settings', icon: FiSettings },
]

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 rounded-lg bg-purple-600 p-2 text-white shadow-lg"
      >
        <FiMenu size={24} />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen glass-nav border-r border-[var(--border-glass)]
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-[var(--border-glass)] px-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
                <FiGrid size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Admin
              </span>
            </div>
          )}
          <button
            onClick={() => {
              setIsCollapsed(!isCollapsed)
              setIsMobileOpen(false)
            }}
            className="hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:block"
          >
            {isCollapsed ? <FiMenu size={20} /> : <FiX size={20} />}
          </button>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`
                      flex items-center gap-3 rounded-lg px-4 py-3 transition-all
                      ${isActive 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30' 
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    <Icon size={20} />
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Info */}
        <div className="border-t border-[var(--border-glass)] p-4">
          {!isCollapsed && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white font-semibold">
                  {(user?.fullName || 'A').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user?.fullName || 'Admin'}
                  </p>
                  <p className="truncate text-xs text-gray-600 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => logout()}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <FiLogOut size={16} />
                Logout
              </button>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white font-semibold">
                A
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar
