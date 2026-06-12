/**
 * useAdminProducts Hook
 * 
 * Purpose: Convenience hook for product management
 * Why it exists: Simplifies access to product CRUD operations from context
 * Features: Auto-load on mount, add, update, delete operations
 */

import { useEffect } from 'react'
import { useAdmin } from '../contexts/AdminContext'

export const useAdminProducts = () => {
  const {
    products,
    loadingProducts,
    errorProducts,
    totalProducts,
    refreshProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useAdmin()

  useEffect(() => {
    refreshProducts()
  }, [refreshProducts])

  return {
    products,
    loading: loadingProducts,
    error: errorProducts,
    total: totalProducts,
    refresh: refreshProducts,
    add: addProduct,
    update: updateProduct,
    delete: deleteProduct,
  }
}
