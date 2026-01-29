import { Router } from 'express'
import { prisma } from '../config/database'
import { asyncHandler } from '../middleware/errorHandler'
import { AuthenticatedRequest } from '../middleware/auth'

const router = Router()

// Get user notifications
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id
  const { page = 1, limit = 20, unreadOnly = false } = req.query as any

  const skip = (Number(page) - 1) * Number(limit)

  const where: any = { userId }
  if (unreadOnly === 'true') {
    where.readAt = null
  }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.notification.count({ where }),
  ])

  res.json({
    success: true,
    data: {
      notifications,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
        hasNext: Number(page) < Math.ceil(total / Number(limit)),
        hasPrev: Number(page) > 1,
      },
    },
  })
}))

// Mark notification as read
router.put('/:id/read', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params
  const userId = req.user!.id

  const notification = await prisma.notification.updateMany({
    where: {
      id,
      userId,
      readAt: null,
    },
    data: { readAt: new Date() },
  })

  res.json({
    success: true,
    data: { updated: notification.count },
  })
}))

// Mark all notifications as read
router.put('/read-all', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id

  const result = await prisma.notification.updateMany({
    where: {
      userId,
      readAt: null,
    },
    data: { readAt: new Date() },
  })

  res.json({
    success: true,
    data: { updated: result.count },
  })
}))

export default router
