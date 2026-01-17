import { Router } from 'express'
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
router.post('/', createCategoryHandler)
router.get('/:id', getCategory)
router.put('/:id', updateCategoryHandler)
router.delete('/:id', deleteCategoryHandler)

export default router
