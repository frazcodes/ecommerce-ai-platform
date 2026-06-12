import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface FloatingElementProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}

/**
 * FloatingElement Component
 * 
 * Purpose: Reusable floating animated element for visual interest
 * Why it exists: Adds dynamic visual interest and premium feel to hero section
 * Features: Floating animation, customizable delay/duration, glassmorphism styling
 */
const FloatingElement = ({ 
  children, 
  delay = 0, 
  duration = 3,
  className = '' 
}: FloatingElementProps) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

export default FloatingElement
