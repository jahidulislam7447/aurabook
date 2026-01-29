import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { prisma } from '../config/database'
import { asyncHandler, createError } from '../middleware/errorHandler'
import { AuthenticatedRequest } from '../middleware/auth'

const router = Router()

// Get user's organizations
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id

  const organizations = await prisma.organization.findMany({
    where: {
      userRoles: {
        some: {
          userId: userId,
          status: 'active',
        },
      },
    },
    include: {
      userRoles: {
        where: {
          userId: userId,
        },
        select: {
          role: {
            select: {
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          userRoles: true,
        },
      },
    },
  })

  res.json({
    success: true,
    data: { organizations },
  })
}))

// Create organization
router.post('/',
  [
    body('name').trim().isLength({ min: 1, max: 100 }),
    body('type').isIn(['business', 'enterprise', 'agency']),
    body('slug').optional().trim().isLength({ min: 1, max: 50 }).matches(/^[a-z0-9-]+$/),
  ],
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors.array(),
        },
      })
    }

    const { name, type, slug } = req.body
    const userId = req.user!.id

    // Generate slug if not provided
    let organizationSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    
    // Ensure slug is unique
    let uniqueSlug = organizationSlug
    let counter = 1
    while (await prisma.organization.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${organizationSlug}-${counter}`
      counter++
    }

    // Create organization
    const organization = await prisma.organization.create({
      data: {
        name,
        slug: uniqueSlug,
        type,
        ownerId: userId,
        userRoles: {
          create: {
            userId: userId,
            roleId: 'owner-role-id', // TODO: Get or create owner role
          },
        },
      },
    })

    res.status(201).json({
      success: true,
      data: { organization },
    })
  })
)

export default router
