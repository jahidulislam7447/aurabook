'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminShell } from '@/components/AdminShell'
import { getAdminToken } from '@/lib/auth'
import { adminFetch } from '@/lib/api'

type Overview = {
  users: number
  organizations: number
  activeOrganizations: number
  subscriptions: number
  activeSubscriptions: number
  apps: number
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="card p-5">
      <div className="text-sm text-secondary-600">{title}</div>
      <div className="mt-2 text-3xl font-semibold text-secondary-900">{value}</div>
    </div>
  )
}

export default function AdminOverviewPage() {
  const router = useRouter()
  const [data, setData] = useState<Overview | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = getAdminToken()
    if (!token) {
      router.push('/login')
      return
    }

    adminFetch<Overview>('/api/admin/overview')
      .then((res) => {
        if (!res.success) {
          setError(res.error?.message || 'Failed to load overview')
          return
        }
        setData(res.data || null)
      })
      .catch(() => setError('Failed to load overview'))
  }, [router])

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Overview</h1>
      </div>

      {error ? (
        <div className="card p-4 border-red-200 text-red-700">{error}</div>
      ) : null}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Users" value={data?.users || 0} />
        <StatCard title="Organizations" value={data?.organizations || 0} />
        <StatCard title="Active Orgs" value={data?.activeOrganizations || 0} />
        <StatCard title="Subscriptions" value={data?.subscriptions || 0} />
        <StatCard title="Active Subscriptions" value={data?.activeSubscriptions || 0} />
        <StatCard title="Apps" value={data?.apps || 0} />
      </div>
    </AdminShell>
  )
}
