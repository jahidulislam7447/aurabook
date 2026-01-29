'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import { 
  Store, 
  Users, 
  Star, 
  CheckCircle, 
  Plus,
  ExternalLink,
  Settings
} from 'lucide-react'

interface App {
  id: string
  name: string
  description: string
  category: string
  icon: string
  version: string
  status: 'installed' | 'available' | 'disabled'
  users?: number
  rating?: number
  pricing: {
    type: 'free' | 'paid' | 'trial'
    price?: number
  }
}

interface AppCategory {
  name: string
  apps: App[]
}

export default function AppsPage() {
  const [apps, setApps] = useState<AppCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchApps()
  }, [])

  const fetchApps = async () => {
    try {
      const data = await apiClient.get<AppCategory[]>('/dashboard/apps')
      setApps(data)
    } catch (error) {
      console.error('Failed to fetch apps:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInstallApp = async (appId: string) => {
    try {
      await apiClient.post(`/dashboard/apps/${appId}/install`)
      fetchApps() // Refresh apps list
    } catch (error) {
      console.error('Failed to install app:', error)
    }
  }

  const handleUninstallApp = async (appId: string) => {
    try {
      await apiClient.delete(`/dashboard/apps/${appId}/install`)
      fetchApps() // Refresh apps list
    } catch (error) {
      console.error('Failed to uninstall app:', error)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  const allApps = apps.flatMap(category => category.apps)
  const filteredApps = selectedCategory === 'all' 
    ? allApps 
    : apps.find(cat => cat.name === selectedCategory)?.apps || []

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">App Marketplace</h1>
        <p className="mt-1 text-sm text-gray-500">
          Discover and install business applications for your organization
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            All Apps
          </button>
          {apps.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                selectedCategory === category.name
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredApps.map((app) => (
          <div key={app.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* App Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Store className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{app.name}</h3>
                    <p className="text-sm text-gray-500">{app.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {app.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{app.rating}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* App Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {app.description}
              </p>

              {/* App Info */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>v{app.version}</span>
                {app.users && (
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{app.users} users</span>
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-sm font-medium ${
                  app.pricing.type === 'free' ? 'text-green-600' : 
                  app.pricing.type === 'trial' ? 'text-blue-600' : 
                  'text-gray-900'
                }`}>
                  {app.pricing.type === 'free' ? 'Free' : 
                   app.pricing.type === 'trial' ? 'Free Trial' : 
                   `$${app.pricing.price}/mo`}
                </span>
                {app.status === 'installed' && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                {app.status === 'installed' ? (
                  <>
                    <button className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </button>
                    <button 
                      onClick={() => handleUninstallApp(app.id)}
                      className="flex-1 px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                    >
                      Uninstall
                    </button>
                  </>
                ) : (
                  <>
                    <button className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Details
                    </button>
                    <button 
                      onClick={() => handleInstallApp(app.id)}
                      className="flex-1 flex items-center justify-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Install
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredApps.length === 0 && (
        <div className="text-center py-12">
          <Store className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No apps found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try selecting a different category or check back later for new apps.
          </p>
        </div>
      )}
    </div>
  )
}
