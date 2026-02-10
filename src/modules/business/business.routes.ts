import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { requireRole } from '../../middlewares/role.middleware'
import { validate } from '../../middlewares/validate.middleware'
import {
  getBusinesses,
  getBusiness,
  createBusinessHandler,
  updateBusinessHandler,
  deleteBusinessHandler
} from './business.handlers'
import { createBusinessValidation, updateBusinessValidation } from './business.validators'

const router = Router()


router.get('/', getBusinesses)
router.get('/:id', getBusiness)

router.post(
  '/',
  authMiddleware,
  requireRole(['admin']),
  [...createBusinessValidation, validate],
  createBusinessHandler
)

router.put(
  '/:id',
  authMiddleware,
  requireRole(['admin']),
  [...updateBusinessValidation, validate],
  updateBusinessHandler
)

router.delete(
  '/:id', 
  authMiddleware, 
  requireRole(['admin']), 
  deleteBusinessHandler
)

export default router
