import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiCreditCard, FiTruck, FiCheck } from 'react-icons/fi'
import { useCart } from '../contexts/CartContext'

/**
 * CheckoutPage Component
 * 
 * Purpose: Checkout flow with shipping form, order summary, and payment selection
 * Why it exists: Complete checkout experience for users to complete their purchase
 * Features: Shipping form, order summary, payment method selection, glassmorphism styling
 */
const CheckoutPage = () => {
  const navigate = useNavigate()
  const { items, total, itemCount } = useCart()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    paymentMethod: 'card',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)

  const shipping = total > 0 ? (total > 100 ? 0 : 9.99) : 0
  const tax = total * 0.08
  const orderTotal = total + shipping + tax

  if (items.length === 0) {
    return (
      <div className="page-content mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/20 bg-white/50 p-12 text-center backdrop-blur-xl dark:border-gray-700/30 dark:bg-gray-900/50"
        >
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Your cart is empty
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Add some products to proceed to checkout
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50"
          >
            Browse Products
          </Link>
        </motion.div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsProcessing(true)

    // Generate a fixed order number
    const orderNumber = 'ORD' + Date.now().toString().slice(-8) + Math.random().toString(36).substring(2, 6).toUpperCase()
    
    // Store order number in localStorage
    localStorage.setItem('lastOrderNumber', orderNumber)
    localStorage.setItem('lastOrderDate', new Date().toISOString())

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      navigate('/order-success')
    }, 2000)
  }

  return (
    <div className="page-content mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          to="/cart"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
        >
          <FiArrowLeft size={16} />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Checkout
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Checkout Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Shipping Information */}
          <div className="rounded-2xl border border-white/20 bg-white/80 p-6 backdrop-blur-xl dark:border-gray-700/30 dark:bg-gray-900/80">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              <FiTruck size={20} className="text-purple-600" />
              Shipping Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 ${
                      errors.firstName
                        ? 'border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:focus:ring-red-500/20'
                        : 'border-gray-200/50 focus:border-purple-500/50 focus:ring-purple-500/20 dark:border-gray-700/50 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20'
                    } bg-white/80 dark:bg-gray-900/80 dark:text-gray-100`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 ${
                      errors.lastName
                        ? 'border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:focus:ring-red-500/20'
                        : 'border-gray-200/50 focus:border-purple-500/50 focus:ring-purple-500/20 dark:border-gray-700/50 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20'
                    } bg-white/80 dark:bg-gray-900/80 dark:text-gray-100`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:focus:ring-red-500/20'
                      : 'border-gray-200/50 focus:border-purple-500/50 focus:ring-purple-500/20 dark:border-gray-700/50 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20'
                  } bg-white/80 dark:bg-gray-900/80 dark:text-gray-100`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 ${
                    errors.phone
                      ? 'border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:focus:ring-red-500/20'
                      : 'border-gray-200/50 focus:border-purple-500/50 focus:ring-purple-500/20 dark:border-gray-700/50 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20'
                  } bg-white/80 dark:bg-gray-900/80 dark:text-gray-100`}
                  placeholder="+1 (555) 000-0000"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 ${
                    errors.address
                      ? 'border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:focus:ring-red-500/20'
                      : 'border-gray-200/50 focus:border-purple-500/50 focus:ring-purple-500/20 dark:border-gray-700/50 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20'
                  } bg-white/80 dark:bg-gray-900/80 dark:text-gray-100`}
                  placeholder="123 Main Street"
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 ${
                      errors.city
                        ? 'border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:focus:ring-red-500/20'
                        : 'border-gray-200/50 focus:border-purple-500/50 focus:ring-purple-500/20 dark:border-gray-700/50 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20'
                    } bg-white/80 dark:bg-gray-900/80 dark:text-gray-100`}
                    placeholder="New York"
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 ${
                      errors.state
                        ? 'border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:focus:ring-red-500/20'
                        : 'border-gray-200/50 focus:border-purple-500/50 focus:ring-purple-500/20 dark:border-gray-700/50 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20'
                    } bg-white/80 dark:bg-gray-900/80 dark:text-gray-100`}
                    placeholder="NY"
                  />
                  {errors.state && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 ${
                      errors.zipCode
                        ? 'border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:focus:ring-red-500/20'
                        : 'border-gray-200/50 focus:border-purple-500/50 focus:ring-purple-500/20 dark:border-gray-700/50 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20'
                    } bg-white/80 dark:bg-gray-900/80 dark:text-gray-100`}
                    placeholder="10001"
                  />
                  {errors.zipCode && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.zipCode}</p>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Payment Method */}
          <div className="rounded-2xl border border-white/20 bg-white/80 p-6 backdrop-blur-xl dark:border-gray-700/30 dark:bg-gray-900/80">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              <FiCreditCard size={20} className="text-purple-600" />
              Payment Method
            </h2>

            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-purple-500 bg-purple-50 p-4 dark:border-purple-400 dark:bg-purple-900/30">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-purple-600"
                />
                <div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Credit Card</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Visa, Mastercard, Amex</p>
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200/50 p-4 transition-colors hover:border-purple-500/50 dark:border-gray-700/50 dark:hover:border-purple-400/50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={formData.paymentMethod === 'paypal'}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-purple-600"
                />
                <div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">PayPal</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pay with your PayPal account</p>
                </div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/20 bg-white/80 p-6 backdrop-blur-xl dark:border-gray-700/30 dark:bg-gray-900/80"
        >
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Order Summary
          </h2>

          {/* Order Items */}
          <div className="mb-6 space-y-3">
            {items.map((item) => {
              const discountedPrice = item.product.price * (1 - item.product.discountPercentage / 100)
              return (
                <div key={item.product.id} className="flex items-center gap-3">
                  <img
                    src={item.product.thumbnail}
                    alt={item.product.title}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1 dark:text-gray-100">
                      {item.product.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    ${(discountedPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3 border-t border-gray-200 pt-4 dark:border-gray-700">
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

          {/* Place Order Button */}
          <motion.button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={!isProcessing ? { scale: 1.05 } : {}}
            whileTap={!isProcessing ? { scale: 0.95 } : {}}
          >
            {isProcessing ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </>
            ) : (
              <>
                <FiCheck size={18} />
                Place Order
              </>
            )}
          </motion.button>

          {/* Security Notice */}
          <div className="mt-4 rounded-lg bg-green-50 p-3 text-center text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
            🔒 Your payment information is secure and encrypted
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CheckoutPage
