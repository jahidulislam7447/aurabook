import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { prisma } from '../config/database'
import { asyncHandler, createError } from '../middleware/errorHandler'
import { AuthenticatedRequest } from '../middleware/auth'

const router = Router()

// Update user profile
router.put('/profile',
  [
    body('firstName').optional().trim().isLength({ min: 1, max: 50 }),
    body('lastName').optional().trim().isLength({ min: 1, max: 50 }),
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

    const { firstName, lastName } = req.body
    const userId = req.user!.id

    const user = await prisma.user.update({
      where: { id: userId },
      data: { firstName, lastName },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        emailVerified: true,
        twoFactorEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    res.json({
      success: true,
      data: { user },
    })
  })
)

// Change password
router.put('/password',
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
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

    const { currentPassword, newPassword } = req.body
    const userId = req.user!.id

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    })

    if (!user || !user.passwordHash) {
      throw createError('User not found or no password set', 400, 'INVALID_USER')
    }

    // Verify current password
    const bcrypt = require('bcryptjs')
    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isValidPassword) {
      throw createError('Current password is incorrect', 400, 'INVALID_PASSWORD')
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12)

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    })

    res.json({
      success: true,
      message: 'Password updated successfully',
    })
  })
)

export default router
