import { Router } from 'express'
import { prisma } from '../config/database'

const router = Router()

// Overview stats for super admin dashboard
router.get('/overview', async (_req, res) => {
  const [users, organizations, subscriptions, apps] = await Promise.all([
    prisma.user.count(),
    prisma.organization.count(),
    prisma.subscription.count(),
    prisma.app.count(),
  ])

  const activeOrganizations = await prisma.organization.count({
    where: { status: 'active' },
  })

  const activeSubscriptions = await prisma.subscription.count({
    where: { status: 'active' },
  })

  res.json({
    success: true,
    data: {
      users,
      organizations,
      activeOrganizations,
      subscriptions,
      activeSubscriptions,
      apps,
    },
  })
})

// Users list (basic)
router.get('/users', async (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 25), 100)
  const offset = Math.max(Number(req.query.offset ?? 0), 0)

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        emailVerified: true,
        twoFactorEnabled: true,
        lastLoginAt: true,
        createdAt: true,
      },
    }),
    prisma.user.count(),
  ])

  res.json({
    success: true,
    data: { items, total, limit, offset },
  })
})

// Organizations list
router.get('/organizations', async (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 25), 100)
  const offset = Math.max(Number(req.query.offset ?? 0), 0)

  const [items, total] = await Promise.all([
    prisma.organization.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        plan: true,
        status: true,
        createdAt: true,
        owner: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    }),
    prisma.organization.count(),
  ])

  res.json({
    success: true,
    data: { items, total, limit, offset },
  })
})

// Subscriptions list
router.get('/subscriptions', async (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 25), 100)
  const offset = Math.max(Number(req.query.offset ?? 0), 0)

  const [items, total] = await Promise.all([
    prisma.subscription.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        currentPeriodStart: true,
        currentPeriodEnd: true,
        trialEnd: true,
        cancelAtPeriodEnd: true,
        stripeSubscriptionId: true,
        createdAt: true,
        organization: {
          select: { id: true, name: true, slug: true },
        },
        plan: {
          select: { id: true, name: true, price: true, currency: true, interval: true },
        },
      },
    }),
    prisma.subscription.count(),
  ])

  res.json({
    success: true,
    data: { items, total, limit, offset },
  })
})

// Apps list
router.get('/apps', async (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 25), 100)
  const offset = Math.max(Number(req.query.offset ?? 0), 0)

  const [items, total] = await Promise.all([
    prisma.app.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        version: true,
        isActive: true,
        isPublic: true,
        developer: true,
        createdAt: true,
      },
    }),
    prisma.app.count(),
  ])

  res.json({
    success: true,
    data: { items, total, limit, offset },
  })
})

export default router
