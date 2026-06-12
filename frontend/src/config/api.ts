/**
 * Backend API Configuration
 */

export const BACKEND_API = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: 30000,
} as const

/** DummyJSON for public product catalog (until backend products are wired) */
export const CATALOG_API = {
  BASE_URL: import.meta.env.VITE_CATALOG_API_URL || 'https://dummyjson.com',
  TIMEOUT: 30000,
} as const

export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: number) => `/products/${id}`,
  PRODUCT_SEARCH: '/products/search',
  PRODUCT_CATEGORIES: '/products/categories',
  PRODUCT_BY_CATEGORY: (category: string) => `/products/category/${category}`,
} as const
