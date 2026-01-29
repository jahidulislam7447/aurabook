import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const app = express()
const PORT = process.env.PORT || 3005
const JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production'

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:3003'],
  credentials: true,
}))
app.use(express.json())

// Mock user data
const SUPER_ADMIN_EMAILS = "admin@auratechit.com,demo@auratechit.com"
const mockUsers = [
  {
    id: '1',
    email: 'demo@auratechit.com',
    password: '$2a$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQj', // demo123456
    firstName: 'Demo',
    lastName: 'User',
    emailVerified: true,
    twoFactorEnabled: false,
    organizationId: '1',
    role: 'admin'
  }
]

const mockOrganizations = [
  {
    id: '1',
    name: 'Demo Organization',
    slug: 'demo-org',
    plan: 'pro',
    status: 'active',
    createdAt: new Date().toISOString()
  }
]

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  })
})

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = mockUsers.find(u => u.email === email)
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      })
    }

    // Check password (for demo, accept demo123456)
    const isPasswordValid = password === 'demo123456'
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        organizationId: user.organizationId 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Get organization
    const organization = mockOrganizations.find(org => org.id === user.organizationId)

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.emailVerified,
          twoFactorEnabled: user.twoFactorEnabled,
        },
        organization,
        token,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    })
  }
})

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'User with this email already exists',
        },
      })
    }

    // Create new user (mock)
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      email,
      password: '$2a$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQj', // demo123456
      firstName,
      lastName,
      emailVerified: false,
      twoFactorEnabled: false,
      organizationId: '1',
      role: 'user'
    }

    mockUsers.push(newUser)

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email, 
        organizationId: newUser.organizationId 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const organization = mockOrganizations.find(org => org.id === newUser.organizationId)

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          emailVerified: newUser.emailVerified,
          twoFactorEnabled: newUser.twoFactorEnabled,
        },
        organization,
        token,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    })
  }
})

app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Logged out successfully',
    },
  })
})

app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'NO_TOKEN',
        message: 'No token provided',
      },
    })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    const user = mockUsers.find(u => u.id === decoded.userId)
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid token',
        },
      })
    }

    const organization = mockOrganizations.find(org => org.id === user.organizationId)

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.emailVerified,
          twoFactorEnabled: user.twoFactorEnabled,
        },
        organization,
      },
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid token',
      },
    })
  }
})

// Dashboard data
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalUsers: 30,
      activeUsers: 25,
      totalRevenue: 1500,
      monthlyGrowth: 12.5,
      activeApps: 3,
      totalApps: 5,
      recentActivity: [
        { id: 1, type: 'user_signup', message: 'New user registered', timestamp: new Date().toISOString() },
        { id: 2, type: 'subscription', message: 'New subscription activated', timestamp: new Date().toISOString() },
        { id: 3, type: 'app_installed', message: 'AuraHR app installed', timestamp: new Date().toISOString() }
      ]
    }
  })
})

// Dashboard activities endpoint
app.get('/api/dashboard/activities', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        type: 'user_added',
        description: 'New user john.doe@example.com joined the platform',
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        type: 'app_installed',
        description: 'AuraCRM app was installed',
        timestamp: new Date().toISOString()
      },
      {
        id: '3',
        type: 'payment_received',
        description: 'Monthly subscription payment received',
        timestamp: new Date().toISOString()
      }
    ]
  })
})

// App marketplace endpoints
app.get('/api/apps', (req, res) => {
  res.json({
    success: true,
    data: {
      apps: [
        {
          id: '1',
          name: 'AuraCRM',
          slug: 'auracrm',
          description: 'Complete customer relationship management system with sales pipeline, contact management, and analytics.',
          category: 'Business',
          status: 'active',
          icon: 'target',
          version: '1.0.0',
          developer: 'AuraTechIT',
          rating: 4.8,
          reviews: 156,
          installs: 2500,
          pricing: {
            starter: { price: 29, features: ['Basic CRM', '100 contacts', 'Email support'] },
            pro: { price: 79, features: ['Advanced CRM', 'Unlimited contacts', 'Priority support', 'API access'] },
            enterprise: { price: 199, features: ['Full CRM suite', 'Custom integrations', 'Dedicated support', 'SLA'] }
          },
          features: ['Lead Management', 'Deal Tracking', 'Contact Management', 'Sales Analytics', 'Email Integration'],
          screenshots: ['/api/screenshots/auracrm-1.png', '/api/screenshots/auracrm-2.png'],
          isActive: true,
          isInstalled: true,
          installedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'AuraPOS',
          slug: 'aurapos',
          description: 'Modern point-of-sale system with inventory management, payment processing, and sales analytics.',
          category: 'Business',
          status: 'active',
          icon: 'shopping-cart',
          version: '1.0.0',
          developer: 'AuraTechIT',
          rating: 4.6,
          reviews: 89,
          installs: 1800,
          pricing: {
            starter: { price: 49, features: ['Basic POS', '1 register', 'Email support'] },
            pro: { price: 99, features: ['Advanced POS', 'Multiple registers', 'Inventory management', 'Priority support'] },
            enterprise: { price: 249, features: ['Full POS suite', 'Unlimited registers', 'Advanced analytics', 'Dedicated support'] }
          },
          features: ['Sales Processing', 'Inventory Management', 'Payment Integration', 'Receipt Management', 'Sales Analytics'],
          screenshots: ['/api/screenshots/aurapos-1.png', '/api/screenshots/aurapos-2.png'],
          isActive: true,
          isInstalled: true,
          installedAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'AuraHR',
          slug: 'aurahr',
          description: 'Comprehensive human resources management system with employee management, payroll, and attendance tracking.',
          category: 'Business',
          status: 'active',
          icon: 'user-check',
          version: '1.0.0',
          developer: 'AuraTechIT',
          rating: 4.7,
          reviews: 124,
          installs: 2100,
          pricing: {
            starter: { price: 39, features: ['Basic HR', '10 employees', 'Email support'] },
            pro: { price: 89, features: ['Advanced HR', 'Unlimited employees', 'Payroll processing', 'Priority support'] },
            enterprise: { price: 229, features: ['Full HR suite', 'Custom workflows', 'Advanced analytics', 'Dedicated support'] }
          },
          features: ['Employee Management', 'Payroll Processing', 'Attendance Tracking', 'Leave Management', 'Performance Reviews'],
          screenshots: ['/api/screenshots/aurahr-1.png', '/api/screenshots/aurahr-2.png'],
          isActive: true,
          isInstalled: true,
          installedAt: new Date().toISOString()
        },
        {
          id: '4',
          name: 'AuraERP',
          slug: 'auraerp',
          description: 'Enterprise resource planning system with inventory, supply chain, and manufacturing management.',
          category: 'Business',
          status: 'active',
          icon: 'package',
          version: '1.0.0',
          developer: 'AuraTechIT',
          rating: 4.5,
          reviews: 67,
          installs: 950,
          pricing: {
            starter: { price: 99, features: ['Basic ERP', '5 users', 'Email support'] },
            pro: { price: 199, features: ['Advanced ERP', '25 users', 'Full inventory', 'Priority support'] },
            enterprise: { price: 499, features: ['Full ERP suite', 'Unlimited users', 'Custom modules', 'Dedicated support'] }
          },
          features: ['Inventory Management', 'Supply Chain', 'Manufacturing', 'Quality Control', 'Reporting'],
          screenshots: ['/api/screenshots/auraerp-1.png', '/api/screenshots/auraerp-2.png'],
          isActive: true,
          isInstalled: false,
          installedAt: null
        },
        {
          id: '5',
          name: 'AuraBooks',
          slug: 'aurabooks',
          description: 'Professional accounting and bookkeeping system with double-entry accounting and financial reporting.',
          category: 'Finance',
          status: 'active',
          icon: 'file-text',
          version: '1.0.0',
          developer: 'AuraTechIT',
          rating: 4.9,
          reviews: 203,
          installs: 3200,
          pricing: {
            starter: { price: 19, features: ['Basic accounting', '50 transactions/month', 'Email support'] },
            pro: { price: 59, features: ['Advanced accounting', 'Unlimited transactions', 'Tax management', 'Priority support'] },
            enterprise: { price: 149, features: ['Full accounting suite', 'Multi-company', 'Advanced reporting', 'Dedicated support'] }
          },
          features: ['Double Entry Accounting', 'Financial Reporting', 'Tax Management', 'Invoicing', 'Bank Reconciliation'],
          screenshots: ['/api/screenshots/aurabooks-1.png', '/api/screenshots/aurabooks-2.png'],
          isActive: true,
          isInstalled: false,
          installedAt: null
        }
      ],
      categories: [
        { id: 'business', name: 'Business', count: 4 },
        { id: 'finance', name: 'Finance', count: 1 }
      ],
      total: 5,
      page: 1,
      totalPages: 1
    }
  })
})

// Get installed apps for user
app.get('/api/apps/installed', (req, res) => {
  res.json({
    success: true,
    data: {
      installedApps: [
        {
          id: '1',
          name: 'AuraCRM',
          slug: 'auracrm',
          icon: 'target',
          version: '1.0.0',
          installedAt: new Date().toISOString(),
          lastUsed: new Date().toISOString()
        },
        {
          id: '2',
          name: 'AuraPOS',
          slug: 'aurapos',
          icon: 'shopping-cart',
          version: '1.0.0',
          installedAt: new Date().toISOString(),
          lastUsed: new Date().toISOString()
        },
        {
          id: '3',
          name: 'AuraHR',
          slug: 'aurahr',
          icon: 'user-check',
          version: '1.0.0',
          installedAt: new Date().toISOString(),
          lastUsed: new Date().toISOString()
        }
      ],
      total: 3
    }
  })
})

app.post('/api/apps/:id/install', (req, res) => {
  const { id } = req.params
  res.json({
    success: true,
    data: {
      message: `App ${id} installed successfully`,
      installedAt: new Date().toISOString()
    }
  })
})

app.post('/api/apps/:id/uninstall', (req, res) => {
  const { id } = req.params
  res.json({
    success: true,
    data: {
      message: `App ${id} uninstalled successfully`,
      uninstalledAt: new Date().toISOString()
    }
  })
})

// Admin endpoints
app.get('/api/admin/organizations', (req, res) => {
  res.json({
    success: true,
    data: {
      organizations: [
        {
          id: '1',
          name: 'Demo Organization',
          slug: 'demo-org',
          plan: 'pro',
          status: 'active',
          createdAt: new Date().toISOString(),
          userCount: 25,
          subscriptionStatus: 'active'
        },
        {
          id: '2',
          name: 'Test Company',
          slug: 'test-company',
          plan: 'starter',
          status: 'active',
          createdAt: new Date().toISOString(),
          userCount: 5,
          subscriptionStatus: 'active'
        }
      ],
      total: 2,
      page: 1,
      totalPages: 1
    }
  })
})

app.get('/api/admin/users', (req, res) => {
  res.json({
    success: true,
    data: {
      users: [
        {
          id: '1',
          email: 'demo@auratechit.com',
          firstName: 'Demo',
          lastName: 'User',
          emailVerified: true,
          twoFactorEnabled: false,
          organizationId: '1',
          organizationName: 'Demo Organization',
          role: 'admin',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        },
        {
          id: '2',
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          emailVerified: true,
          twoFactorEnabled: false,
          organizationId: '1',
          organizationName: 'Demo Organization',
          role: 'user',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        }
      ],
      total: 2,
      page: 1,
      totalPages: 1
    }
  })
})

app.get('/api/admin/analytics', (req, res) => {
  res.json({
    success: true,
    data: {
      totalOrganizations: 2,
      totalUsers: 30,
      activeSubscriptions: 2,
      monthlyRevenue: 1500,
      userGrowth: [
        { month: 'Jan', users: 25 },
        { month: 'Feb', users: 28 },
        { month: 'Mar', users: 30 }
      ],
      revenueGrowth: [
        { month: 'Jan', revenue: 1200 },
        { month: 'Feb', revenue: 1350 },
        { month: 'Mar', revenue: 1500 }
      ],
      topPlans: [
        { plan: 'Pro', count: 1 },
        { plan: 'Starter', count: 1 }
      ]
    }
  })
})

app.get('/api/admin/apps', (req, res) => {
  res.json({
    success: true,
    data: {
      apps: [
        {
          id: '1',
          name: 'AuraCRM',
          slug: 'auracrm',
          description: 'Customer Relationship Management',
          category: 'Business',
          status: 'active',
          icon: 'target',
          installs: 2,
          rating: 4.8,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'AuraPOS',
          slug: 'aurapos',
          description: 'Point of Sale System',
          category: 'Business',
          status: 'active',
          icon: 'shopping-cart',
          installs: 1,
          rating: 4.6,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'AuraHR',
          slug: 'aurahr',
          description: 'Human Resources Management',
          category: 'Business',
          status: 'active',
          icon: 'user-check',
          installs: 1,
          rating: 4.7,
          createdAt: new Date().toISOString()
        }
      ],
      total: 3,
      page: 1,
      totalPages: 1
    }
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
    },
  })
})

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    },
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Mock API server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`)
})
