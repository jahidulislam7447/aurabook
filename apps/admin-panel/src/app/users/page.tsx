'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminShell } from '@/components/AdminShell'
import { getAdminToken } from '@/lib/auth'
import { adminFetch } from '@/lib/api'

type UserItem = {
  id: string
  email: string
  firstName: string
  lastName: string
  emailVerified: boolean
  twoFactorEnabled: boolean
  lastLoginAt: string | null
  createdAt: string
}

type UsersResponse = {
  items: UserItem[]
  total: number
  limit: number
  offset: number
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [data, setData] = useState<UsersResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!getAdminToken()) {
      router.push('/login')
      return
    }

    adminFetch<UsersResponse>('/api/admin/users?limit=50&offset=0')
      .then((res) => {
        if (!res.success) {
          setError(res.error?.message || 'Failed to load users')
          return
        }
        setData(res.data || null)
      })
      .catch(() => setError('Failed to load users'))
  }, [router])

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Users</h1>
      </div>

      {error ? <div className="card p-4 border-red-200 text-red-700">{error}</div> : null}

      <div className="card overflow-hidden">
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-secondary-50 text-secondary-700">
              <tr>
                <th className="text-left font-medium px-4 py-3">Name</th>
                <th className="text-left font-medium px-4 py-3">Email</th>
                <th className="text-left font-medium px-4 py-3">Verified</th>
                <th className="text-left font-medium px-4 py-3">2FA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200">
              {(data?.items || []).map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">{u.firstName} {u.lastName}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.emailVerified ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">{u.twoFactorEnabled ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
