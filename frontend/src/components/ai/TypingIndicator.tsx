import { motion } from 'framer-motion'

/**
 * TypingIndicator Component
 * 
 * Purpose: Show AI is typing
 * Why it exists: Visual feedback during AI response generation
 * Features: Three bouncing dots animation, glassmorphism styling
 */
const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="h-2 w-2 rounded-full bg-purple-500"
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  )
}

export default TypingIndicator
