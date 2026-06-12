import { motion } from 'framer-motion'

interface DiscountBadgeProps {
  discount: number
}

/**
 * DiscountBadge Component
 * 
 * Purpose: Display discount percentage badge
 * Why it exists: Reusable badge for highlighting discounted products
 * Features: Red/pink gradient background, percentage display, animated entrance
 */
const DiscountBadge = ({ discount }: DiscountBadgeProps) => {
  if (discount <= 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1 text-xs font-semibold text-white shadow-lg"
    >
      -{discount.toFixed(0)}%
    </motion.div>
  )
}

export default DiscountBadge
