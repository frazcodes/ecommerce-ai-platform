import { motion } from 'framer-motion'
import type { Message as MessageType } from '../../contexts/AIChatContext'
import ProductRecommendationCard from './ProductRecommendationCard'

interface MessageProps {
  message: MessageType
}

/**
 * Message Component
 * 
 * Purpose: Individual message display
 * Why it exists: Reusable message component for user and AI messages
 * Features: User message (right-aligned, gradient), AI message (left-aligned, glassmorphism), product recommendations
 */
const Message = ({ message }: MessageProps) => {
  const isUser = message.type === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl p-3 ${
          isUser
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
            : 'border border-white/20 bg-white/80 text-gray-900 backdrop-blur-xl dark:border-gray-700/30 dark:bg-gray-900/80 dark:text-gray-100'
        }`}
      >
        {/* Message Content */}
        <p className="text-sm leading-relaxed">{message.content}</p>

        {/* Product Recommendations */}
        {message.products && message.products.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.products.map((product) => (
              <ProductRecommendationCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div
          className={`mt-1 text-xs ${
            isUser ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </motion.div>
  )
}

export default Message
