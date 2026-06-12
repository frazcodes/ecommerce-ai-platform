import { BACKEND_API } from '../config/api'

export class ApiRequestError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
  }
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json()
    if (typeof data.detail === 'string') return data.detail
    if (Array.isArray(data.detail)) {
      return data.detail.map((item: { msg?: string }) => item.msg || 'Validation error').join(', ')
    }
    if (data.message) return data.message
    if (data.error) return data.error
  } catch {
    // ignore parse errors
  }
  
  // Map status codes to user-friendly messages
  switch (response.status) {
    case 401:
      return 'Invalid username or password'
    case 404:
      return 'Account not found'
    case 500:
      return 'Something went wrong. Please try again later.'
    case 0:
      return 'Unable to connect to the server. Please check your internet connection.'
    default:
      return `Request failed (${response.status})`
  }
}

export async function backendRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), BACKEND_API.TIMEOUT)

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${BACKEND_API.BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new ApiRequestError(await parseErrorMessage(response), response.status)
    }

    if (response.status === 204) {
      return undefined as T
    }

    return (await response.json()) as T
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof ApiRequestError) throw error
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiRequestError('Request timeout', 408)
    }
    throw new ApiRequestError(
      error instanceof Error ? error.message : 'Network error',
      0,
    )
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem('smartcart_token')
}

export function getStoredRefreshToken(): string | null {
  return localStorage.getItem('smartcart_refresh_token')
}
