import { jwtDecode } from 'jwt-decode'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthToken {
  token: string
  user: User
  organization?: {
    id: string
    name: string
    type: string
  }
}

export function getStoredToken(): AuthToken | null {
  if (typeof window === 'undefined') return null
  
  const token = localStorage.getItem('auth_token')
  if (!token) return null

  try {
    const decoded = jwtDecode(token) as any
    return {
      token,
      user: {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        avatar: decoded.avatar
      },
      organization: decoded.organization
    }
  } catch {
    return null
  }
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('auth_token', token)
}

export function removeStoredToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('auth_token')
}

export function isAuthenticated(): boolean {
  return getStoredToken() !== null
}
