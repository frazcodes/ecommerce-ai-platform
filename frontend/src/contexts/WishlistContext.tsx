import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Product } from '../types'

interface WishlistContextType {
  items: Product[]
  itemCount: number
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: number) => void
  toggleWishlist: (product: Product) => void
  isInWishlist: (productId: number) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

/**
 * WishlistProvider Component
 * 
 * Purpose: Provide wishlist state and actions to all components
 * Why it exists: Centralized wishlist state management without prop drilling
 * Features: Add/remove items, toggle, check membership, localStorage persistence
 */
export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Product[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('smartcart_wishlist')
      if (savedWishlist) {
        setItems(JSON.parse(savedWishlist))
      }
    } catch (error) {
      console.error('Failed to load wishlist from localStorage:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save wishlist to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('smartcart_wishlist', JSON.stringify(items))
      } catch (error) {
        console.error('Failed to save wishlist to localStorage:', error)
      }
    }
  }, [items, isLoaded])

  // Calculate total item count
  const itemCount = items.length

  // Add product to wishlist
  const addToWishlist = (product: Product) => {
    setItems((prevItems) => {
      const exists = prevItems.some((item) => item.id === product.id)
      if (exists) return prevItems
      return [...prevItems, product]
    })
  }

  // Remove product from wishlist
  const removeFromWishlist = (productId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  // Toggle product in wishlist
  const toggleWishlist = (product: Product) => {
    setItems((prevItems) => {
      const exists = prevItems.some((item) => item.id === product.id)
      if (exists) {
        return prevItems.filter((item) => item.id !== product.id)
      }
      return [...prevItems, product]
    })
  }

  // Check if product is in wishlist
  const isInWishlist = (productId: number) => {
    return items.some((item) => item.id === productId)
  }

  // Clear all items from wishlist
  const clearWishlist = () => {
    setItems([])
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

/**
 * useWishlist Hook
 * 
 * Purpose: Consume wishlist context in components
 * Why it exists: Easy access to wishlist state and actions
 * Features: Type-safe wishlist context consumption
 */
export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
