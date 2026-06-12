/**
 * Admin Service Layer
 * 
 * Purpose: API service for admin dashboard operations
 * Why it exists: Centralized data fetching and mutations for admin features
 * Architecture: Prepared for future FastAPI + MongoDB integration
 * 
 * Current: Uses mock data
 * Future: Will connect to FastAPI endpoints
 * 
 * To connect to FastAPI:
 * 1. Replace mock data returns with fetch/axios calls
 * 2. Use API_BASE_URL from config
 * 3. Add authentication headers
 * 4. Handle API errors properly
 */

import type {
  DashboardStats,
  Order,
  Customer,
  AdminProduct,
  ProductFormData,
  RevenueData,
  OrdersData,
  TopSellingProduct,
  PaginatedResponse,
  ProductFilter,
  OrderFilter,
  CustomerFilter,
  OrderStatus,
} from '../types/admin'
import { backendRequest, getStoredToken } from './backendClient'

// ==================== Mock Data ====================

const mockDashboardStats: DashboardStats = {
  totalProducts: 156,
  totalOrders: 892,
  totalRevenue: 45678.50,
  totalUsers: 1245,
  pendingOrders: 45,
  shippedOrders: 123,
  deliveredOrders: 724,
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    fullName: 'John Doe',
    phone: '+1 234 567 8900',
    avatar: 'https://i.pravatar.cc/150?img=1',
    totalOrders: 12,
    totalSpent: 1250.50,
    createdAt: new Date('2024-01-15'),
    lastOrderDate: new Date('2024-06-10'),
    status: 'active',
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    fullName: 'Jane Smith',
    phone: '+1 234 567 8901',
    avatar: 'https://i.pravatar.cc/150?img=2',
    totalOrders: 8,
    totalSpent: 890.00,
    createdAt: new Date('2024-02-20'),
    lastOrderDate: new Date('2024-06-08'),
    status: 'active',
  },
  {
    id: '3',
    email: 'bob.wilson@example.com',
    fullName: 'Bob Wilson',
    phone: '+1 234 567 8902',
    avatar: 'https://i.pravatar.cc/150?img=3',
    totalOrders: 5,
    totalSpent: 450.75,
    createdAt: new Date('2024-03-10'),
    lastOrderDate: new Date('2024-06-05'),
    status: 'active',
  },
  {
    id: '4',
    email: 'alice.brown@example.com',
    fullName: 'Alice Brown',
    phone: '+1 234 567 8903',
    avatar: 'https://i.pravatar.cc/150?img=4',
    totalOrders: 15,
    totalSpent: 2100.00,
    createdAt: new Date('2024-01-05'),
    lastOrderDate: new Date('2024-06-11'),
    status: 'active',
  },
  {
    id: '5',
    email: 'charlie.davis@example.com',
    fullName: 'Charlie Davis',
    phone: '+1 234 567 8904',
    avatar: 'https://i.pravatar.cc/150?img=5',
    totalOrders: 3,
    totalSpent: 320.25,
    createdAt: new Date('2024-04-15'),
    lastOrderDate: new Date('2024-05-20'),
    status: 'inactive',
  },
]

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customer: mockCustomers[0],
    items: [
      {
        productId: '1',
        productName: 'Premium Wireless Headphones',
        productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100',
        quantity: 2,
        price: 299.99,
        discount: 10,
      },
    ],
    totalAmount: 539.98,
    status: 'delivered',
    shippingAddress: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 234 567 8900',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    paymentMethod: 'Credit Card',
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-05'),
    estimatedDelivery: new Date('2024-06-05'),
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customer: mockCustomers[1],
    items: [
      {
        productId: '2',
        productName: 'Smart Watch Pro',
        productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100',
        quantity: 1,
        price: 449.99,
      },
    ],
    totalAmount: 449.99,
    status: 'shipped',
    shippingAddress: {
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 234 567 8901',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
    },
    paymentMethod: 'PayPal',
    createdAt: new Date('2024-06-08'),
    updatedAt: new Date('2024-06-10'),
    estimatedDelivery: new Date('2024-06-15'),
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customer: mockCustomers[2],
    items: [
      {
        productId: '3',
        productName: 'Laptop Stand',
        productImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100',
        quantity: 1,
        price: 79.99,
      },
      {
        productId: '4',
        productName: 'Wireless Mouse',
        productImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100',
        quantity: 2,
        price: 49.99,
      },
    ],
    totalAmount: 179.97,
    status: 'pending',
    shippingAddress: {
      fullName: 'Bob Wilson',
      email: 'bob.wilson@example.com',
      phone: '+1 234 567 8902',
      address: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
    },
    paymentMethod: 'Credit Card',
    createdAt: new Date('2024-06-10'),
    updatedAt: new Date('2024-06-10'),
  },
]

const mockProducts: AdminProduct[] = [
  {
    id: '1',
    title: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 299.99,
    discountPercentage: 10,
    rating: 4.8,
    stock: 45,
    brand: 'AudioTech',
    category: 'smartphones',
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400',
    ],
    tags: ['wireless', 'headphones', 'audio', 'noise-cancellation'],
    sku: 'AT-WH-001',
    barcode: '1234567890123',
    weight: 0.3,
    dimensions: { width: 20, height: 25, depth: 10 },
    shippingInformation: 'Free shipping on orders over $50',
    returnPolicy: '30-day return policy',
    warranty: '2-year manufacturer warranty',
    isActive: true,
    featured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-06-01'),
  },
  {
    id: '2',
    title: 'Smart Watch Pro',
    description: 'Advanced smartwatch with health monitoring, GPS, and 7-day battery life.',
    price: 449.99,
    discountPercentage: 5,
    rating: 4.7,
    stock: 30,
    brand: 'TechWatch',
    category: 'smartphones',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400',
    ],
    tags: ['smartwatch', 'fitness', 'gps', 'health'],
    sku: 'TW-SW-002',
    barcode: '1234567890124',
    weight: 0.15,
    dimensions: { width: 15, height: 15, depth: 2 },
    shippingInformation: 'Free shipping on orders over $50',
    returnPolicy: '30-day return policy',
    warranty: '1-year manufacturer warranty',
    isActive: true,
    featured: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-06-01'),
  },
]

const mockRevenueData: RevenueData[] = [
  { month: 'Jan', revenue: 8500, orders: 85 },
  { month: 'Feb', revenue: 9200, orders: 92 },
  { month: 'Mar', revenue: 7800, orders: 78 },
  { month: 'Apr', revenue: 10500, orders: 105 },
  { month: 'May', revenue: 11200, orders: 112 },
  { month: 'Jun', revenue: 12500, orders: 125 },
]

const mockOrdersData: OrdersData[] = [
  { date: 'Jun 1', orders: 15, delivered: 12, pending: 3 },
  { date: 'Jun 5', orders: 18, delivered: 15, pending: 3 },
  { date: 'Jun 10', orders: 20, delivered: 17, pending: 3 },
  { date: 'Jun 15', orders: 22, delivered: 19, pending: 3 },
  { date: 'Jun 20', orders: 25, delivered: 22, pending: 3 },
]

const mockTopSellingProducts: TopSellingProduct[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100',
    sold: 156,
    revenue: 42174,
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100',
    sold: 124,
    revenue: 53124,
  },
  {
    id: '3',
    name: 'Laptop Stand',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100',
    sold: 89,
    revenue: 7119,
  },
]

// ==================== Admin Service ====================

class AdminService {
  // ==================== Dashboard Stats ====================

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const data = await backendRequest<{
        total_users: number
        total_products: number
        total_orders: number
        total_revenue: number
        pending_orders: number
        low_stock_products: number
      }>('/stats', { method: 'GET' }, getStoredToken())

      return {
        totalProducts: data.total_products,
        totalOrders: data.total_orders,
        totalRevenue: data.total_revenue,
        totalUsers: data.total_users,
        pendingOrders: data.pending_orders,
        shippedOrders: 0,
        deliveredOrders: 0,
      }
    } catch {
      return mockDashboardStats
    }
  }

  async getRevenueData(): Promise<RevenueData[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockRevenueData), 500)
    })
  }

  async getOrdersData(): Promise<OrdersData[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockOrdersData), 500)
    })
  }

  async getTopSellingProducts(): Promise<TopSellingProduct[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockTopSellingProducts), 500)
    })
  }

  // ==================== Product Management ====================

  async getProducts(filter: ProductFilter = {}): Promise<PaginatedResponse<AdminProduct>> {
    // Future: const response = await fetch(`${API_BASE_URL}/admin/products?${params}`)
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockProducts]
        
        // Apply filters
        if (filter.category) {
          filtered = filtered.filter(p => p.category === filter.category)
        }
        if (filter.brand) {
          filtered = filtered.filter(p => p.brand === filter.brand)
        }
        if (filter.search) {
          filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(filter.search!.toLowerCase()) ||
            p.description.toLowerCase().includes(filter.search!.toLowerCase())
          )
        }
        if (filter.status === 'active') {
          filtered = filtered.filter(p => p.isActive)
        } else if (filter.status === 'inactive') {
          filtered = filtered.filter(p => !p.isActive)
        }

        // Apply sorting
        if (filter.sortBy) {
          filtered.sort((a, b) => {
            const aVal = a[filter.sortBy!]
            const bVal = b[filter.sortBy!]
            const comparison = aVal > bVal ? 1 : -1
            return filter.sortOrder === 'desc' ? -comparison : comparison
          })
        }

        const page = filter.page || 1
        const limit = filter.limit || 10
        const start = (page - 1) * limit
        const paginated = filtered.slice(start, start + limit)

        resolve({
          data: paginated,
          total: filtered.length,
          page,
          limit,
          totalPages: Math.ceil(filtered.length / limit),
        })
      }, 500)
    })
  }

  async getProductById(id: string): Promise<AdminProduct | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = mockProducts.find(p => p.id === id) || null
        resolve(product)
      }, 300)
    })
  }

  async createProduct(data: ProductFormData): Promise<AdminProduct> {
    // Future: const response = await fetch(`${API_BASE_URL}/admin/products`, { method: 'POST', body: JSON.stringify(data) })
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProduct: AdminProduct = {
          ...data,
          id: Date.now().toString(),
          rating: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        mockProducts.push(newProduct)
        resolve(newProduct)
      }, 500)
    })
  }

  async updateProduct(id: string, data: Partial<ProductFormData>): Promise<AdminProduct> {
    // Future: const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) })
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockProducts.findIndex(p => p.id === id)
        if (index === -1) {
          reject(new Error('Product not found'))
          return
        }
        mockProducts[index] = {
          ...mockProducts[index],
          ...data,
          updatedAt: new Date(),
        }
        resolve(mockProducts[index])
      }, 500)
    })
  }

  async deleteProduct(id: string): Promise<void> {
    // Future: const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, { method: 'DELETE' })
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockProducts.findIndex(p => p.id === id)
        if (index === -1) {
          reject(new Error('Product not found'))
          return
        }
        mockProducts.splice(index, 1)
        resolve()
      }, 500)
    })
  }

  // ==================== Order Management ====================

  async getOrders(filter: OrderFilter = {}): Promise<PaginatedResponse<Order>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockOrders]
        
        if (filter.status) {
          filtered = filtered.filter(o => o.status === filter.status)
        }
        if (filter.search) {
          filtered = filtered.filter(o => 
            o.orderNumber.toLowerCase().includes(filter.search!.toLowerCase()) ||
            o.customer.fullName.toLowerCase().includes(filter.search!.toLowerCase())
          )
        }

        const page = filter.page || 1
        const limit = filter.limit || 10
        const start = (page - 1) * limit
        const paginated = filtered.slice(start, start + limit)

        resolve({
          data: paginated,
          total: filtered.length,
          page,
          limit,
          totalPages: Math.ceil(filtered.length / limit),
        })
      }, 500)
    })
  }

  async getOrderById(id: string): Promise<Order | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const order = mockOrders.find(o => o.id === id) || null
        resolve(order)
      }, 300)
    })
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    // Future: const response = await fetch(`${API_BASE_URL}/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockOrders.findIndex(o => o.id === id)
        if (index === -1) {
          reject(new Error('Order not found'))
          return
        }
        mockOrders[index].status = status
        mockOrders[index].updatedAt = new Date()
        resolve(mockOrders[index])
      }, 500)
    })
  }

  // ==================== Customer Management ====================

  async getCustomers(filter: CustomerFilter = {}): Promise<PaginatedResponse<Customer>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockCustomers]
        
        if (filter.status) {
          filtered = filtered.filter(c => c.status === filter.status)
        }
        if (filter.search) {
          filtered = filtered.filter(c => 
            c.fullName.toLowerCase().includes(filter.search!.toLowerCase()) ||
            c.email.toLowerCase().includes(filter.search!.toLowerCase())
          )
        }

        const page = filter.page || 1
        const limit = filter.limit || 10
        const start = (page - 1) * limit
        const paginated = filtered.slice(start, start + limit)

        resolve({
          data: paginated,
          total: filtered.length,
          page,
          limit,
          totalPages: Math.ceil(filtered.length / limit),
        })
      }, 500)
    })
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const customer = mockCustomers.find(c => c.id === id) || null
        resolve(customer)
      }, 300)
    })
  }

  async getCustomerOrders(customerId: string): Promise<Order[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const orders = mockOrders.filter(o => o.customer.id === customerId)
        resolve(orders)
      }, 500)
    })
  }
}

// Export singleton instance
export const adminService = new AdminService()
