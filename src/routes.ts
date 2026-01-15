import { Router } from 'express'
// import authRoutes from './modules/auth/auth.routes'
import productRoutes from './modules/products/product.routes'

const router = Router()

// router.use('/auth', authRoutes)
router.use('/products', productRoutes)

export default router
