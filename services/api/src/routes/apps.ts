import { Router } from 'express'
import { prisma } from '../config/database'
import { asyncHandler } from '../middleware/errorHandler'
import { OrganizationRequest } from '../middleware/organization'

const router = Router()

// Get available apps
router.get('/marketplace', asyncHandler(async (req, res) => {
  const { category, search } = req.query as any

  const where: any = { isActive: true, isPublic: true }
  
  if (category) {
    where.category = category
  }
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { shortDescription: { contains: search, mode: 'insensitive' } },
    ]
  }

  const apps = await prisma.app.findMany({
    where,
    orderBy: { name: 'asc' },
  })

  res.json({
    success: true,
    data: { apps },
  })
}))

// Get organization's installed apps
router.get('/installed', asyncHandler(async (req: OrganizationRequest, res) => {
  const organizationId = req.organization!.id

  const organizationApps = await prisma.organizationApp.findMany({
    where: { organizationId },
    include: {
      app: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json({
    success: true,
    data: { organizationApps },
  })
}))

export default router
