import { Router } from 'express'
import { body } from 'express-validator'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { requireRole } from '../../middlewares/role.middleware'
import { validate } from '../../middlewares/validate.middleware'
import {
  getCategories,
  getRootCategories,
  getCategory,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler
} from './category.handlers'

const router = Router()

// Define specific routes first
router.get('/roots', getRootCategories)

// General routes
router.get('/', getCategories)
router.get('/:id', getCategory)

router.post(
  '/', 
  authMiddleware, 
  requireRole(['admin', 'staff']), 
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('business_id').notEmpty().withMessage('Business ID is required').isUUID().withMessage('Invalid Business ID'),
    body('parent_id').optional().isUUID().withMessage('Invalid Parent ID'),
    validate
  ],
  createCategoryHandler
)

router.put(
  '/:id', 
  authMiddleware, 
  requireRole(['admin', 'staff']),
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('parent_id').optional().isUUID().withMessage('Invalid Parent ID'),
    validate
  ],
  updateCategoryHandler
)

router.delete(
  '/:id', 
  authMiddleware, 
  requireRole(['admin']), 
  deleteCategoryHandler
)

export default router
