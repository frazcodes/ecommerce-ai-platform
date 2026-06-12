/**
 * User Menu Component
 * 
 * Purpose: User profile dropdown in navbar
 * Why it exists: Provides user account access and logout
 * Features: User avatar, profile link, logout, glassmorphism design
 */

import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiUser, FiLogOut, FiSettings, FiChevronDown, FiGrid } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'

const UserMenu = () => {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
  }

  if (!user) {
    return null
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-full p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.fullName}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-500/20"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-lg font-semibold text-white ring-2 ring-purple-500/20">
            {user.fullName.charAt(0)}
          </div>
        )}
        <FiChevronDown
          size={16}
          className={`text-gray-600 transition-transform dark:text-gray-400 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="glass-nav absolute right-0 mt-2 w-56 rounded-2xl border border-[var(--border-glass)] bg-white/80 p-2 shadow-xl backdrop-blur-xl dark:bg-gray-900/80">
          {/* User Info */}
          <div className="border-b border-gray-200/50 pb-3 dark:border-gray-700/50">
            <div className="flex items-center gap-3 px-3 py-2">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-lg font-semibold text-white">
                  {user.fullName.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-gray-900 dark:text-gray-100">
                  {user.fullName}
                </p>
                <p className="truncate text-sm text-gray-600 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <FiUser size={18} />
              <span>Profile</span>
            </Link>
            
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <FiSettings size={18} />
              <span>Settings</span>
            </Link>

            {(user.role === 'admin' || user.role === 'superadmin') && (
              <Link
                to="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <FiGrid size={18} />
                <span>Admin Panel</span>
              </Link>
            )}
          </div>

          {/* Divider */}
          <div className="my-2 border-t border-gray-200/50 dark:border-gray-700/50" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
