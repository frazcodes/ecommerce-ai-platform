import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiHome, FiShoppingBag, FiHeart, FiUser } from 'react-icons/fi'
import { Link } from 'react-router-dom'

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
 * Features: Animated menu items, staggered entrance, close on click outside
 */
const MobileMenu = ({ isOpen, onClose, cartItemCount = 0 }: MobileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null)

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
    { icon: FiUser, label: 'Profile', path: '/profile' },
  ]

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
            </div>

            {/* Cart Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
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
