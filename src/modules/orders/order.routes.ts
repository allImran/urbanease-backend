import { Router, Request, Response, NextFunction } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { requireRole } from '../../middlewares/role.middleware'
import { validate } from '../../middlewares/validate.middleware'
import {
  createOrderValidation,
  updateOrderStatusValidation,
  updateOrderAdminValidation
} from './order.validation'
import {
  getOrdersHandler,
  getBusinessOrdersHandler,
  getOrderHandler,
  createOrderHandler,
  updateOrderStatusHandler,
  updateOrderHandler
} from './order.handlers'

const router = Router()

// --- Public / Customer / All Authenticated ---

// Create Order (Guest or Auth)
router.post(
  '/',
  // authMiddleware is optional here because we handle guest orders via phone
  (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      return authMiddleware(req, res, next)
    }
    next()
  },
  createOrderValidation,
  validate,
  createOrderHandler
)

// Get Own Order / Any Order (RBAC checked in handler)
router.get(
  '/:id',
  authMiddleware,
  getOrderHandler
)

// --- Admin / Staff Only ---

// List All Orders
router.get(
  '/',
  authMiddleware,
  requireRole(['admin', 'staff']),
  getOrdersHandler
)

// List Orders by Business
router.get(
  '/business/:id',
  authMiddleware,
  requireRole(['admin', 'staff']),
  getBusinessOrdersHandler
)

// Update Order Status
router.patch(
  '/:id/status',
  authMiddleware,
  requireRole(['admin', 'staff']),
  updateOrderStatusValidation,
  validate,
  updateOrderStatusHandler
)

// --- Admin Only ---

// Full Order Update
router.patch(
  '/:id',
  authMiddleware,
  requireRole(['admin']),
  updateOrderAdminValidation,
  validate,
  updateOrderHandler
)

export default router
