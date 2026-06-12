import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'
import { productService } from '../../services/productService'

interface CategoriesDropdownProps {
  onCategorySelect?: (category: string) => void
}

interface Category {
  slug: string
  name: string
  url: string
}

/**
 * CategoriesDropdown Component
 * 
 * Purpose: Dropdown menu for product category navigation
 * Why it exists: Provides organized category navigation without cluttering navbar
 * Features: Animated dropdown, hover states, click outside to close, API-fetched categories
 */
const CategoriesDropdown = ({ onCategorySelect }: CategoriesDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories()
        // Normalize categories to strings (handle both string[] and object[])
        const normalizedCategories = Array.isArray(data) 
          ? data.map((cat: string | Category) => typeof cat === 'string' ? cat : cat.slug)
          : []
        setCategories(normalizedCategories)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        // Fallback to hardcoded categories if API fails
        setCategories(['beauty', 'fragrances', 'furniture', 'groceries'])
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCategoryClick = (category: string) => {
    onCategorySelect?.(category)
    setIsOpen(false)
  }

  // Get current category from URL
  const currentCategory = location.pathname.includes('/products/') 
    ? location.pathname.split('/').pop() 
    : null

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100/50 dark:text-gray-300 dark:hover:bg-gray-800/50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Categories
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown size={16} />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200/50 bg-white/90 backdrop-blur-xl shadow-lg dark:border-gray-700/50 dark:bg-gray-900/90"
          >
            <div className="p-2">
              {/* All Products Link */}
              <Link
                to="/products"
                onClick={() => handleCategoryClick('all')}
                className="block w-full rounded-lg px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-purple-50 dark:text-gray-300 dark:hover:bg-purple-900/30"
              >
                All Products
              </Link>

              {/* Category Links */}
              {loading ? (
                <div className="px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400">
                  Loading...
                </div>
              ) : (
                categories.map((category: string, index: number) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 4 }}
                  >
                    <Link
                      to={`/products?category=${category}`}
                      onClick={() => handleCategoryClick(category)}
                      className={`block w-full rounded-lg px-4 py-2.5 text-left text-sm transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/30 ${
                        currentCategory === category
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CategoriesDropdown
