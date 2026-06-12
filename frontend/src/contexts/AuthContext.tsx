import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type {
  User,
  AuthCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  AuthState,
} from '../types/auth'
import { AUTH_STORAGE_KEYS } from '../types/auth'
import { authService } from '../services/authService'
import { ApiRequestError } from '../services/backendClient'

interface AuthContextType extends AuthState {
  login: (credentials: AuthCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (data: ForgotPasswordData) => Promise<void>
  resetPassword: (data: ResetPasswordData) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const persistSession = (
  user: User,
  token: string,
  refreshToken?: string,
) => {
  localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user))
  localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token)
  if (refreshToken) {
    localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN)

      if (!storedToken) {
        setIsLoading(false)
        return
      }

      try {
        const currentUser = await authService.getCurrentUser(storedToken)
        setUser(currentUser)
        localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(currentUser))
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEYS.USER)
        localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN)
        localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN)
      } finally {
        setIsLoading(false)
      }
    }

    restoreSession()
  }, [])

  const login = useCallback(async (credentials: AuthCredentials) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.login(credentials)
      persistSession(response.user, response.token, response.refreshToken)
      setUser(response.user)
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Login failed'
      setError(message)
      throw new Error(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.register(data)
      persistSession(response.user, response.token, response.refreshToken)
      setUser(response.user)
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Registration failed'
      setError(message)
      throw new Error(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
    setError(null)
  }, [])

  const forgotPassword = useCallback(async (data: ForgotPasswordData) => {
    setIsLoading(true)
    setError(null)

    try {
      await authService.forgotPassword(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email'
      setError(message)
      throw new Error(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const resetPassword = useCallback(async (data: ResetPasswordData) => {
    setIsLoading(true)
    setError(null)

    try {
      await authService.resetPassword(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reset password'
      setError(message)
      throw new Error(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setIsLoading(true)
    setError(null)

    try {
      await authService.changePassword(currentPassword, newPassword)
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Failed to change password'
      setError(message)
      throw new Error(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN)
    if (!token) return

    setIsLoading(true)
    setError(null)

    try {
      const currentUser = await authService.getCurrentUser(token)
      setUser(currentUser)
      localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(currentUser))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh user'
      setError(message)
      throw new Error(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
