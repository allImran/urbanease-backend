import { Router } from 'express'
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
router.post('/', createBusinessHandler)
router.put('/:id', updateBusinessHandler)
router.delete('/:id', deleteBusinessHandler)

export default router
