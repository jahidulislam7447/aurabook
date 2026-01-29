import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import { organizationMiddleware, OrganizationRequest } from '../middleware/organization'
import { prisma } from '../config/database'

const router = Router()

// Apply auth and organization middleware to all dashboard routes
router.use(authMiddleware)
router.use(organizationMiddleware)

// Get dashboard statistics
router.get('/stats', async (req: OrganizationRequest, res) => {
  try {
    const organizationId = req.organization?.id

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization not found' })
    }

    // Get user count
    const totalUsers = await prisma.userRole.count({
      where: { organizationId }
    })

    // Get active apps count
    const activeApps = await prisma.organizationApp.count({
      where: { 
        organizationId,
        status: 'active'
      }
    })

    // Get monthly revenue (mock data for now)
    const monthlyRevenue = 2999

    // Get API calls (mock data for now)
    const apiCalls = 45678

    // Calculate growth rates (mock data for now)
    const userGrowth = 12.5
    const revenueGrowth = 8.3

    res.json({
      totalUsers,
      activeApps,
      monthlyRevenue,
      apiCalls,
      userGrowth,
      revenueGrowth
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    res.status(500).json({ error: 'Failed to fetch dashboard stats' })
  }
})

// Get recent activities
router.get('/activities', async (req: OrganizationRequest, res) => {
  try {
    const organizationId = req.organization?.id

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization not found' })
    }

    // Get recent user roles (invitations/new users)
    const recentUserRoles = await prisma.userRole.findMany({
      where: { organizationId },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true }
        }
      },
      orderBy: { joinedAt: 'desc' },
      take: 5
    })

    // Get recent organization apps
    const recentApps = await prisma.organizationApp.findMany({
      where: { organizationId },
      include: {
        app: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 3
    })

    // Combine and format activities
    const activities = [
      ...recentUserRoles.map(role => ({
        id: `user-${role.id}`,
        type: 'user_added' as const,
        description: `${role.user.firstName} ${role.user.lastName} joined the organization`,
        timestamp: role.joinedAt.toISOString()
      })),
      ...recentApps.map(orgApp => ({
        id: `app-${orgApp.id}`,
        type: 'app_installed' as const,
        description: `${orgApp.app?.name || 'Unknown app'} app was installed`,
        timestamp: orgApp.createdAt.toISOString()
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
     .slice(0, 10)

    res.json(activities)
  } catch (error) {
    console.error('Dashboard activities error:', error)
    res.status(500).json({ error: 'Failed to fetch activities' })
  }
})

// Get available apps for organization
router.get('/apps', async (req: OrganizationRequest, res) => {
  try {
    const organizationId = req.organization?.id

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization not found' })
    }

    // Get all apps
    const apps = await prisma.app.findMany({
      where: { isActive: true },
      include: {
        organizationApps: {
          where: { organizationId }
        }
      }
    })

    // Group by category
    const appsByCategory = apps.reduce((acc, app) => {
      const categoryName = app.category
      
      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          apps: []
        }
      }

      const isInstalled = app.organizationApps.length > 0
      const status = isInstalled ? 'installed' : 'available'

      // Extract pricing info from JSON
      const pricing = app.pricing as any
      const pricingType = pricing?.type || 'free'
      const pricingPrice = pricing?.price

      acc[categoryName].apps.push({
        id: app.id,
        name: app.name,
        description: app.description,
        category: app.category,
        icon: app.logo,
        version: app.version,
        status,
        users: Math.floor(Math.random() * 10000), // Mock data
        rating: 4.5, // Mock data
        pricing: {
          type: pricingType.toLowerCase() as 'free' | 'paid' | 'trial',
          price: pricingPrice || undefined
        }
      })

      return acc
    }, {} as Record<string, any>)

    res.json(Object.values(appsByCategory))
  } catch (error) {
    console.error('Dashboard apps error:', error)
    res.status(500).json({ error: 'Failed to fetch apps' })
  }
})

// Install an app
router.post('/apps/:appId/install', async (req: OrganizationRequest, res) => {
  try {
    const { appId } = req.params
    const organizationId = req.organization?.id

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization not found' })
    }

    // Check if app exists
    const app = await prisma.app.findUnique({
      where: { id: appId }
    })

    if (!app) {
      return res.status(404).json({ error: 'App not found' })
    }

    // Check if already installed
    const existingInstallation = await prisma.organizationApp.findFirst({
      where: {
        organizationId,
        appId
      }
    })

    if (existingInstallation) {
      return res.status(400).json({ error: 'App already installed' })
    }

    // Install the app
    await prisma.organizationApp.create({
      data: {
        organizationId,
        appId,
        status: 'active',
        settings: {},
        enabledAt: new Date()
      }
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Install app error:', error)
    res.status(500).json({ error: 'Failed to install app' })
  }
})

// Uninstall an app
router.delete('/apps/:appId/install', async (req: OrganizationRequest, res) => {
  try {
    const { appId } = req.params
    const organizationId = req.organization?.id

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization not found' })
    }

    // Find and delete the installation
    const installation = await prisma.organizationApp.findFirst({
      where: {
        organizationId,
        appId
      }
    })

    if (!installation) {
      return res.status(404).json({ error: 'App not installed' })
    }

    await prisma.organizationApp.delete({
      where: { id: installation.id }
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Uninstall app error:', error)
    res.status(500).json({ error: 'Failed to uninstall app' })
  }
})

export default router
