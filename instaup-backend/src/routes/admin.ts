import { Router } from 'express'
import { authMiddleware, adminMiddleware } from '../middleware/auth'

const router = Router()
router.use(authMiddleware)
router.use(adminMiddleware)

router.get('/dashboard', async (req, res) => {
  res.json({
    success: true,
    data: {
      totalUsers: 1367,
      totalOrders: 3241,
      totalRevenue: 18750000,
      completionRate: 96.2
    },
    message: '관리자 대시보드'
  })
})

export default router
