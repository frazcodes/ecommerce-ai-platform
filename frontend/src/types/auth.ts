/**
 * Auth Types and Interfaces
 * 
 * Purpose: TypeScript interfaces for authentication system
 * Why it exists: Type safety for auth operations (login, register, password reset)
 * Architecture: Prepared for future FastAPI JWT integration
 * 
 * These types will map directly to FastAPI Pydantic models when backend is connected
 */

// ==================== User Types ====================

export type UserRole = 'user' | 'admin' | 'superadmin'

export interface User {
  id: string
  email: string
  fullName: string
  username?: string
  avatar?: string
  role: UserRole
  isEmailVerified: boolean
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

// ==================== Auth Credentials ====================

export interface AuthCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

// ==================== Registration Data ====================

export interface RegisterData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

// ==================== Auth Response ====================

export interface AuthResponse {
  success: boolean
  user: User
  token: string
  refreshToken?: string
  message?: string
}

// ==================== Password Reset ====================

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  token: string
  newPassword: string
  confirmPassword: string
}

export interface ResetPasswordResponse {
  success: boolean
  message: string
}

// ==================== Social Auth ====================

export type SocialProvider = 'google' | 'github' | 'facebook' | 'twitter'

export interface SocialAuthData {
  provider: SocialProvider
  token: string
}

// ==================== Form Validation ====================

export interface FormErrors {
  email?: string
  password?: string
  fullName?: string
  confirmPassword?: string
  newPassword?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// ==================== API Response Types ====================

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// ==================== Local Storage Keys ====================

export const AUTH_STORAGE_KEYS = {
  USER: 'smartcart_user',
  TOKEN: 'smartcart_token',
  REFRESH_TOKEN: 'smartcart_refresh_token',
} as const
