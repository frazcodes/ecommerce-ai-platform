import { apiClient } from './apiClient'
import { API_ENDPOINTS } from '../config/api'
import type { Product, ProductFilter, PaginatedResponse } from '../types'

/**
 * Product Service
 * 
 * Purpose: Business logic layer for product-related API calls
 * Why it exists: Separates API calls from UI components, reusable across the app
 * Features: Fetch products, search, filter, sort with type-safe functions
 */

export const productService = {
  /**
   * Fetch all products with pagination
   */
  async getProducts(params: ProductFilter = {}): Promise<PaginatedResponse<Product>> {
    const queryParams = new URLSearchParams()
    
    if (params.limit) queryParams.append('limit', params.limit.toString())
    if (params.skip) queryParams.append('skip', params.skip.toString())
    if (params.category) queryParams.append('category', params.category)
    
    const queryString = queryParams.toString()
    const endpoint = queryString ? `${API_ENDPOINTS.PRODUCTS}?${queryString}` : API_ENDPOINTS.PRODUCTS
    
    return apiClient.get<PaginatedResponse<Product>>(endpoint)
  },

  /**
   * Fetch a single product by ID
   */
  async getProductById(id: number): Promise<Product> {
    return apiClient.get<Product>(API_ENDPOINTS.PRODUCT_BY_ID(id))
  },

  /**
   * Search products by query
   */
  async searchProducts(query: string, limit: number = 10): Promise<PaginatedResponse<Product>> {
    const endpoint = `${API_ENDPOINTS.PRODUCT_SEARCH}?q=${encodeURIComponent(query)}&limit=${limit}`
    return apiClient.get<PaginatedResponse<Product>>(endpoint)
  },

  /**
   * Fetch products by category
   */
  async getProductsByCategory(category: string, limit: number = 10, skip: number = 0): Promise<PaginatedResponse<Product>> {
    const endpoint = `${API_ENDPOINTS.PRODUCT_BY_CATEGORY(category)}?limit=${limit}&skip=${skip}`
    return apiClient.get<PaginatedResponse<Product>>(endpoint)
  },

  /**
   * Fetch all categories
   */
  async getCategories(): Promise<string[] | { slug: string; name: string; url: string }[]> {
    return apiClient.get<string[] | { slug: string; name: string; url: string }[]>(API_ENDPOINTS.PRODUCT_CATEGORIES)
  },
}
