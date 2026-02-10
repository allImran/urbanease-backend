import { Router } from 'express'
import { body } from 'express-validator'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { requireRole } from '../../middlewares/role.middleware'
import { validate } from '../../middlewares/validate.middleware'
import {
  getProductsHandler,
  getProductHandler,
  getProductBySlugHandler,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
  getVariantsHandler,
  createVariantHandler,
  updateVariantHandler,
  deleteVariantHandler
} from './products.handlers'

const router = Router()

// --- Products Routes ---

// Public Read Access
router.get('/', getProductsHandler)
router.get('/slug/:slug', getProductBySlugHandler)
router.get('/:id', getProductHandler)

// Admin/Staff Create/Update Access
router.post(
  '/',
  authMiddleware,
  requireRole(['admin', 'staff']),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('slug').notEmpty().withMessage('Slug is required'),
    body('category_id').notEmpty().withMessage('Category ID is required'),
    body('business_id').notEmpty().withMessage('Business ID is required').isUUID().withMessage('Business ID must be a valid UUID'),
    validate
  ],
  createProductHandler
)

router.put(
  '/:id',
  authMiddleware,
  requireRole(['admin', 'staff']),
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('slug').optional().notEmpty().withMessage('Slug cannot be empty'),
    validate
  ],
  updateProductHandler
)

// Admin Delete Access
router.delete(
  '/:id',
  authMiddleware,
  requireRole(['admin']),
  deleteProductHandler
)

// --- Variants Routes (Nested under products or separate, using mixed approach for clarity) ---

// Public Read Variants by Product ID
router.get('/:id/variants', getVariantsHandler)

// Admin/Staff Create Variant for Product
router.post(
  '/:id/variants',
  authMiddleware,
  requireRole(['admin', 'staff']),
  [
    body('sku').optional().notEmpty().withMessage('SKU cannot be empty'),
    body('price').optional().isNumeric().withMessage('Price must be a number'),
    body('product_id').notEmpty().withMessage('Product ID is required'),
    validate
  ],
  createVariantHandler
)

// Admin/Staff Update Variant (Direct ID access)
router.put(
  '/variants/:id',
  authMiddleware,
  requireRole(['admin', 'staff']),
  updateVariantHandler
)

// Admin Delete Variant
router.delete(
  '/variants/:id',
  authMiddleware,
  requireRole(['admin']),
  deleteVariantHandler
)

export default router
