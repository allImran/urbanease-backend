import { Router } from 'express'
import userRoutes from './modules/users/user.routes'
import businessRoutes from './modules/business/business.routes'
import categoryRoutes from './modules/category/category.routes'
import productRoutes from './modules/products/products.routes'
import { filesRoutes } from './modules/files/files.routes'
import orderRoutes from './modules/orders/order.routes'


const router = Router()

router.use('/users', userRoutes)
router.use('/businesses', businessRoutes)
router.use('/categories', categoryRoutes)
router.use('/products', productRoutes)
router.use('/files', filesRoutes)
router.use('/orders', orderRoutes)


export default router