import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiPackage, FiArrowRight, FiHome } from 'react-icons/fi'
import { useCart } from '../contexts/CartContext'

/**
 * OrderSuccessPage Component
 * 
 * Purpose: Display order confirmation after successful checkout
 * Why it exists: Provides users with confirmation that their order was placed successfully
 * Features: Success message, order details, continue shopping button, glassmorphism styling
 */
const OrderSuccessPage = () => {
  const { clearCart } = useCart()
  const [orderNumber, setOrderNumber] = useState('')
  const [orderDate, setOrderDate] = useState('')

  // Load order details from localStorage
  useEffect(() => {
    const storedOrderNumber = localStorage.getItem('lastOrderNumber')
    const storedOrderDate = localStorage.getItem('lastOrderDate')
    
    if (storedOrderNumber) {
      setOrderNumber(storedOrderNumber)
    } else {
      // Fallback to random if no stored order
      setOrderNumber('ORD' + Date.now().toString().slice(-8) + Math.random().toString(36).substring(2, 6).toUpperCase())
    }
    
    if (storedOrderDate) {
      setOrderDate(new Date(storedOrderDate).toLocaleDateString())
    } else {
      setOrderDate(new Date().toLocaleDateString())
    }
  }, [])

  // Clear cart after successful order
  useEffect(() => {
    clearCart()
  }, [])

  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-white/20 bg-white/80 p-12 text-center backdrop-blur-xl dark:border-gray-700/30 dark:bg-gray-900/80"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6 flex justify-center"
        >
          <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/30">
            <FiCheckCircle size={64} className="text-green-600 dark:text-green-400" />
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100"
        >
          Order Placed Successfully!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 text-gray-600 dark:text-gray-400"
        >
          Thank you for your purchase. Your order has been confirmed and will be shipped soon.
        </motion.p>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8 rounded-xl border border-white/20 bg-white/50 p-6 backdrop-blur-xl dark:border-gray-700/30 dark:bg-gray-900/50"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FiPackage size={20} className="text-purple-600" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Order Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Order Number</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                #{orderNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Order Date</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {orderDate}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Estimated Delivery</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {estimatedDelivery}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50"
          >
            Continue Shopping
            <FiArrowRight size={16} />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200/50 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-800/50"
          >
            <FiHome size={16} />
            Back to Home
          </Link>
        </motion.div>

        {/* Additional Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-sm text-gray-600 dark:text-gray-400"
        >
          A confirmation email has been sent to your email address with all the order details.
        </motion.p>
      </motion.div>
    </div>
  )
}

export default OrderSuccessPage
