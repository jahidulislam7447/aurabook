import { Router } from 'express'
import { prisma } from '../config/database'
import { asyncHandler } from '../middleware/errorHandler'
import { OrganizationRequest } from '../middleware/organization'

const router = Router()

// Get organization analytics
router.get('/overview', asyncHandler(async (req: OrganizationRequest, res) => {
  const organizationId = req.organization!.id
  const { period = '30d' } = req.query as any

  // Calculate date range
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  // Get analytics data
  const [
    totalEvents,
    activeUsers,
    appUsage,
    usageMetrics,
  ] = await Promise.all([
    prisma.analyticsEvent.count({
      where: {
        organizationId,
        timestamp: { gte: startDate },
      },
    }),
    prisma.analyticsEvent.findMany({
      where: {
        organizationId,
        timestamp: { gte: startDate },
      },
      select: { userId: true },
      distinct: ['userId'],
    }).then(users => users.length),
    prisma.analyticsEvent.groupBy({
      by: ['event'],
      where: {
        organizationId,
        timestamp: { gte: startDate },
      },
      _count: true,
      orderBy: { _count: { event: 'desc' } },
      take: 10,
    }),
    prisma.usageMetrics.findMany({
      where: {
        organizationId,
        timestamp: { gte: startDate },
      },
      orderBy: { timestamp: 'desc' },
      take: days,
    }),
  ])

  res.json({
    success: true,
    data: {
      overview: {
        totalEvents,
        activeUsers,
        period,
      },
      appUsage,
      usageMetrics,
    },
  })
}))

export default router
