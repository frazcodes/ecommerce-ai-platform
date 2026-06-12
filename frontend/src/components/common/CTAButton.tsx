import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface CTAButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  href?: string
  loading?: boolean
}

const CTAButton = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  href,
  loading = false,
}: CTAButtonProps) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const variantClasses = {
    primary: `btn-primary ${sizeClasses[size]}`,
    secondary: `inline-flex items-center justify-center gap-2 rounded-full font-semibold bg-white/10 backdrop-blur-xl border border-white/25 text-white hover:bg-white/20 transition-all ${sizeClasses[size]}`,
    glass: `btn-glass ${sizeClasses[size]}`,
  }

  const buttonStyles = `${variantClasses[variant]} ${className}`

  const content = loading ? (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="flex items-center justify-center"
    >
      <div className="h-5 w-5 rounded-full border-2 border-current border-t-transparent" />
    </motion.div>
  ) : (
    <span className="relative z-10 flex items-center gap-2">{children}</span>
  )

  const motionProps = {
    whileHover: { scale: 1.04 } as const,
    whileTap: { scale: 0.97 } as const,
  }

  const shine =
    variant === 'primary' ? (
      <motion.div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
    ) : null

  if (href) {
    const isExternal = href.startsWith('http')
    if (isExternal) {
      return (
        <motion.a href={href} className={buttonStyles} onClick={onClick} {...motionProps}>
          {shine}
          {content}
        </motion.a>
      )
    }
    return (
      <motion.div {...motionProps} className="inline-block">
        <Link to={href} className={buttonStyles} onClick={onClick}>
          {shine}
          {content}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.button className={buttonStyles} onClick={onClick} disabled={loading} {...motionProps}>
      {shine}
      {content}
    </motion.button>
  )
}

export default CTAButton
