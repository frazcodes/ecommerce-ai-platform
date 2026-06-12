/**
 * Admin Context
 * 
 * Purpose: Global state management for admin dashboard
 * Why it exists: Centralized state for dashboard stats, products, orders, customers
 * Architecture: Context API pattern for easy state access across admin components
 * 
 * This context provides:
 * - Dashboard statistics
 * - Product management state
 * - Order management state
 * - Customer management state
 * - Loading and error states
 * - Refresh actions
 */

import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { DashboardStats, AdminProduct, Order, Customer, RevenueData, OrdersData, TopSellingProduct } from '../types/admin'
import { adminService } from '../services/adminService'

interface AdminContextType {
  // Dashboard Stats
  dashboardStats: DashboardStats | null
  revenueData: RevenueData[]
  ordersData: OrdersData[]
  topSellingProducts: TopSellingProduct[]
  loadingStats: boolean
  errorStats: string | null
  refreshDashboard: () => Promise<void>

  // Products
  products: AdminProduct[]
  loadingProducts: boolean
  errorProducts: string | null
  totalProducts: number
  refreshProducts: () => Promise<void>
  addProduct: (product: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt' | 'rating'>) => Promise<void>
  updateProduct: (id: string, product: Partial<AdminProduct>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>

  // Orders
  orders: Order[]
  loadingOrders: boolean
  errorOrders: string | null
  totalOrders: number
  refreshOrders: () => Promise<void>
  updateOrderStatus: (id: string, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') => Promise<void>

  // Customers
  customers: Customer[]
  loadingCustomers: boolean
  errorCustomers: string | null
  totalCustomers: number
  refreshCustomers: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  // Dashboard Stats State
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [ordersData, setOrdersData] = useState<OrdersData[]>([])
  const [topSellingProducts, setTopSellingProducts] = useState<TopSellingProduct[]>([])
  const [loadingStats, setLoadingStats] = useState(false)
  const [errorStats, setErrorStats] = useState<string | null>(null)

  // Products State
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [errorProducts, setErrorProducts] = useState<string | null>(null)
  const [totalProducts, setTotalProducts] = useState(0)

  // Orders State
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [errorOrders, setErrorOrders] = useState<string | null>(null)
  const [totalOrders, setTotalOrders] = useState(0)

  // Customers State
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loadingCustomers, setLoadingCustomers] = useState(false)
  const [errorCustomers, setErrorCustomers] = useState<string | null>(null)
  const [totalCustomers, setTotalCustomers] = useState(0)

  // ==================== Dashboard Actions ====================

  const refreshDashboard = useCallback(async () => {
    setLoadingStats(true)
    setErrorStats(null)
    try {
      const [stats, revenue, ordersChart, topProducts] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getRevenueData(),
        adminService.getOrdersData(),
        adminService.getTopSellingProducts(),
      ])
      setDashboardStats(stats)
      setRevenueData(revenue)
      setOrdersData(ordersChart)
      setTopSellingProducts(topProducts)
    } catch (err) {
      setErrorStats(err instanceof Error ? err.message : 'Failed to load dashboard stats')
    } finally {
      setLoadingStats(false)
    }
  }, [])

  // ==================== Product Actions ====================

  const refreshProducts = useCallback(async () => {
    setLoadingProducts(true)
    setErrorProducts(null)
    try {
      const response = await adminService.getProducts({ limit: 100 })
      setProducts(response.data)
      setTotalProducts(response.total)
    } catch (err) {
      setErrorProducts(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoadingProducts(false)
    }
  }, [])

  const addProduct = useCallback(async (product: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt' | 'rating'>) => {
    try {
      const newProduct = await adminService.createProduct(product as any)
      setProducts(prev => [newProduct, ...prev])
      setTotalProducts(prev => prev + 1)
    } catch (err) {
      throw err
    }
  }, [])

  const updateProduct = useCallback(async (id: string, product: Partial<AdminProduct>) => {
    try {
      const updated = await adminService.updateProduct(id, product as any)
      setProducts(prev => prev.map(p => p.id === id ? updated : p))
    } catch (err) {
      throw err
    }
  }, [])

  const deleteProduct = useCallback(async (id: string) => {
    try {
      await adminService.deleteProduct(id)
      setProducts(prev => prev.filter(p => p.id !== id))
      setTotalProducts(prev => prev - 1)
    } catch (err) {
      throw err
    }
  }, [])

  // ==================== Order Actions ====================

  const refreshOrders = useCallback(async () => {
    setLoadingOrders(true)
    setErrorOrders(null)
    try {
      const response = await adminService.getOrders({ limit: 100 })
      setOrders(response.data)
      setTotalOrders(response.total)
    } catch (err) {
      setErrorOrders(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      setLoadingOrders(false)
    }
  }, [])

  const updateOrderStatus = useCallback(async (id: string, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') => {
    try {
      const updated = await adminService.updateOrderStatus(id, status)
      setOrders(prev => prev.map(o => o.id === id ? updated : o))
    } catch (err) {
      throw err
    }
  }, [])

  // ==================== Customer Actions ====================

  const refreshCustomers = useCallback(async () => {
    setLoadingCustomers(true)
    setErrorCustomers(null)
    try {
      const response = await adminService.getCustomers({ limit: 100 })
      setCustomers(response.data)
      setTotalCustomers(response.total)
    } catch (err) {
      setErrorCustomers(err instanceof Error ? err.message : 'Failed to load customers')
    } finally {
      setLoadingCustomers(false)
    }
  }, [])

  return (
    <AdminContext.Provider
      value={{
        // Dashboard
        dashboardStats,
        revenueData,
        ordersData,
        topSellingProducts,
        loadingStats,
        errorStats,
        refreshDashboard,

        // Products
        products,
        loadingProducts,
        errorProducts,
        totalProducts,
        refreshProducts,
        addProduct,
        updateProduct,
        deleteProduct,

        // Orders
        orders,
        loadingOrders,
        errorOrders,
        totalOrders,
        refreshOrders,
        updateOrderStatus,

        // Customers
        customers,
        loadingCustomers,
        errorCustomers,
        totalCustomers,
        refreshCustomers,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
