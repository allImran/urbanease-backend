import { Router } from 'express'
import { getProducts } from './product.handlers'
import { authMiddleware } from '@/middlewares/auth.middleware'

const router = Router()

router.get('/', authMiddleware, getProducts)

export default router
