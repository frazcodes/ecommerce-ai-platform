/**
 * useAdminCustomers Hook
 * 
 * Purpose: Convenience hook for customer management
 * Why it exists: Simplifies access to customer data from context
 * Features: Auto-load on mount, refresh capability
 */

import { useEffect } from 'react'
import { useAdmin } from '../contexts/AdminContext'

export const useAdminCustomers = () => {
  const {
    customers,
    loadingCustomers,
    errorCustomers,
    totalCustomers,
    refreshCustomers,
  } = useAdmin()

  useEffect(() => {
    refreshCustomers()
  }, [refreshCustomers])

  return {
    customers,
    loading: loadingCustomers,
    error: errorCustomers,
    total: totalCustomers,
    refresh: refreshCustomers,
  }
}
