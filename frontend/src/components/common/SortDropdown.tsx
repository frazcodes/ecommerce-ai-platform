import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'

type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'

interface SortDropdownProps {
  selectedSort: SortOption
  onSortChange: (sort: SortOption) => void
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest Arrivals' },
]

/**
 * SortDropdown Component
 * 
 * Purpose: Sort products by various criteria
 * Why it exists: Flexible sorting options for better UX
 * Features: Sort options, dropdown with glassmorphism, active state indicator, animations
 */
const SortDropdown = ({ selectedSort, onSortChange }: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const selectedLabel = sortOptions.find((opt) => opt.value === selectedSort)?.label

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-white/20 bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 backdrop-blur-xl transition-colors hover:bg-purple-50 dark:border-gray-700/30 dark:bg-gray-900/80 dark:text-gray-300 dark:hover:bg-purple-900/30"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>Sort: {selectedLabel}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown size={16} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-10"
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-2xl border border-white/20 bg-white/90 backdrop-blur-xl shadow-xl dark:border-gray-700/30 dark:bg-gray-900/90"
            >
              {sortOptions.map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value)
                    setIsOpen(false)
                  }}
                  className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                    selectedSort === option.value
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  whileHover={{ x: 4 }}
                >
                  {option.label}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SortDropdown
