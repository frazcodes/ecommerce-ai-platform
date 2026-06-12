import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingBag, FiTrash2, FiArrowRight } from 'react-icons/fi'
import QuantitySelector from '../components/common/QuantitySelector'
import { useCart } from '../contexts/CartContext'

/**
 * CartPage Component
 * 
 * Purpose: Display shopping cart with items and checkout options
 * Why it exists: Allows users to review and manage items before checkout
 * Features: Cart items list, quantity controls, price summary, checkout button
 */
const CartPage = () => {
  const { items, total, itemCount, updateQuantity, removeFromCart, clearCart } = useCart()

  const shipping = total > 0 ? (total > 100 ? 0 : 9.99) : 0
  const tax = total * 0.08
  const orderTotal = total + shipping + tax

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart()
    }
  }

  return (
    <div className="page-content mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Shopping Cart
        </h1>
        {items.length > 0 && (
          <motion.button
            onClick={handleClearCart}
            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiTrash2 size={16} />
            Clear Cart
          </motion.button>
        )}
      </div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/20 bg-white/50 p-12 text-center backdrop-blur-xl dark:border-gray-700/30 dark:bg-gray-900/50"
        >
          <div className="mb-4 flex justify-center">
            <FiShoppingBag size={64} className="text-gray-300 dark:text-gray-600" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Your cart is empty
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Add some products to get started
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50"
          >
            Browse Products
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const discountedPrice = item.product.price * (1 - item.product.discountPercentage / 100)
              return (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="overflow-hidden rounded-2xl border border-white/20 bg-white/80 p-4 backdrop-blur-xl dark:border-gray-700/30 dark:bg-gray-900/80"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link to={`/products/${item.product.id}`} className="flex-shrink-0">
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.title}
                        className="h-24 w-24 rounded-lg object-cover"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link
                          to={`/products/${item.product.id}`}
                          className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-purple-600 dark:text-gray-100 dark:hover:text-purple-400"
                        >
                          {item.product.title}
                        </Link>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          {item.product.brand}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            ${discountedPrice.toFixed(2)}
                          </span>
                          {item.product.discountPercentage > 0 && (
                            <span className="text-xs text-gray-500 line-through dark:text-gray-400">
                              ${item.product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity and Remove */}
                      <div className="flex items-center justify-between">
                        <QuantitySelector
                          quantity={item.quantity}
                          onQuantityChange={(qty) => updateQuantity(item.product.id, qty)}
                          min={1}
                          max={item.product.stock}
                        />
                        <motion.button
                          onClick={() => removeFromCart(item.product.id)}
                          className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiTrash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="rounded-2xl border border-white/20 bg-white/80 p-6 backdrop-blur-xl dark:border-gray-700/30 dark:bg-gray-900/80">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Order Summary
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  ${total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  ${tax.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Total
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    ${orderTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Link
              to="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50"
            >
              Proceed to Checkout
              <FiArrowRight size={16} />
            </Link>

            <div className="mt-4 text-center">
              <Link
                to="/products"
                className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
              >
                Continue Shopping
              </Link>
            </div>

            {/* Free Shipping Notice */}
            {total > 0 && total < 100 && (
              <div className="mt-4 rounded-lg bg-purple-50 p-3 text-center text-sm text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                Add ${(100 - total).toFixed(2)} more for FREE shipping!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage
