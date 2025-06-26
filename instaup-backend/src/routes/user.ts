import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'

const router = Router()
router.use(authMiddleware)

router.get('/dashboard', async (req, res) => {
  res.json({
    success: true,
    message: '사용자 대시보드 API'
  })
})

export default router
