import { CATALOG_API } from '../config/api'
import { ApiError } from '../types'

/**
 * API Client
 * 
 * Purpose: Base HTTP client with interceptors and error handling
 * Why it exists: Centralized API configuration, consistent error handling, request/response interceptors
 * Features: Timeout handling, error classification, request/response logging
 */

class ApiClient {
  private baseURL: string
  private timeout: number

  constructor(baseURL: string, timeout: number) {
    this.baseURL = baseURL
    this.timeout = timeout
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw this.handleError(response)
      }

      const data = await response.json()
      return data as T
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(408, 'Request timeout', 'TIMEOUT')
        }
        throw error
      }
      
      throw new ApiError(0, 'An unknown error occurred', 'UNKNOWN')
    }
  }

  private handleError(response: Response): ApiError {
    const status = response.status
    let message = 'An error occurred'
    let code = 'UNKNOWN'

    if (status >= 400 && status < 500) {
      // Client errors
      switch (status) {
        case 400:
          message = 'Bad request'
          code = 'BAD_REQUEST'
          break
        case 401:
          message = 'Unauthorized'
          code = 'UNAUTHORIZED'
          break
        case 403:
          message = 'Forbidden'
          code = 'FORBIDDEN'
          break
        case 404:
          message = 'Resource not found'
          code = 'NOT_FOUND'
          break
        default:
          message = 'Client error'
          code = 'CLIENT_ERROR'
      }
    } else if (status >= 500) {
      // Server errors
      message = 'Server error'
      code = 'SERVER_ERROR'
    }

    return new ApiError(status, message, code)
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient(CATALOG_API.BASE_URL, CATALOG_API.TIMEOUT)
