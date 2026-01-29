'use client'

import { useEffect, useState } from 'react'
import { getStoredToken } from '@/lib/auth'
import { apiClient } from '@/lib/api'
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Activity,
  Store,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  activeApps: number
  monthlyRevenue: number
  apiCalls: number
  userGrowth: number
  revenueGrowth: number
}

interface RecentActivity {
  id: string
  type: 'user_added' | 'app_installed' | 'payment_received'
  description: string
  timestamp: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, activitiesData] = await Promise.all([
          apiClient.get<DashboardStats>('/dashboard/stats'),
          apiClient.get<RecentActivity[]>('/dashboard/activities')
        ])
        
        setStats(statsData)
        setActivities(activitiesData)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      change: stats?.userGrowth || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Apps',
      value: stats?.activeApps || 0,
      change: 0,
      icon: Store,
      color: 'bg-green-500',
    },
    {
      title: 'Monthly Revenue',
      value: `$${(stats?.monthlyRevenue || 0).toLocaleString()}`,
      change: stats?.revenueGrowth || 0,
      icon: CreditCard,
      color: 'bg-yellow-500',
    },
    {
      title: 'API Calls',
      value: (stats?.apiCalls || 0).toLocaleString(),
      change: 0,
      icon: Activity,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          const isPositive = stat.change > 0
          
          return (
            <div key={stat.title} className="bg-white overflow-hidden rounded-lg shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${stat.color} rounded-md p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.title}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        {stat.change !== 0 && (
                          <div
                            className={`ml-2 flex items-baseline text-sm font-semibold ${
                              isPositive ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {isPositive ? (
                              <ArrowUpRight className="h-4 w-4" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4" />
                            )}
                            {Math.abs(stat.change)}%
                          </div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {activities.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            ) : (
              <div className="flow-root">
                <ul className="-mb-8">
                  {activities.map((activity, index) => (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {index !== activities.length - 1 && (
                          <div
                            className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex items-start space-x-3">
                          <div className="relative">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                              <TrendingUp className="h-6 w-6 text-indigo-600" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm text-gray-500">
                              <span className="font-medium text-gray-900">
                                {activity.description}
                              </span>
                              <span className="ml-1">at {activity.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
            <Users className="h-8 w-8 text-blue-500 mb-3" />
            <h4 className="text-lg font-medium text-gray-900">Invite Team Members</h4>
            <p className="text-gray-500 text-sm mt-1">
              Add new users to your organization
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
            <Store className="h-8 w-8 text-green-500 mb-3" />
            <h4 className="text-lg font-medium text-gray-900">Browse Apps</h4>
            <p className="text-gray-500 text-sm mt-1">
              Discover and install new business apps
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
            <CreditCard className="h-8 w-8 text-yellow-500 mb-3" />
            <h4 className="text-lg font-medium text-gray-900">Manage Billing</h4>
            <p className="text-gray-500 text-sm mt-1">
              View invoices and update payment methods
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
