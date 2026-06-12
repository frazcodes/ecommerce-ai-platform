import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiX } from 'react-icons/fi'

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (query: string) => void
  onSearch?: (query: string) => void
}

/**
 * SearchBar Component
 * 
 * Purpose: Search input with glassmorphism design and smooth animations
 * Why it exists: Provides consistent search functionality across the app
 * Features: Focus animations, glassmorphism styling, search icon, clear button, controlled mode, Enter key support
 */
const SearchBar = ({ 
  placeholder = 'Search products...', 
  value: controlledValue,
  onChange,
  onSearch 
}: SearchBarProps) => {
  const [internalValue, setInternalValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const isControlled = controlledValue !== undefined
  const query = isControlled ? controlledValue : internalValue

  const handleSearch = (value: string) => {
    if (isControlled) {
      onChange?.(value)
    } else {
      setInternalValue(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(query)
    }
  }

  const handleClear = () => {
    handleSearch('')
    onSearch?.('')
  }

  return (
    <motion.div
      className="relative"
      initial={false}
      animate={{
        scale: isFocused ? 1.02 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        {/* Search Icon */}
        <FiSearch 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors"
          size={18}
        />
        
        {/* Search Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full rounded-full border border-[var(--border-glass)] bg-[var(--surface-glass)] px-12 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] backdrop-blur-xl transition-all duration-300 focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:focus:border-brand-400/50 dark:focus:ring-brand-400/20"
        />
        
        {/* Clear Button */}
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiX size={16} />
          </motion.button>
        )}
        
        {/* Focus Ring Animation */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-purple-500/50"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: isFocused ? 1 : 0,
            scale: isFocused ? 1 : 0.95,
          }}
          transition={{ duration: 0.2 }}
          style={{ pointerEvents: 'none' }}
        />
      </div>
    </motion.div>
  )
}

export default SearchBar
