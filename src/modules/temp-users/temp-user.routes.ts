import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { requireRole } from '../../middlewares/role.middleware'
import { validate } from '../../middlewares/validate.middleware'
import {
  createTempUserValidation,
  updateTempUserValidation,
  searchTempUsersValidation
} from './temp-user.validation'
import {
  createTempUserHandler,
  updateTempUserHandler,
  searchTempUsersHandler,
  getTempUserHandler
} from './temp-user.handlers'

const router = Router()

// All routes require authentication and admin/staff role
router.use(authMiddleware)
router.use(requireRole(['admin', 'staff']))

// POST /api/temp-users - Create new temp user (global)
router.post(
  '/',
  createTempUserValidation,
  validate,
  createTempUserHandler
)

// PATCH /api/temp-users/:id - Update temp user (global)
router.patch(
  '/:id',
  updateTempUserValidation,
  validate,
  updateTempUserHandler
)

// GET /api/temp-users/search - Search temp users (global)
router.get(
  '/search',
  searchTempUsersValidation,
  validate,
  searchTempUsersHandler
)

// GET /api/temp-users/:id - Get specific temp user
router.get(
  '/:id',
  getTempUserHandler
)

export default router
