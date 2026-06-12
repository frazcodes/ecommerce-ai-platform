import { Link } from 'react-router-dom'
import { FiHeart, FiTrash2 } from 'react-icons/fi'
import { motion } from 'framer-motion'
import ProductCard from '../components/common/ProductCard'
import { useWishlist } from '../contexts/WishlistContext'

/**
 * WishlistPage Component
 * 
 * Purpose: Display user's saved/wishlist items
 * Why it exists: Allows users to save products for later purchase
 * Features: Wishlist items list, remove from wishlist, add to cart
 */
const WishlistPage = () => {
  const { items, clearWishlist } = useWishlist()

  const handleClearWishlist = () => {
    if (confirm('Are you sure you want to clear your wishlist?')) {
      clearWishlist()
    }
  }

  return (
    <div className="page-content mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          My Wishlist
        </h1>
        {items.length > 0 && (
          <motion.button
            onClick={handleClearWishlist}
            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiTrash2 size={16} />
            Clear All
          </motion.button>
        )}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/20 bg-white/50 p-12 text-center backdrop-blur-xl dark:border-gray-700/30 dark:bg-gray-900/50"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mb-4 text-6xl"
          >
            <FiHeart className="mx-auto text-gray-300 dark:text-gray-600" />
          </motion.div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Your wishlist is empty
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Save items you love to your wishlist and they'll appear here
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50"
          >
            Start Shopping
          </Link>
        </motion.div>
      )}

      {/* Wishlist Items */}
      {items.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {items.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default WishlistPage
