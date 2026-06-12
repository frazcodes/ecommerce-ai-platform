import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart, FiShoppingCart, FiArrowLeft } from 'react-icons/fi'
import ImageGallery from '../components/common/ImageGallery'
import QuantitySelector from '../components/common/QuantitySelector'
import RatingStars from '../components/common/RatingStars'
import DiscountBadge from '../components/common/DiscountBadge'
import ProductCard from '../components/common/ProductCard'
import { useProduct, useProducts } from '../hooks/useProducts'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'

/**
 * ProductDetailsPage Component
 * 
 * Purpose: Display detailed information about a specific product
 * Why it exists: Allows users to view product details before purchasing
 * Features: Product images, description, price, reviews, add to cart, related products
 */
const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const [quantity, setQuantity] = useState(1)
  const { product, loading, error } = useProduct(id ? parseInt(id) : 0)
  const { items: cartItems } = useCart()
  const { products: relatedProducts } = useProducts({ 
    limit: 8, 
    category: cartItems.length > 0 ? cartItems[0].product.category : product?.category 
  })
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  if (loading) {
    return (
      <div className="page-content mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="mb-8 h-8 w-48 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="aspect-square rounded-2xl bg-gray-200 dark:bg-gray-800" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-6 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-24 w-full rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="page-content mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400">
            {error?.message || 'Product not found'}
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400"
          >
            <FiArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const discountedPrice = product.price * (1 - product.discountPercentage / 100)
  const isWishlisted = isInWishlist(product.id)

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  const handleToggleWishlist = () => {
    toggleWishlist(product)
  }

  return (
    <div className="page-content mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <Link to="/" className="hover:text-purple-600 dark:hover:text-purple-400">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-purple-600 dark:hover:text-purple-400">
          Products
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Product Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ImageGallery images={product.images} thumbnail={product.thumbnail} />
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Category & Brand */}
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              {product.category}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {product.brand}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <RatingStars rating={product.rating} size={18} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ({product.stock} in stock)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              ${discountedPrice.toFixed(2)}
            </span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-xl text-gray-500 line-through dark:text-gray-400">
                  ${product.price.toFixed(2)}
                </span>
                <DiscountBadge discount={product.discountPercentage} />
              </>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Description
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{product.description}</p>
          </div>

          {/* Quantity Selector */}
          <div>
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Quantity
            </h2>
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
              min={1}
              max={product.stock}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.button
              onClick={handleAddToCart}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiShoppingCart size={18} />
              Add to Cart
            </motion.button>
            <motion.button
              onClick={handleToggleWishlist}
              className={`rounded-full p-3 transition-colors ${
                isWishlisted
                  ? 'bg-pink-500 text-white'
                  : 'border border-white/20 bg-white/80 text-gray-700 backdrop-blur-xl hover:bg-purple-50 dark:border-gray-700/30 dark:bg-gray-900/80 dark:text-gray-300 dark:hover:bg-purple-900/30'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiHeart size={20} className={isWishlisted ? 'fill-current' : ''} />
            </motion.button>
          </div>

          {/* Shipping & Returns */}
          <div className="space-y-3 rounded-2xl border border-white/20 bg-white/50 p-4 backdrop-blur-xl dark:border-gray-700/30 dark:bg-gray-900/50">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>{product.shippingInformation}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span>{product.returnPolicy}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Products */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16"
      >
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Related Products
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts
            .filter((p) => p.id !== product.id)
            .slice(0, 4)
            .map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
        </div>
      </motion.section>
    </div>
  )
}

export default ProductDetailsPage
