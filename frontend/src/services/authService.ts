/**
 * Auth Service — connected to FastAPI backend
 */

import type {
  User,
  AuthCredentials,
  RegisterData,
  AuthResponse,
  ForgotPasswordData,
  ResetPasswordData,
  ResetPasswordResponse,
} from '../types/auth'
import { AUTH_STORAGE_KEYS } from '../types/auth'
import { backendRequest, getStoredToken } from './backendClient'

interface BackendUser {
  id: string
  email: string
  username: string
  first_name?: string | null
  last_name?: string | null
  role: 'user' | 'admin' | 'superadmin'
  is_active: boolean
  is_verified: boolean
  created_at: string
  last_login?: string | null
}

interface BackendAuthResponse {
  user: BackendUser
  access_token: string
  refresh_token: string
}

function mapBackendUser(user: BackendUser): User {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim()
  return {
    id: user.id,
    email: user.email,
    fullName: fullName || user.username,
    username: user.username,
    role: user.role,
    isEmailVerified: user.is_verified,
    createdAt: new Date(user.created_at),
    updatedAt: new Date(user.created_at),
    lastLoginAt: user.last_login ? new Date(user.last_login) : undefined,
  }
}

function splitFullName(fullName: string): { first_name: string; last_name: string } {
  const parts = fullName.trim().split(/\s+/)
  return {
    first_name: parts[0] || '',
    last_name: parts.slice(1).join(' ') || '',
  }
}

function generateUsername(email: string, fullName: string): string {
  const fromEmail = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20)
  const fromName = fullName.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20)
  const base = fromName || fromEmail || 'user'
  return `${base}_${Date.now().toString().slice(-4)}`
}

class AuthService {
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const data = await backendRequest<BackendAuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    })

    return {
      success: true,
      user: mapBackendUser(data.user),
      token: data.access_token,
      refreshToken: data.refresh_token,
      message: 'Login successful',
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const { first_name, last_name } = splitFullName(data.fullName)
    const username = generateUsername(data.email, data.fullName)

    const response = await backendRequest<BackendAuthResponse>('/register', {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        username,
        password: data.password,
        first_name,
        last_name,
      }),
    })

    return {
      success: true,
      user: mapBackendUser(response.user),
      token: response.access_token,
      refreshToken: response.refresh_token,
      message: 'Registration successful',
    }
  }

  async logout(): Promise<void> {
    const token = getStoredToken()
    try {
      if (token) {
        await backendRequest('/logout', { method: 'POST' }, token)
      }
    } catch {
      // logout is client-side anyway
    }

    localStorage.removeItem(AUTH_STORAGE_KEYS.USER)
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN)
    localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN)
  }

  async getCurrentUser(token: string): Promise<User> {
    const user = await backendRequest<BackendUser>('/me', { method: 'GET' }, token)
    return mapBackendUser(user)
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const token = getStoredToken()
    if (!token) throw new Error('Not authenticated')

    return backendRequest<{ message: string }>(
      '/change-password',
      {
        method: 'PUT',
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      },
      token,
    )
  }

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const data = await backendRequest<{ access_token: string }>('/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    return { token: data.access_token }
  }

  async forgotPassword(_data: ForgotPasswordData): Promise<{ success: boolean; message: string }> {
    throw new Error('Password reset via email is not configured yet. Use change password after login.')
  }

  async resetPassword(_data: ResetPasswordData): Promise<ResetPasswordResponse> {
    throw new Error('Password reset via email is not configured yet. Use change password after login.')
  }
}

export const authService = new AuthService()
