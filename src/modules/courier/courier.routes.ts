import { Router, Request, Response, NextFunction } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { requireRole } from '../../middlewares/role.middleware'
import { validate } from '../../middlewares/validate.middleware'
import {
  createOrderValidation,
  bulkOrderValidation,
  deliveryStatusByCidValidation,
  deliveryStatusByInvoiceValidation,
  deliveryStatusByTrackingCodeValidation
} from './courier.validation'
import {
  createOrderHandler,
  bulkOrderHandler,
  getDeliveryStatusByCidHandler,
  getDeliveryStatusByInvoiceHandler,
  getDeliveryStatusByTrackingCodeHandler
} from './courier.handlers'

const router = Router()

// --- Admin / Staff Only ---

// Create a single order
router.post(
  '/create-order',
  authMiddleware,
  requireRole(['admin', 'staff']),
  createOrderValidation,
  validate,
  createOrderHandler
)

// Create bulk orders (up to 500)
router.post(
  '/create-order/bulk',
  authMiddleware,
  requireRole(['admin', 'staff']),
  bulkOrderValidation,
  validate,
  bulkOrderHandler
)

// --- Public or Authenticated ---

// Get delivery status by consignment ID (public)
router.get(
  '/delivery-status/cid/:cid',
  deliveryStatusByCidValidation,
  validate,
  getDeliveryStatusByCidHandler
)

// Get delivery status by invoice (public)
router.get(
  '/delivery-status/invoice/:invoice',
  deliveryStatusByInvoiceValidation,
  validate,
  getDeliveryStatusByInvoiceHandler
)

// Get delivery status by tracking code (public)
router.get(
  '/delivery-status/tracking/:trackingCode',
  deliveryStatusByTrackingCodeValidation,
  validate,
  getDeliveryStatusByTrackingCodeHandler
)

export default router
