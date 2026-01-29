'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setAdminToken } from '@/lib/auth'

export default function AdminLoginPage() {
  const router = useRouter()
  const [token, setToken] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!token.trim()) return
    setAdminToken(token.trim())
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card w-full max-w-md p-6">
        <h1 className="text-xl font-semibold">Super Admin Login</h1>
        <p className="text-sm text-secondary-600 mt-1">
          Paste a valid JWT access token (from `/api/auth/login`) for a user whose email is in `SUPER_ADMIN_EMAILS`.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Access Token</label>
            <textarea
              className="input mt-2 h-28"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Bearer token (paste only the token string)"
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}
