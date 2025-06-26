import { Router } from 'express'
import { register, login, getProfile, refreshToken } from '../controllers/authController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refreshToken)
router.get('/profile', authMiddleware, getProfile)
router.get('/me', authMiddleware, getProfile)

export default router
