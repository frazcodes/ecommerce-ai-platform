/**
 * useAdminDashboard Hook
 * 
 * Purpose: Convenience hook for dashboard data
 * Why it exists: Simplifies access to dashboard statistics from context
 * Features: Auto-load on mount, refresh capability
 */

import { useEffect } from 'react'
import { useAdmin } from '../contexts/AdminContext'

export const useAdminDashboard = () => {
  const {
    dashboardStats,
    revenueData,
    ordersData,
    topSellingProducts,
    loadingStats,
    errorStats,
    refreshDashboard,
  } = useAdmin()

  useEffect(() => {
    refreshDashboard()
  }, [refreshDashboard])

  return {
    dashboardStats,
    revenueData,
    ordersData,
    topSellingProducts,
    loading: loadingStats,
    error: errorStats,
    refresh: refreshDashboard,
  }
}
