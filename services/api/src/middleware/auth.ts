import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/database'
import { logger } from '../config/logger'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    firstName: string
    lastName: string
    emailVerified: boolean
    twoFactorEnabled: boolean
  }
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Access token required',
        },
      })
      return
    }

    const token = authHeader.substring(7)
    const jwtSecret = process.env.JWT_SECRET

    if (!jwtSecret) {
      logger.error('JWT_SECRET is not configured')
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Server configuration error',
        },
      })
      return
    }

    // Verify JWT token
    const decoded = jwt.verify(token, jwtSecret) as { userId: string }
    
    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        emailVerified: true,
        twoFactorEnabled: true,
      },
    })

    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid token - user not found',
        },
      })
      return
    }

    // Attach user to request
    req.user = user
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Access token has expired',
        },
      })
      return
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid access token',
        },
      })
      return
    }

    logger.error('Authentication error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Authentication failed',
      },
    })
  }
}

export const optionalAuthMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next()
      return
    }

    const token = authHeader.substring(7)
    const jwtSecret = process.env.JWT_SECRET

    if (!jwtSecret) {
      next()
      return
    }

    const decoded = jwt.verify(token, jwtSecret) as { userId: string }
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        emailVerified: true,
        twoFactorEnabled: true,
      },
    })

    if (user) {
      req.user = user
    }

    next()
  } catch (error) {
    // Silently fail for optional auth
    next()
  }
}

export const requireEmailVerification = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user?.emailVerified) {
    res.status(403).json({
      success: false,
      error: {
        code: 'EMAIL_NOT_VERIFIED',
        message: 'Email verification required',
      },
    })
    return
  }

  next()
}

export const requireTwoFactorAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user?.twoFactorEnabled) {
    res.status(403).json({
      success: false,
      error: {
        code: 'TWO_FACTOR_REQUIRED',
        message: 'Two-factor authentication required',
      },
    })
    return
  }

  next()
}
