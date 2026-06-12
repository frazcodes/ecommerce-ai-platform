import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome, FiArrowLeft } from 'react-icons/fi'
import CTAButton from '../components/common/CTAButton'

const NotFoundPage = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="app-bg" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card relative max-w-lg p-10 text-center"
      >
        <div className="mb-6 font-display text-8xl font-extrabold gradient-text">404</div>
        <h1 className="mb-3 font-display text-2xl font-bold">Page Not Found</h1>
        <p className="mb-8 text-[var(--text-secondary)]">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <CTAButton href="/" variant="primary" size="md">
            <FiHome size={16} />
            Go to Homepage
          </CTAButton>
          <button
            onClick={() => window.history.back()}
            className="btn-glass px-6 py-3 text-sm"
          >
            <FiArrowLeft size={16} />
            Go Back
          </button>
        </div>

        <div className="mt-10 border-t border-[var(--border-subtle)] pt-8">
          <p className="mb-4 text-sm font-medium text-[var(--text-muted)]">
            You might be looking for:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { to: '/', label: 'Home' },
              { to: '/products', label: 'Products' },
              { to: '/cart', label: 'Cart' },
              { to: '/wishlist', label: 'Wishlist' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-full border border-[var(--border-glass)] bg-[var(--surface-glass)] px-4 py-1.5 text-sm text-[var(--text-secondary)] backdrop-blur-sm transition-colors hover:border-brand-500/30 hover:text-brand-600 dark:hover:text-brand-400"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFoundPage
