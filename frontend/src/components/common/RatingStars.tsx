import { FiStar } from 'react-icons/fi'
import { motion } from 'framer-motion'

interface RatingStarsProps {
  rating: number
  size?: number
  showNumber?: boolean
}

/**
 * RatingStars Component
 * 
 * Purpose: Display star rating with number
 * Why it exists: Reusable rating display component
 * Features: Star icons, numeric rating, hover effects, customizable size
 */
const RatingStars = ({ rating, size = 16, showNumber = true }: RatingStarsProps) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="flex items-center gap-1">
      {/* Full Stars */}
      {[...Array(fullStars)].map((_, i) => (
        <motion.div
          key={`full-${i}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <FiStar className="fill-yellow-400 text-yellow-400" size={size} />
        </motion.div>
      ))}

      {/* Half Star */}
      {hasHalfStar && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: fullStars * 0.05 }}
        >
          <FiStar className="fill-yellow-400/50 text-yellow-400" size={size} />
        </motion.div>
      )}

      {/* Empty Stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <motion.div
          key={`empty-${i}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: (fullStars + (hasHalfStar ? 1 : 0) + i) * 0.05 }}
        >
          <FiStar className="text-gray-300 dark:text-gray-600" size={size} />
        </motion.div>
      ))}

      {/* Rating Number */}
      {showNumber && (
        <span className="ml-1 text-sm font-medium text-gray-600 dark:text-gray-400">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

export default RatingStars
