'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminShell } from '@/components/AdminShell'
import { getAdminToken } from '@/lib/auth'
import { adminFetch } from '@/lib/api'

type AppItem = {
  id: string
  name: string
  slug: string
  category: string
  version: string
  isActive: boolean
  isPublic: boolean
  developer: string
  createdAt: string
}

type AppsResponse = {
  items: AppItem[]
  total: number
  limit: number
  offset: number
}

export default function AdminAppsPage() {
  const router = useRouter()
  const [data, setData] = useState<AppsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!getAdminToken()) {
      router.push('/login')
      return
    }

    adminFetch<AppsResponse>('/api/admin/apps?limit=50&offset=0')
      .then((res) => {
        if (!res.success) {
          setError(res.error?.message || 'Failed to load apps')
          return
        }
        setData(res.data || null)
      })
      .catch(() => setError('Failed to load apps'))
  }, [router])

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Apps</h1>
      </div>

      {error ? <div className="card p-4 border-red-200 text-red-700">{error}</div> : null}

      <div className="card overflow-hidden">
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-secondary-50 text-secondary-700">
              <tr>
                <th className="text-left font-medium px-4 py-3">Name</th>
                <th className="text-left font-medium px-4 py-3">Category</th>
                <th className="text-left font-medium px-4 py-3">Version</th>
                <th className="text-left font-medium px-4 py-3">Active</th>
                <th className="text-left font-medium px-4 py-3">Public</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200">
              {(data?.items || []).map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3">{a.name}</td>
                  <td className="px-4 py-3">{a.category}</td>
                  <td className="px-4 py-3">{a.version}</td>
                  <td className="px-4 py-3">{a.isActive ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">{a.isPublic ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
