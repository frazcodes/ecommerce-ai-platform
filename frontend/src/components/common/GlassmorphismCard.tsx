import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface GlassmorphismCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  variant?: 'default' | 'hero' | 'solid'
}

const GlassmorphismCard = ({
  children,
  className = '',
  hover = true,
  variant = 'default',
}: GlassmorphismCardProps) => {
  const variantStyles = {
    default: 'glass-card',
    hero: 'rounded-2xl border border-white/20 bg-white/10 backdrop-blur-3xl shadow-xl dark:border-white/10 dark:bg-white/5',
    solid: 'glass-card shadow-[var(--shadow-glow)]',
  }

  return (
    <motion.div
      className={`${variantStyles[variant]} ${className}`}
      whileHover={hover ? { y: -6, scale: 1.01 } : {}}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default GlassmorphismCard
