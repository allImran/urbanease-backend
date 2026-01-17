import { Router } from 'express'
import { body, param } from 'express-validator'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { requireRole } from '../../middlewares/role.middleware'
import { validate } from '../../middlewares/validate.middleware'
import * as handlers from './user.handlers'

const router = Router()

// Admin: Update user role
router.patch(
  '/:userId/role',
  authMiddleware,
  requireRole(['admin']),
  [
    param('userId').isUUID().withMessage('Invalid User ID'),
    body('role').isIn(['customer', 'staff', 'admin']).withMessage('Invalid role'),
  ],
  validate,
  handlers.updateUserRole
)

export default router
