// App Constants
export const APP_NAME = 'SmartCart AI'
export const APP_VERSION = '1.0.0'

// API Constants
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
export const API_TIMEOUT = 10000 // 10 seconds

// Pagination
export const DEFAULT_PAGE_SIZE = 12
export const MAX_PAGE_SIZE = 50

// Cart Constants
export const MAX_CART_QUANTITY = 99
export const MIN_CART_QUANTITY = 1

// Product Constants (from dummyjson API)
export const PRODUCT_CATEGORIES = [
  'beauty',
  'fragrances',
  'furniture',
  'groceries',
] as const

export const PRODUCT_SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest Arrivals' },
] as const

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'smartcart_user',
  CART: 'smartcart_cart',
  TOKEN: 'smartcart_token',
  PREFERENCES: 'smartcart_preferences',
} as const

// Route Paths
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
  SEARCH: '/search',
} as const

// Animation Constants
export const ANIMATION_DURATION = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
} as const

// Breakpoints (for responsive design)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const
