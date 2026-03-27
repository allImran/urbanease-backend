import { Router } from 'express'
import userRoutes from './modules/users/user.routes'
import businessRoutes from './modules/business/business.routes'
import categoryRoutes from './modules/category/category.routes'
import productRoutes from './modules/products/products.routes'
import { filesRoutes } from './modules/files/files.routes'
import orderRoutes from './modules/orders/order.routes'
import whatsappRoutes from './modules/whatsapp/whatsapp.routes'
import tempUserRoutes from './modules/temp-users/temp-user.routes'
import instantOrderRoutes from './modules/instant-orders/instant-order.routes'
import steadfastRoutes from './modules/courier/courier.routes'


const router = Router()

router.use('/users', userRoutes)
router.use('/businesses', businessRoutes)
router.use('/categories', categoryRoutes)
router.use('/products', productRoutes)
router.use('/files', filesRoutes)
router.use('/orders', orderRoutes)
router.use('/whatsapp', whatsappRoutes)
router.use('/temp-users', tempUserRoutes)
router.use('/instant-orders', instantOrderRoutes)
router.use('/steadfast', steadfastRoutes)


export default router