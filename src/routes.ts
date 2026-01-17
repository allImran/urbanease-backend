import { Router } from 'express'
// import authRoutes from './modules/auth/auth.routes'
import productRoutes from './modules/products/product.routes'
import userRoutes from './modules/users/user.routes'

import businessRoutes from './modules/business/business.routes'
import categoryRoutes from './modules/category/category.routes'

const router = Router()

// router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/users', userRoutes)
router.use('/businesses', businessRoutes)
router.use('/categories', categoryRoutes)

export default router
