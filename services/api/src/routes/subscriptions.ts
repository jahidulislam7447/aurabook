import { Router } from 'express'
import { prisma } from '../config/database'
import { asyncHandler } from '../middleware/errorHandler'
import { OrganizationRequest } from '../middleware/organization'

const router = Router()

// Get organization subscriptions
router.get('/', asyncHandler(async (req: OrganizationRequest, res) => {
  const organizationId = req.organization!.id

  const subscriptions = await prisma.subscription.findMany({
    where: { organizationId },
    include: {
      plan: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json({
    success: true,
    data: { subscriptions },
  })
}))

// Get available plans
router.get('/plans', asyncHandler(async (req, res) => {
  const plans = await prisma.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' },
  })

  res.json({
    success: true,
    data: { plans },
  })
}))

export default router
