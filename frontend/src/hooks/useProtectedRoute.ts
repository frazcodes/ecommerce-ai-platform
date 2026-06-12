/**
 * useProtectedRoute Hook
 * 
 * Purpose: Hook for protecting routes that require authentication
 * Why it exists: Simplifies route protection logic across components
 * Features: Redirects unauthenticated users, stores return URL
 */

import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export const useProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store the current location to redirect back after login
      const returnUrl = location.pathname + location.search
      navigate(`/login?returnUrl=${encodeURIComponent(returnUrl)}`, { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate, location])

  return { isAuthenticated, isLoading }
}
