import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiHome, FiShoppingBag, FiHeart, FiUser, FiLogIn, FiUserPlus, FiSettings, FiLogOut } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import DarkModeToggle from './DarkModeToggle'
import { useAuth } from '../../hooks/useAuth'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  cartItemCount?: number
}

/**
 * MobileMenu Component
 *
 * Purpose: Hamburger menu for mobile devices
 * Why it exists: Provides navigation for mobile users with premium UX
 * Features: Animated menu items, staggered entrance, close on click outside, auth controls, theme toggle, profile dropdown
 */
const MobileMenu = ({ isOpen, onClose, cartItemCount = 0 }: MobileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated, user, logout } = useAuth()
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden' // Prevent scrolling
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset' // Restore scrolling
    }
  }, [isOpen, onClose])

  const menuItems = [
    { icon: FiHome, label: 'Home', path: '/' },
    { icon: FiShoppingBag, label: 'Products', path: '/products' },
    { icon: FiHeart, label: 'Wishlist', path: '/wishlist' },
  ]

  const handleLogout = async () => {
    await logout()
    setIsProfileDropdownOpen(false)
    onClose()
  }

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Menu Container */}
          <motion.div
            ref={menuRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-[85vw] max-w-sm overflow-y-auto bg-white/95 backdrop-blur-xl shadow-2xl dark:bg-gray-900/95"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200/50 p-6 dark:border-gray-700/50">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Menu
              </h2>
              <motion.button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100/50 dark:text-gray-300 dark:hover:bg-gray-800/50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiX size={24} />
              </motion.button>
            </div>

            {/* Menu Items */}
            <div className="p-6">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className="flex items-center gap-4 rounded-lg px-4 py-4 text-gray-700 transition-colors hover:bg-purple-50 dark:text-gray-300 dark:hover:bg-purple-900/30"
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </motion.div>
              ))}

              {/* Divider */}
              <div className="my-4 border-t border-gray-200/50 dark:border-gray-700/50" />

              {/* Theme Toggle */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 rounded-lg px-4 py-4 text-gray-700 dark:text-gray-300"
              >
                <DarkModeToggle />
                <span className="font-medium">Theme</span>
              </motion.div>

              {/* Auth Links */}
              {isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex w-full items-center gap-4 rounded-lg px-4 py-4 text-gray-700 transition-colors hover:bg-purple-50 dark:text-gray-300 dark:hover:bg-purple-900/30"
                  >
                    <FiUser size={20} />
                    <span className="font-medium">My Profile</span>
                  </button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4 mt-2 overflow-hidden rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
                      >
                        {/* User Info */}
                        <div className="mb-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                              <FiUser size={18} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-gray-100">
                                {user?.fullName || 'User'}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {user?.email || ''}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Profile */}
                        <Link
                          to="/profile"
                          onClick={() => { setIsProfileDropdownOpen(false); onClose() }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-purple-100 dark:text-gray-300 dark:hover:bg-purple-900/30"
                        >
                          <FiUser size={18} />
                          <span className="text-sm font-medium">Profile</span>
                        </Link>

                        {/* Settings */}
                        <Link
                          to="/settings"
                          onClick={() => { setIsProfileDropdownOpen(false); onClose() }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-purple-100 dark:text-gray-300 dark:hover:bg-purple-900/30"
                        >
                          <FiSettings size={18} />
                          <span className="text-sm font-medium">Settings</span>
                        </Link>

                        {/* Logout */}
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <FiLogOut size={18} />
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link
                      to="/login"
                      onClick={onClose}
                      className="flex items-center gap-4 rounded-lg px-4 py-4 text-gray-700 transition-colors hover:bg-purple-50 dark:text-gray-300 dark:hover:bg-purple-900/30"
                    >
                      <FiLogIn size={20} />
                      <span className="font-medium">Login</span>
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link
                      to="/register"
                      onClick={onClose}
                      className="flex items-center gap-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-4 text-white shadow-lg shadow-purple-500/30"
                    >
                      <FiUserPlus size={20} />
                      <span className="font-medium">Sign up</span>
                    </Link>
                  </motion.div>
                </>
              )}
            </div>

            {/* Cart Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="border-t border-gray-200/50 p-6 dark:border-gray-700/50"
            >
              <Link
                to="/cart"
                onClick={onClose}
                className="flex items-center justify-between rounded-lg bg-purple-600 px-6 py-4 text-white transition-colors hover:bg-purple-700"
              >
                <div className="flex items-center gap-3">
                  <FiShoppingBag size={20} />
                  <span className="font-medium">View Cart</span>
                </div>
                {cartItemCount > 0 && (
                  <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileMenu
