import { Router } from 'express'
// import authRoutes from './modules/auth/auth.routes'
import productRoutes from './modules/products/product.routes'
import userRoutes from './modules/users/user.routes'

const router = Router()

// router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/users', userRoutes)

export default router
