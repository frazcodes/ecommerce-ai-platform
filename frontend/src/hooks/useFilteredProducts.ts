import { useState, useEffect, useMemo, useCallback } from 'react'
import { productService } from '../services/productService'
import type { Product, ApiError } from '../types'

type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'

interface UseFilteredProductsProps {
  searchQuery?: string
  category?: string
  sortBy?: SortOption
  limit?: number
}

/**
 * useFilteredProducts Hook
 * 
 * Purpose: Custom hook for filtered product fetching with search, category, and sort
 * Why it exists: Efficient React pattern for complex filtering logic
 * Features: Combines search, category filter, and sort, memoized results, debounced search
 */
export const useFilteredProducts = ({
  searchQuery = '',
  category = 'all',
  sortBy = 'featured',
  limit = 30,
}: UseFilteredProductsProps = {}) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  // Fetch products based on filters
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let data

      if (searchQuery.trim()) {
        // Search products
        data = await productService.searchProducts(searchQuery, limit)
        setProducts(data.products)
      } else if (category && category !== 'all') {
        // Filter by category
        data = await productService.getProductsByCategory(category, limit)
        setProducts(data.products)
      } else {
        // Fetch all products
        data = await productService.getProducts({ limit })
        setProducts(data.products)
      }
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, category, limit])

  useEffect(() => {
    const debounceTimer = setTimeout(fetchProducts, 300)
    return () => clearTimeout(debounceTimer)
  }, [fetchProducts])

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...products]

    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => {
          const priceA = a.price * (1 - a.discountPercentage / 100)
          const priceB = b.price * (1 - b.discountPercentage / 100)
          return priceA - priceB
        })
      case 'price-high':
        return sorted.sort((a, b) => {
          const priceA = a.price * (1 - a.discountPercentage / 100)
          const priceB = b.price * (1 - b.discountPercentage / 100)
          return priceB - priceA
        })
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating)
      case 'newest':
        return sorted.sort((a, b) => b.id - a.id)
      case 'featured':
      default:
        return sorted
    }
  }, [products, sortBy])

  return {
    products: sortedProducts,
    loading,
    error,
    refetch: fetchProducts,
  }
}
