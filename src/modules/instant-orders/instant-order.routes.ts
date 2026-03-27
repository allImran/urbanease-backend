import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { requireRole } from '../../middlewares/role.middleware'
import { validate } from '../../middlewares/validate.middleware'
import {
  createInstantOrderValidation,
  updateInstantOrderValidation,
  listInstantOrdersValidation
} from './instant-order.validation'
import {
  createInstantOrderHandler,
  updateInstantOrderHandler,
  listInstantOrdersHandler,
  getInstantOrderHandler
} from './instant-order.handlers'

const router = Router()

// All routes require authentication and admin/staff role
router.use(authMiddleware)
router.use(requireRole(['admin', 'staff']))

// POST /api/instant-orders - Create new instant order
router.post(
  '/',
  createInstantOrderValidation,
  validate,
  createInstantOrderHandler
)

// GET /api/instant-orders - List instant orders (with filters)
router.get(
  '/',
  listInstantOrdersValidation,
  validate,
  listInstantOrdersHandler
)

// GET /api/instant-orders/:id - Get specific instant order
router.get(
  '/:id',
  getInstantOrderHandler
)

// PATCH /api/instant-orders/:id - Update instant order
router.patch(
  '/:id',
  updateInstantOrderValidation,
  validate,
  updateInstantOrderHandler
)

export default router
