import { Request, Response, NextFunction } from 'express'
import { logger } from '../config/logger'

export interface AppError extends Error {
  statusCode?: number
  code?: string
  details?: any
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  })

  // Default error
  let statusCode = err.statusCode || 500
  let code = err.code || 'INTERNAL_ERROR'
  let message = err.message || 'Internal server error'

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400
    code = 'VALIDATION_ERROR'
    message = 'Validation failed'
  } else if (err.name === 'CastError') {
    statusCode = 400
    code = 'INVALID_ID'
    message = 'Invalid ID format'
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    code = 'INVALID_TOKEN'
    message = 'Invalid token'
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401
    code = 'TOKEN_EXPIRED'
    message = 'Token expired'
  } else if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any
    switch (prismaError.code) {
      case 'P2002':
        statusCode = 409
        code = 'DUPLICATE_ENTRY'
        message = 'Resource already exists'
        break
      case 'P2025':
        statusCode = 404
        code = 'NOT_FOUND'
        message = 'Resource not found'
        break
      case 'P2003':
        statusCode = 400
        code = 'FOREIGN_KEY_CONSTRAINT'
        message = 'Invalid reference'
        break
      default:
        statusCode = 500
        code = 'DATABASE_ERROR'
        message = 'Database operation failed'
    }
  }

  // Send error response
  const errorResponse: any = {
    success: false,
    error: {
      code,
      message,
    },
  }

  // Include details in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.details = err.details || err.stack
  }

  res.status(statusCode).json(errorResponse)
}

export const createError = (
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: any
): AppError => {
  const error = new Error(message) as AppError
  error.statusCode = statusCode
  error.code = code
  error.details = details
  return error
}

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
