import { motion } from 'framer-motion'
import { FiMinus, FiPlus } from 'react-icons/fi'

interface QuantitySelectorProps {
  quantity: number
  onQuantityChange: (quantity: number) => void
  min?: number
  max?: number
}

/**
 * QuantitySelector Component
 * 
 * Purpose: Select product quantity with +/- buttons
 * Why it exists: Reusable quantity selector for cart and product details
 * Features: Plus/minus buttons, quantity display, min/max limits, glassmorphism styling
 */
const QuantitySelector = ({ 
  quantity, 
  onQuantityChange, 
  min = 1, 
  max = 99 
}: QuantitySelectorProps) => {
  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1)
    }
  }

  const handleIncrease = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <motion.button
        onClick={handleDecrease}
        disabled={quantity <= min}
        className="rounded-lg border border-white/20 bg-white/80 p-2 text-gray-700 backdrop-blur-xl transition-colors hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700/30 dark:bg-gray-900/80 dark:text-gray-300 dark:hover:bg-purple-900/30"
        whileHover={{ scale: quantity > min ? 1.1 : 1 }}
        whileTap={{ scale: quantity > min ? 0.95 : 1 }}
      >
        <FiMinus size={16} />
      </motion.button>

      <motion.div
        key={quantity}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        className="w-12 text-center font-semibold text-gray-900 dark:text-gray-100"
      >
        {quantity}
      </motion.div>

      <motion.button
        onClick={handleIncrease}
        disabled={quantity >= max}
        className="rounded-lg border border-white/20 bg-white/80 p-2 text-gray-700 backdrop-blur-xl transition-colors hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700/30 dark:bg-gray-900/80 dark:text-gray-300 dark:hover:bg-purple-900/30"
        whileHover={{ scale: quantity < max ? 1.1 : 1 }}
        whileTap={{ scale: quantity < max ? 0.95 : 1 }}
      >
        <FiPlus size={16} />
      </motion.button>
    </div>
  )
}

export default QuantitySelector
