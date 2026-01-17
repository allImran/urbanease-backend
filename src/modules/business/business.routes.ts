import { Router } from 'express'
import { body } from 'express-validator'
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

const router = Router()


router.get('/', getBusinesses)
router.get('/:id', getBusiness)

router.post(
  '/', 
  authMiddleware, 
  requireRole(['admin']), 
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('slug').notEmpty().withMessage('Slug is required'),
    validate
  ],
  createBusinessHandler
)

router.put(
  '/:id', 
  authMiddleware, 
  requireRole(['admin']),
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('slug').optional().notEmpty().withMessage('Slug cannot be empty'),
    validate
  ],
  updateBusinessHandler
)

router.delete(
  '/:id', 
  authMiddleware, 
  requireRole(['admin']), 
  deleteBusinessHandler
)

export default router
