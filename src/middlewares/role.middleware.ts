import { Request, Response, NextFunction } from 'express'

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const userRole = user.app_metadata?.role

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: 'Forbidden: Insufficient permissions',
      })
    }

    next()
  }
}
