import { Router } from 'express'
import userRoutes from './modules/users/user.routes'
import businessRoutes from './modules/business/business.routes'
import categoryRoutes from './modules/category/category.routes'

const router = Router()

router.use('/users', userRoutes)
router.use('/businesses', businessRoutes)
router.use('/categories', categoryRoutes)

export default router