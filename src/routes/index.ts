import { Router } from "express";
import helloWorldRoutes from './helloWorldRoutes'
import pinturaRoutes from './pinturaRoutes'

const router = Router()

router.use('/hello-world', helloWorldRoutes)
router.use('/pinturas', pinturaRoutes)

export default router