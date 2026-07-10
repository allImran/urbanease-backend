import { Router, Request, Response, NextFunction } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { requireRole } from '../../middlewares/role.middleware'
import { validate } from '../../middlewares/validate.middleware'
import {
  createOrderValidation,
  updateOrderStatusValidation,
  updateOrderAdminValidation,
  pickupRequestValidation
} from './order.validation'
import {
  getOrdersHandler,
  getBusinessOrdersHandler,
  getOrderHandler,
  createOrderHandler,
  updateOrderStatusHandler,
  updateOrderHandler,
  getOrderStatusHistoryHandler,
  requestPickupHandler
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

// Get Order by ID (Public - includes status history)
router.get(
  '/:id',
  getOrderHandler
)

// Get Order Status History (RBAC checked in handler)
router.get(
  '/:id/history',
  authMiddleware,
  getOrderStatusHistoryHandler
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

// Request Courier Pickup (creates Steadfast consignment, stores cod_reference)
router.post(
  '/:id/pickup-request',
  authMiddleware,
  requireRole(['admin', 'staff']),
  pickupRequestValidation,
  validate,
  requestPickupHandler
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
