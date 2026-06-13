import { useState, useEffect } from 'react'
import { productService } from '../services/productService'
import type { Product, ProductFilter, ApiError } from '../types'

/**
 * useProducts Hook
 * 
 * Purpose: React hook for fetching products with loading/error states
 * Why it exists: Reusable data fetching logic, automatic loading/error state management
 * Features: Loading state, error state, data state, pagination support
 */
export function useProducts(params: ProductFilter = {}) {
  const [data, setData] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const [total, setTotal] = useState(0)

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await productService.getProducts(params)
      setData(response.products)
      setTotal(response.total)
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [params.limit, params.skip, params.category])

  return {
    products: data,
    loading,
    error,
    total,
    refetch: fetchProducts,
  }
}

/**
 * useProduct Hook
 * 
 * Purpose: React hook for fetching a single product by ID
 * Why it exists: Reusable single product fetching with loading/error states
 * Features: Loading state, error state, data state
 */
export function useProduct(id: number) {
  const [data, setData] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const product = await productService.getProductById(id)
        setData(product)
      } catch (err) {
        setError(err as ApiError)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  return {
    product: data,
    loading,
    error,
  }
}

/**
 * useProductSearch Hook
 * 
 * Purpose: React hook for searching products
 * Why it exists: Reusable product search with loading/error states
 * Features: Loading state, error state, data state, debounced search
 */
export function useProductSearch(query: string, limit: number = 10) {
  const [data, setData] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  useEffect(() => {
    const searchProducts = async () => {
      if (!query.trim()) {
        setData([])
        return
      }

      setLoading(true)
      setError(null)
      
      try {
        const response = await productService.searchProducts(query, limit)
        setData(response.products)
      } catch (err) {
        setError(err as ApiError)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounceTimer)
  }, [query, limit])

  return {
    products: data,
    loading,
    error,
  }
}

/**
 * useCategories Hook
 * 
 * Purpose: React hook for fetching product categories
 * Why it exists: Reusable category fetching with loading/error states
 * Features: Loading state, error state, data state
 */
export function useCategories() {
  const [data, setData] = useState<string[] | { slug: string; name: string; url: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const categories = await productService.getCategories()
        setData(categories)
      } catch (err) {
        setError(err as ApiError)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return {
    categories: data,
    loading,
    error,
  }
}
