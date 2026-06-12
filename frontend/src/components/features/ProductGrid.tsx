import { motion } from 'framer-motion'
import type { Product } from '../../types'
import ProductCard from '../common/ProductCard'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  error?: string | null
}

const ProductGrid = ({ products, loading = false, error = null }: ProductGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="glass-card h-96 skeleton-shimmer"
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card border-red-200/50 p-10 text-center dark:border-red-800/30">
        <p className="font-medium text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-[var(--text-secondary)]">No products found</p>
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.08 },
        },
      }}
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default ProductGrid
