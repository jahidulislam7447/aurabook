import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

import { logger } from './config/logger'
import { connectDatabase, disconnectDatabase } from './config/database'
import { connectRedis, disconnectRedis } from './config/redis'
import { errorHandler } from './middleware/errorHandler'
import { authMiddleware } from './middleware/auth'
import { organizationMiddleware } from './middleware/organization'
import { requireSuperAdmin } from './middleware/superAdmin'

// Routes
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import organizationRoutes from './routes/organizations'
import subscriptionRoutes from './routes/subscriptions'
import billingRoutes from './routes/billing'
import appRoutes from './routes/apps'
import notificationRoutes from './routes/notifications'
import analyticsRoutes from './routes/analytics'
import adminRoutes from './routes/admin'
import dashboardRoutes from './routes/dashboard'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))

app.use(compression())
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(limiter)

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', authMiddleware, userRoutes)
app.use('/api/organizations', authMiddleware, organizationRoutes)
app.use('/api/subscriptions', authMiddleware, organizationMiddleware, subscriptionRoutes)
app.use('/api/billing', authMiddleware, organizationMiddleware, billingRoutes)
app.use('/api/apps', authMiddleware, organizationMiddleware, appRoutes)
app.use('/api/notifications', authMiddleware, notificationRoutes)
app.use('/api/analytics', authMiddleware, organizationMiddleware, analyticsRoutes)
app.use('/api/admin', authMiddleware, requireSuperAdmin, adminRoutes)
app.use('/api/dashboard', dashboardRoutes)

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

// Error handling middleware (must be last)
app.use(errorHandler)

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully')
  await disconnectDatabase()
  await disconnectRedis()
  process.exit(0)
})

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully')
  await disconnectDatabase()
  await disconnectRedis()
  process.exit(0)
})

// Start server
async function startServer() {
  try {
    await connectDatabase()
    await connectRedis()
    
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
      logger.info(`Health check: http://localhost:${PORT}/health`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer().catch((error) => {
  logger.error('Server startup failed:', error)
  process.exit(1)
})
