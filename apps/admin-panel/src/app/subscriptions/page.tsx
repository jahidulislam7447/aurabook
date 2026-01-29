'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminShell } from '@/components/AdminShell'
import { getAdminToken } from '@/lib/auth'
import { adminFetch } from '@/lib/api'

type SubscriptionItem = {
  id: string
  status: string
  currentPeriodStart: string
  currentPeriodEnd: string
  trialEnd: string | null
  cancelAtPeriodEnd: boolean
  stripeSubscriptionId: string | null
  createdAt: string
  organization: { id: string; name: string; slug: string }
  plan: { id: string; name: string; price: string; currency: string; interval: string }
}

type SubsResponse = {
  items: SubscriptionItem[]
  total: number
  limit: number
  offset: number
}

export default function AdminSubscriptionsPage() {
  const router = useRouter()
  const [data, setData] = useState<SubsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!getAdminToken()) {
      router.push('/login')
      return
    }

    adminFetch<SubsResponse>('/api/admin/subscriptions?limit=50&offset=0')
      .then((res) => {
        if (!res.success) {
          setError(res.error?.message || 'Failed to load subscriptions')
          return
        }
        setData(res.data || null)
      })
      .catch(() => setError('Failed to load subscriptions'))
  }, [router])

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Subscriptions</h1>
      </div>

      {error ? <div className="card p-4 border-red-200 text-red-700">{error}</div> : null}

      <div className="card overflow-hidden">
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-secondary-50 text-secondary-700">
              <tr>
                <th className="text-left font-medium px-4 py-3">Organization</th>
                <th className="text-left font-medium px-4 py-3">Plan</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-left font-medium px-4 py-3">Period End</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200">
              {(data?.items || []).map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3">{s.organization.name}</td>
                  <td className="px-4 py-3">{s.plan.name}</td>
                  <td className="px-4 py-3">{s.status}</td>
                  <td className="px-4 py-3">{new Date(s.currentPeriodEnd).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
