import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiShoppingCart } from 'react-icons/fi'
import type { Product } from '../../types'
import { useCart } from '../../contexts/CartContext'

interface ProductRecommendationCardProps {
  product: Product
}

/**
 * ProductRecommendationCard Component
 * 
 * Purpose: Display product recommendations in chat
 * Why it exists: AI can recommend products visually
 * Features: Compact product card, image, title, price, add to cart, glassmorphism styling
 */
const ProductRecommendationCard = ({ product }: ProductRecommendationCardProps) => {
  const { addToCart } = useCart()
  const discountedPrice = product.price * (1 - product.discountPercentage / 100)

  const handleAddToCart = () => {
    addToCart(product, 1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 overflow-hidden rounded-xl border border-white/20 bg-white/80 p-3 backdrop-blur-xl dark:border-gray-700/30 dark:bg-gray-900/80"
    >
      {/* Product Image */}
      <Link to={`/products/${product.id}`} className="flex-shrink-0">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-20 w-20 rounded-lg object-cover"
        />
      </Link>

      {/* Product Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link
            to={`/products/${product.id}`}
            className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-purple-600 dark:text-gray-100 dark:hover:text-purple-400"
          >
            {product.title}
          </Link>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
              ${discountedPrice.toFixed(2)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-xs text-gray-500 line-through dark:text-gray-400">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <motion.button
            onClick={handleAddToCart}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiShoppingCart size={12} />
            Add
          </motion.button>
          <Link
            to={`/products/${product.id}`}
            className="flex flex-1 items-center justify-center rounded-lg border border-purple-200 px-3 py-1.5 text-xs font-semibold text-purple-600 transition-colors hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-900/30"
          >
            View
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductRecommendationCard
