import { Router } from 'express'
import { prisma } from '../config/database'
import { asyncHandler } from '../middleware/errorHandler'
import { OrganizationRequest } from '../middleware/organization'

const router = Router()

// Get organization invoices
router.get('/invoices', asyncHandler(async (req: OrganizationRequest, res) => {
  const organizationId = req.organization!.id
  const { page = 1, limit = 20 } = req.query as any

  const skip = (Number(page) - 1) * Number(limit)

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where: { organizationId },
      include: {
        subscription: {
          select: {
            plan: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.invoice.count({
      where: { organizationId },
    }),
  ])

  res.json({
    success: true,
    data: {
      invoices,
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

export default router
