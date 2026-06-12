/**
 * useAdminOrders Hook
 * 
 * Purpose: Convenience hook for order management
 * Why it exists: Simplifies access to order operations from context
 * Features: Auto-load on mount, status update capability
 */

import { useEffect } from 'react'
import { useAdmin } from '../contexts/AdminContext'

export const useAdminOrders = () => {
  const {
    orders,
    loadingOrders,
    errorOrders,
    totalOrders,
    refreshOrders,
    updateOrderStatus,
  } = useAdmin()

  useEffect(() => {
    refreshOrders()
  }, [refreshOrders])

  return {
    orders,
    loading: loadingOrders,
    error: errorOrders,
    total: totalOrders,
    refresh: refreshOrders,
    updateStatus: updateOrderStatus,
  }
}
