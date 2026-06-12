import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingCart } from 'react-icons/fi'
import type { Product } from '../../types'
import DiscountBadge from './DiscountBadge'
import RatingStars from './RatingStars'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const discountedPrice = product.price * (1 - product.discountPercentage / 100)
  const isWishlisted = isInWishlist(product.id)

  const handleAddToCart = () => addToCart(product, 1)

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card group overflow-hidden"
    >
      <Link to={`/products/${product.id}`} className="relative block aspect-square overflow-hidden">
        <motion.img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <DiscountBadge discount={product.discountPercentage} />

        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute left-3 top-3 rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            Only {product.stock} left
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute left-3 top-3 rounded-full bg-red-500/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            Out of Stock
          </div>
        )}

        <motion.button
          onClick={handleToggleWishlist}
          className={`absolute right-3 top-3 rounded-full p-2.5 backdrop-blur-md transition-all ${
            isWishlisted
              ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
              : 'bg-white/80 text-gray-600 hover:bg-white dark:bg-gray-900/70 dark:text-gray-300'
          }`}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FiHeart size={16} className={isWishlisted ? 'fill-current' : ''} />
        </motion.button>
      </Link>

      <div className="relative p-4">
        <Link
          to={`/products/${product.id}`}
          className="mb-0.5 block text-xs font-semibold uppercase tracking-wide text-brand-600 hover:text-brand-500 dark:text-brand-400"
        >
          {product.brand}
        </Link>

        <Link
          to={`/products?category=${product.category}`}
          className="mb-1.5 block text-xs capitalize text-[var(--text-muted)] hover:text-brand-500"
        >
          {product.category}
        </Link>

        <Link
          to={`/products/${product.id}`}
          className="mb-2.5 block font-semibold leading-snug text-[var(--text-primary)] line-clamp-2 transition-colors hover:text-brand-600 dark:hover:text-brand-400"
        >
          {product.title}
        </Link>

        <div className="mb-3">
          <RatingStars rating={product.rating} size={14} />
        </div>

        <div className="mb-4 flex items-baseline gap-2">
          <span className="font-display text-xl font-bold text-[var(--text-primary)]">
            ${discountedPrice.toFixed(2)}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-sm text-[var(--text-muted)] line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        <motion.button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
            product.stock === 0
              ? 'cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
              : 'btn-primary py-2.5 shadow-purple-500/25 hover:shadow-purple-500/40'
          }`}
          whileHover={product.stock > 0 ? { scale: 1.02 } : {}}
          whileTap={product.stock > 0 ? { scale: 0.98 } : {}}
        >
          <FiShoppingCart size={15} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default ProductCard
