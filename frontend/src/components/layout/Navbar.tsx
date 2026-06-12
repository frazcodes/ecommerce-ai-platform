import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiMenu, FiHeart, FiShoppingBag, FiLogIn, FiUserPlus } from 'react-icons/fi'
import SearchBar from '../common/SearchBar'
import CategoriesDropdown from '../common/CategoriesDropdown'
import CartIcon from '../common/CartIcon'
import DarkModeToggle from '../common/DarkModeToggle'
import MobileMenu from '../common/MobileMenu'
import UserMenu from '../common/UserMenu'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../hooks/useAuth'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { itemCount } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`)
    } else {
      navigate('/products')
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed left-0 right-0 top-0 z-40 transition-all duration-300 ${
          isScrolled ? 'glass-nav glass-nav-scrolled' : 'glass-nav'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="group flex flex-shrink-0 items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl brand-gradient shadow-lg shadow-purple-500/25 transition-transform group-hover:scale-105">
                <FiShoppingBag className="text-white" size={18} />
              </div>
              <motion.span
                className="font-display text-lg font-bold tracking-tight text-[var(--text-primary)]"
                whileHover={{ scale: 1.02 }}
              >
                Smart<span className="gradient-text">Cart</span>
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden flex-1 items-center justify-center gap-5 lg:flex">
              <CategoriesDropdown />
              <div className="w-80">
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5">
              <div className="hidden items-center gap-1 lg:flex">
                <Link to="/wishlist">
                  <motion.button
                    className="rounded-xl p-2.5 text-[var(--text-secondary)] transition-colors hover:bg-purple-500/10 hover:text-brand-600 dark:hover:text-brand-400"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Wishlist"
                  >
                    <FiHeart size={20} />
                  </motion.button>
                </Link>
                <CartIcon itemCount={itemCount} />
                <DarkModeToggle />
                
                {/* Auth Links / User Menu */}
                {isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <>
                    <Link to="/login">
                      <motion.button
                        className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-purple-500/10 hover:text-brand-600 dark:hover:text-brand-400"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FiLogIn size={18} />
                        <span>Login</span>
                      </motion.button>
                    </Link>
                    <Link to="/register">
                      <motion.button
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FiUserPlus size={18} />
                        <span>Sign up</span>
                      </motion.button>
                    </Link>
                  </>
                )}
              </div>

              <motion.button
                onClick={() => setIsMobileMenuOpen(true)}
                className="rounded-xl p-2.5 text-[var(--text-secondary)] transition-colors hover:bg-purple-500/10 lg:hidden"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Open menu"
              >
                <FiMenu size={22} />
              </motion.button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="pb-3 lg:hidden">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </motion.nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        cartItemCount={itemCount}
      />
    </>
  )
}

export default Navbar
