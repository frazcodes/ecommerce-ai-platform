import { motion } from 'framer-motion'

interface FilterBarProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

/**
 * FilterBar Component
 * 
 * Purpose: Category filter with pill-style buttons
 * Why it exists: Easy category selection with visual feedback
 * Features: Category pills, active state highlighting, glassmorphism styling, animations
 */
const FilterBar = ({ categories, selectedCategory, onCategoryChange }: FilterBarProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <motion.button
        onClick={() => onCategoryChange('all')}
        className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
          selectedCategory === 'all'
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
            : 'bg-white/80 text-gray-700 backdrop-blur-xl hover:bg-purple-50 dark:bg-gray-900/80 dark:text-gray-300 dark:hover:bg-purple-900/30'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        All
      </motion.button>
      {categories.map((category) => (
        <motion.button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all capitalize ${
            selectedCategory === category
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
              : 'bg-white/80 text-gray-700 backdrop-blur-xl hover:bg-purple-50 dark:bg-gray-900/80 dark:text-gray-300 dark:hover:bg-purple-900/30'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {category}
        </motion.button>
      ))}
    </div>
  )
}

export default FilterBar
