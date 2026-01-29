import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { prisma } from '../config/database'
import { logger } from '../config/logger'
import { asyncHandler, createError } from '../middleware/errorHandler'
import { AuthenticatedRequest } from '../middleware/auth'
import { redisService } from '../config/redis'

const router = Router()

// Validation middleware
const handleValidationErrors = (req: any, res: any, next: any) => {
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
  next()
}

// Register with email
router.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
    body('firstName').trim().isLength({ min: 1, max: 50 }),
    body('lastName').trim().isLength({ min: 1, max: 50 }),
  ],
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName } = req.body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw createError('User already exists', 409, 'USER_EXISTS')
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        emailVerified: true,
        twoFactorEnabled: true,
        createdAt: true,
      },
    })

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    await redisService.set(
      `email_verification:${verificationToken}`,
      user.id,
      24 * 60 * 60 // 24 hours
    )

    // TODO: Send verification email

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    logger.info(`User registered: ${email}`)

    res.status(201).json({
      success: true,
      data: {
        user,
        token,
        verificationToken,
      },
      message: 'Registration successful. Please check your email to verify your account.',
    })
  })
)

// Login with email
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // Find user with auth provider
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        authProviders: {
          where: { name: 'email' },
        },
      },
    })

    if (!user || !user.passwordHash) {
      throw createError('Invalid credentials', 401, 'INVALID_CREDENTIALS')
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      throw createError('Invalid credentials', 401, 'INVALID_CREDENTIALS')
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    logger.info(`User logged in: ${email}`)

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
        token,
      },
    })
  })
)

// Google OAuth
router.post('/google',
  [
    body('token').notEmpty(),
  ],
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { token } = req.body

    // TODO: Verify Google token
    // const googleUser = await verifyGoogleToken(token)

    // For now, mock Google user data
    const googleUser = {
      id: 'google_user_id',
      email: 'user@gmail.com',
      firstName: 'Google',
      lastName: 'User',
      avatar: 'https://lh3.googleusercontent.com/...',
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          emailVerified: true,
          authProviders: {
            create: {
              name: 'google',
              providerId: googleUser.id,
            },
          },
        },
      })
    } else {
      // Check if Google provider exists
      const existingProvider = await prisma.authProvider.findFirst({
        where: {
          userId: user.id,
          name: 'google',
        },
      })

      if (!existingProvider) {
        await prisma.authProvider.create({
          data: {
            userId: user.id,
            name: 'google',
            providerId: googleUser.id,
          },
        })
      }
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    logger.info(`User logged in via Google: ${googleUser.email}`)

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
        token: jwtToken,
      },
    })
  })
)

// GitHub OAuth
router.post('/github',
  [
    body('code').notEmpty(),
  ],
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { code } = req.body

    // TODO: Exchange code for GitHub token and get user info
    // const githubUser = await getGithubUser(code)

    // For now, mock GitHub user data
    const githubUser = {
      id: 'github_user_id',
      email: 'user@github.com',
      login: 'githubuser',
      name: 'GitHub User',
      avatar: 'https://avatars.githubusercontent.com/...',
    }

    const [firstName, lastName] = githubUser.name ? githubUser.name.split(' ') : [githubUser.login, '']

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: githubUser.email },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: githubUser.email,
          firstName,
          lastName: lastName || '',
          emailVerified: true,
          authProviders: {
            create: {
              name: 'github',
              providerId: githubUser.id.toString(),
            },
          },
        },
      })
    } else {
      // Check if GitHub provider exists
      const existingProvider = await prisma.authProvider.findFirst({
        where: {
          userId: user.id,
          name: 'github',
        },
      })

      if (!existingProvider) {
        await prisma.authProvider.create({
          data: {
            userId: user.id,
            name: 'github',
            providerId: githubUser.id.toString(),
          },
        })
      }
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    logger.info(`User logged in via GitHub: ${githubUser.email}`)

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
        token: jwtToken,
      },
    })
  })
)

// Verify email
router.post('/verify-email',
  [
    body('token').notEmpty(),
  ],
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { token } = req.body

    // Get user ID from Redis
    const userId = await redisService.get(`email_verification:${token}`)
    
    if (!userId) {
      throw createError('Invalid or expired verification token', 400, 'INVALID_TOKEN')
    }

    // Update user
    const user = await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        emailVerified: true,
      },
    })

    // Delete token from Redis
    await redisService.del(`email_verification:${token}`)

    logger.info(`Email verified: ${user.email}`)

    res.json({
      success: true,
      data: { user },
      message: 'Email verified successfully',
    })
  })
)

// Forgot password
router.post('/forgot-password',
  [
    body('email').isEmail().normalizeEmail(),
  ],
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { email } = req.body

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal that user doesn't exist
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    await redisService.set(
      `password_reset:${resetToken}`,
      user.id,
      60 * 60 // 1 hour
    )

    // TODO: Send password reset email

    logger.info(`Password reset requested: ${email}`)

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
      resetToken, // Only for development
    })
  })
)

// Reset password
router.post('/reset-password',
  [
    body('token').notEmpty(),
    body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
  ],
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { token, password } = req.body

    // Get user ID from Redis
    const userId = await redisService.get(`password_reset:${token}`)
    
    if (!userId) {
      throw createError('Invalid or expired reset token', 400, 'INVALID_TOKEN')
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 12)

    // Update user
    const user = await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    })

    // Delete token from Redis
    await redisService.del(`password_reset:${token}`)

    logger.info(`Password reset completed: ${user.email}`)

    res.json({
      success: true,
      data: { user },
      message: 'Password reset successfully',
    })
  })
)

// Get current user
router.get('/me',
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      throw createError('Authentication required', 401, 'UNAUTHORIZED')
    }

    res.json({
      success: true,
      data: { user: req.user },
    })
  })
)

export default router
