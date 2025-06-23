import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'

const router = Router()
router.use(authMiddleware)

router.get('/user-stats', async (req, res) => {
  res.json({
    success: true,
    message: '분석 API (준비중)'
  })
})

export default router
