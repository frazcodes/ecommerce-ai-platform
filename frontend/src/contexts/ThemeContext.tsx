import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * ThemeProvider Component
 * 
 * Purpose: Provide theme state and actions to all components
 * Why it exists: Centralized theme state management without prop drilling
 * Features: Set theme, toggle theme, localStorage persistence, system preference detection
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('light')
  const [isLoaded, setIsLoaded] = useState(false)

  // Load theme from localStorage or system preference on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('smartcart_theme') as Theme | null
      
      if (savedTheme) {
        setThemeState(savedTheme)
      } else {
        // Check system preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setThemeState(systemPrefersDark ? 'dark' : 'light')
      }
    } catch (error) {
      console.error('Failed to load theme from localStorage:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Apply theme to document and save to localStorage
  useEffect(() => {
    if (isLoaded) {
      const root = document.documentElement
      
      if (theme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }

      try {
        localStorage.setItem('smartcart_theme', theme)
      } catch (error) {
        console.error('Failed to save theme to localStorage:', error)
      }
    }
  }, [theme, isLoaded])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * useTheme Hook
 * 
 * Purpose: Consume theme context in components
 * Why it exists: Easy access to theme state and actions
 * Features: Type-safe theme context consumption
 */
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
