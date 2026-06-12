/**
 * Admin Types and Interfaces
 * 
 * Purpose: TypeScript interfaces for admin dashboard data structures
 * Why it exists: Type safety for admin operations (products, orders, customers, dashboard stats)
 * Architecture: Prepared for future FastAPI + MongoDB integration
 * 
 * These types will map directly to MongoDB schemas when backend is connected
 */

// ==================== Dashboard Stats ====================

export interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  totalUsers: number
  pendingOrders: number
  shippedOrders: number
  deliveredOrders: number
}

// ==================== Order Types ====================

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  orderNumber: string
  customer: Customer
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  shippingAddress: ShippingAddress
  paymentMethod: string
  createdAt: Date
  updatedAt: Date
  estimatedDelivery?: Date
}

export interface OrderItem {
  productId: string
  productName: string
  productImage: string
  quantity: number
  price: number
  discount?: number
}

export interface ShippingAddress {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

// ==================== Customer Types ====================

export interface Customer {
  id: string
  email: string
  fullName: string
  phone?: string
  avatar?: string
  totalOrders: number
  totalSpent: number
  createdAt: Date
  lastOrderDate?: Date
  status: 'active' | 'inactive' | 'blocked'
}

// ==================== Product Types ====================

export interface AdminProduct {
  id: string
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
  tags: string[]
  sku: string
  barcode?: string
  weight?: number
  dimensions?: {
    width: number
    height: number
    depth: number
  }
  shippingInformation: string
  returnPolicy: string
  warranty?: string
  isActive: boolean
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProductFormData {
  title: string
  description: string
  price: number
  discountPercentage: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
  tags: string[]
  sku: string
  barcode?: string
  weight?: number
  shippingInformation: string
  returnPolicy: string
  warranty?: string
  isActive: boolean
  featured: boolean
}

// ==================== Chart Data Types ====================

export interface RevenueData {
  month: string
  revenue: number
  orders: number
}

export interface OrdersData {
  date: string
  orders: number
  delivered: number
  pending: number
}

export interface TopSellingProduct {
  id: string
  name: string
  image: string
  sold: number
  revenue: number
}

// ==================== API Response Types ====================

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// ==================== Filter Types ====================

export interface ProductFilter {
  page?: number
  limit?: number
  category?: string
  brand?: string
  search?: string
  sortBy?: 'createdAt' | 'price' | 'rating' | 'stock' | 'title'
  sortOrder?: 'asc' | 'desc'
  status?: 'active' | 'inactive' | 'all'
}

export interface OrderFilter {
  page?: number
  limit?: number
  status?: OrderStatus
  search?: string
  dateFrom?: Date
  dateTo?: Date
  sortBy?: 'createdAt' | 'totalAmount'
  sortOrder?: 'asc' | 'desc'
}

export interface CustomerFilter {
  page?: number
  limit?: number
  search?: string
  status?: 'active' | 'inactive' | 'blocked'
  sortBy?: 'createdAt' | 'totalSpent' | 'totalOrders'
  sortOrder?: 'asc' | 'desc'
}
