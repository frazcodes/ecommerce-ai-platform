// User Types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
}

// Product Types (matching dummyjson API)
export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
  reviews?: Review[]
  returnPolicy?: string
  minimumOrderQuantity?: number
  meta?: ProductMeta
  sku?: string
  weight?: number
  dimensions?: Dimensions
  warrantyInformation?: string
  shippingInformation?: string
  availabilityStatus?: string
  tags?: string[]
}

export interface ProductMeta {
  createdAt: string
  updatedAt: string
  barcode: string
  qrCode: string
}

export interface Dimensions {
  width: number
  height: number
  depth: number
}

export interface Review {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail: string
}

export interface ProductFilter {
  category?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  search?: string
  brand?: string
  limit?: number
  skip?: number
}

// Cart Types
export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

// Order Types
export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: Address
  paymentMethod: string
  createdAt: Date
  updatedAt: Date
}

// Address Types
export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

// AI Recommendation Types
export interface AIRecommendation {
  productId: string
  reason: string
  confidence: number
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  products: T[]
  total: number
  skip: number
  limit: number
}

// Error Types
export class ApiError extends Error {
  status: number
  code?: string

  constructor(status: number, message: string, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

// Route Types
export interface RouteConfig {
  path: string
  element: React.ComponentType
  protected?: boolean
  layout?: React.ComponentType
}
