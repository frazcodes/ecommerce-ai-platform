import { motion } from 'framer-motion'
import { FiMessageSquare } from 'react-icons/fi'
import { useAIChat } from '../../contexts/AIChatContext'

/**
 * AIChatButton Component
 * 
 * Purpose: Floating button to open/close AI chat
 * Why it exists: Easy access to AI assistant from anywhere in the app
 * Features: Floating action button, AI icon with pulse animation, glassmorphism styling
 */
const AIChatButton = () => {
  const { isOpen, openChat } = useAIChat()

  if (isOpen) return null

  return (
    <motion.button
      onClick={openChat}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      {/* Pulse Animation */}
      {!isOpen && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Icon */}
      <FiMessageSquare size={24} className="relative z-10" />
    </motion.button>
  )
}

export default AIChatButton
