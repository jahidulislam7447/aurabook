'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminShell } from '@/components/AdminShell'
import { getAdminToken } from '@/lib/auth'
import { adminFetch } from '@/lib/api'

type OrganizationItem = {
  id: string
  name: string
  slug: string
  type: string
  plan: string
  status: string
  createdAt: string
  owner: { id: string; email: string; firstName: string; lastName: string }
}

type OrgsResponse = {
  items: OrganizationItem[]
  total: number
  limit: number
  offset: number
}

export default function AdminOrganizationsPage() {
  const router = useRouter()
  const [data, setData] = useState<OrgsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!getAdminToken()) {
      router.push('/login')
      return
    }

    adminFetch<OrgsResponse>('/api/admin/organizations?limit=50&offset=0')
      .then((res) => {
        if (!res.success) {
          setError(res.error?.message || 'Failed to load organizations')
          return
        }
        setData(res.data || null)
      })
      .catch(() => setError('Failed to load organizations'))
  }, [router])

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Organizations</h1>
      </div>

      {error ? <div className="card p-4 border-red-200 text-red-700">{error}</div> : null}

      <div className="card overflow-hidden">
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-secondary-50 text-secondary-700">
              <tr>
                <th className="text-left font-medium px-4 py-3">Name</th>
                <th className="text-left font-medium px-4 py-3">Slug</th>
                <th className="text-left font-medium px-4 py-3">Owner</th>
                <th className="text-left font-medium px-4 py-3">Plan</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200">
              {(data?.items || []).map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-3">{o.name}</td>
                  <td className="px-4 py-3">{o.slug}</td>
                  <td className="px-4 py-3">{o.owner.email}</td>
                  <td className="px-4 py-3">{o.plan}</td>
                  <td className="px-4 py-3">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
