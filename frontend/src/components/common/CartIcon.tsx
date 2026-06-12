import { motion } from 'framer-motion'
import { FiShoppingCart } from 'react-icons/fi'
import { Link } from 'react-router-dom'

interface CartIconProps {
  itemCount?: number
}

/**
 * CartIcon Component
 * 
 * Purpose: Cart icon with badge showing item count
 * Why it exists: Visual indicator for cart status with item count
 * Features: Badge with count, hover animation, hides when count is 0
 */
const CartIcon = ({ itemCount = 0 }: CartIconProps) => {
  return (
    <Link to="/cart">
      <motion.button
        className="relative rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100/50 dark:text-gray-300 dark:hover:bg-gray-800/50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Cart Icon */}
        <FiShoppingCart size={20} />
        
        {/* Badge */}
        {itemCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </motion.div>
        )}
      </motion.button>
    </Link>
  )
}

export default CartIcon
