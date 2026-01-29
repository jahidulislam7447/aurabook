import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from './auth'

const parseCsv = (value: string | undefined): string[] => {
  if (!value) return []
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export const requireSuperAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const userEmail = req.user?.email
  if (!userEmail) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    })
    return
  }

  const allowedEmails = parseCsv(process.env.SUPER_ADMIN_EMAILS)

  if (!allowedEmails.includes(userEmail)) {
    res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Super admin access required',
      },
    })
    return
  }

  next()
}
