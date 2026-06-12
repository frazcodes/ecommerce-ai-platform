import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'
import HeroSection from '../components/features/HeroSection'
import ProductGrid from '../components/features/ProductGrid'
import { useProducts } from '../hooks/useProducts'

const HomePage = () => {
  const { products, loading, error } = useProducts({ limit: 24 })

  return (
    <div>
      <HeroSection />

      <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 flex justify-center">
            <span className="section-badge">
              <FiStar size={14} />
              Curated for You
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Products
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[var(--text-secondary)]">
            Discover our hand-picked selection of premium products, powered by AI recommendations
          </p>
        </motion.div>

        <ProductGrid
          products={products}
          loading={loading}
          error={error?.message || null}
        />
      </section>
    </div>
  )
}

export default HomePage
