import { motion } from 'framer-motion'
import { FiShoppingBag, FiZap, FiCpu, FiStar, FiArrowRight } from 'react-icons/fi'
import FloatingElement from '../common/FloatingElement'
import GlassmorphismCard from '../common/GlassmorphismCard'
import CTAButton from '../common/CTAButton'

const HeroSection = () => {
  const features = [
    {
      icon: FiCpu,
      title: 'AI-Powered',
      description: 'Smart recommendations tailored to your preferences',
    },
    {
      icon: FiZap,
      title: 'Lightning Fast',
      description: 'Instant search and seamless checkout experience',
    },
    {
      icon: FiStar,
      title: 'Curated Quality',
      description: 'Hand-picked products from trusted brands',
    },
  ]

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Hero gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 dark:from-gray-950 dark:via-purple-950 dark:to-gray-950" />

      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-purple-500/30 blur-[100px]"
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-pink-500/25 blur-[100px]"
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[80px]"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Floating blur elements */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingElement delay={0} duration={4} className="absolute left-[10%] top-[20%]">
          <div className="h-24 w-24 rounded-full bg-purple-400/20 blur-2xl" />
        </FloatingElement>
        <FloatingElement delay={1} duration={5} className="absolute right-[15%] top-[30%]">
          <div className="h-32 w-32 rounded-full bg-pink-400/20 blur-2xl" />
        </FloatingElement>
        <FloatingElement delay={2} duration={4.5} className="absolute bottom-[30%] left-[20%]">
          <div className="h-20 w-20 rounded-full bg-blue-400/20 blur-2xl" />
        </FloatingElement>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 sm:pt-36 lg:px-8 lg:pt-40">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8 text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-xl"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <FiZap className="text-purple-300" size={14} />
              <span className="text-sm font-medium text-white/90">AI-Powered Shopping</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-5xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Shop Smarter
              <br />
              with{' '}
              <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
                AI
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="max-w-lg text-lg leading-relaxed text-white/70"
            >
              Experience the future of e-commerce with personalized recommendations,
              instant search, and seamless checkout powered by artificial intelligence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <CTAButton size="lg" href="/products">
                Start Shopping
                <FiArrowRight size={18} />
              </CTAButton>
              <CTAButton variant="secondary" size="lg">
                Learn More
              </CTAButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex gap-10 border-t border-white/10 pt-8"
            >
              {[
                { value: '10M+', label: 'Products' },
                { value: '500K+', label: 'Happy Customers' },
                { value: '4.9★', label: 'Rating' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-2xl font-bold text-white sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-sm text-white/50">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Feature cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.12 }}
              >
                <GlassmorphismCard variant="hero" className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 ring-1 ring-white/20">
                      <feature.icon className="text-purple-200" size={22} />
                    </div>
                    <div>
                      <h3 className="mb-1 font-display text-base font-semibold text-white">
                        {feature.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-white/60">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </GlassmorphismCard>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
            >
              <GlassmorphismCard variant="hero" className="p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl brand-gradient shadow-lg shadow-purple-500/30">
                    <FiShoppingBag className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="font-display text-lg font-bold text-white">SmartCart AI</div>
                    <div className="text-sm text-white/55">Your personal AI shopping assistant</div>
                  </div>
                </div>
              </GlassmorphismCard>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
