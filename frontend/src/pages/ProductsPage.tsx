import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import SearchBar from '../components/common/SearchBar'
import FilterBar from '../components/common/FilterBar'
import SortDropdown from '../components/common/SortDropdown'
import ProductGrid from '../components/features/ProductGrid'
import { useFilteredProducts } from '../hooks/useFilteredProducts'
import { productService } from '../services/productService'

type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'

interface Category {
  slug: string
  name: string
  url: string
}

/**
 * ProductsPage Component
 * 
 * Purpose: Dedicated products listing page with full filtering
 * Why it exists: Central location for browsing all products with search, filter, and sort
 * Features: Search bar, category filter bar, sort dropdown, product grid, loading/error states
 */
const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('featured')
  
  // Get category and search from URL params
  const categoryParam = searchParams.get('category')
  const searchParam = searchParams.get('search')
  const selectedCategory = categoryParam || 'all'

  // Initialize search query from URL
  useEffect(() => {
    if (searchParam) {
      setSearchQuery(decodeURIComponent(searchParam))
    }
  }, [searchParam])

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories()
        // Normalize categories to strings (handle both string[] and object[])
        const normalizedCategories = Array.isArray(data) 
          ? data.map((cat: string | Category) => typeof cat === 'string' ? cat : cat.slug)
          : []
        setCategories(normalizedCategories)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        // Fallback to hardcoded categories if API fails
        setCategories(['beauty', 'fragrances', 'furniture', 'groceries'])
      }
    }
    fetchCategories()
  }, [])

  const { products, loading, error } = useFilteredProducts({
    searchQuery,
    category: selectedCategory,
    sortBy,
    limit: 24,
  })

  const pageTitle = selectedCategory === 'all' 
    ? searchParam 
      ? `Search Results for "${searchParam}"`
      : 'All Products'
    : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams)
    if (category === 'all') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    setSearchParams(params)
  }

  return (
    <div className="page-content mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {pageTitle}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Browse our complete collection of premium products
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 space-y-4"
      >
        {/* Search Bar */}
        <div className="max-w-2xl">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search products by title, brand, or category..."
          />
        </div>

        {/* Filter Bar and Sort */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category Filter */}
          <FilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* Sort Dropdown */}
          <SortDropdown
            selectedSort={sortBy}
            onSortChange={setSortBy}
          />
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-4 text-sm text-gray-600 dark:text-gray-400"
      >
        {loading ? (
          'Loading products...'
        ) : (
          `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`
        )}
      </motion.div>

      {/* Product Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <ProductGrid
          products={products}
          loading={loading}
          error={error?.message || null}
        />
      </motion.div>
    </div>
  )
}

export default ProductsPage
