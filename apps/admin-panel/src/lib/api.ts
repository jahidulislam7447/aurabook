import { getAdminToken } from './auth'

export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: { code: string; message: string }
  message?: string
}

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
}

export async function adminFetch<T>(path: string): Promise<ApiResponse<T>> {
  const token = getAdminToken()
  const res = await fetch(`${getBaseUrl()}${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  })

  return res.json()
}
