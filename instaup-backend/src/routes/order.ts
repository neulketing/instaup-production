import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import { createOrder } from '../services/orderService'
import { processOrderCommissions, processPendingOrder } from './referral'
import { prisma } from '../index'

const router = Router()
router.use(authMiddleware)

router.post('/', async (req, res): Promise<any> => {
  try {
    const { serviceId, quantity, targetUrl } = req.body
    const userId = (req as any).user.id

    // Get service details for pricing
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    const pricePerUnit = service.price;
    const baseAmount = pricePerUnit * quantity;
    const charge = baseAmount; // No discount for now

    const result = await createOrder({
      userId,
      serviceId,
      quantity,
      targetUrl,
      pricePerUnit,
      baseAmount,
      charge,
      finalPrice: charge
    });

    // 주문 성공 시 추천인 커미션 처리 (백그라운드에서 실행)
    if (result?.id) {
      setTimeout(() => {
        processOrderCommissions(result.id);
        processPendingOrder(result.id);
      }, 1000) // 1초 후 처리 (비동기)
    }

    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Order create error:', error)
    res.status(400).json({ success: false, error: String(error) })
  }
})

router.get('/', async (req, res): Promise<any> => {
  try {
    const userId = (req as any).user.id
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const skip = (page - 1) * limit

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        service: {
          select: {
            name: true,
            platform: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })

    const total = await prisma.order.count({
      where: { userId }
    })

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('Get orders error:', error)
    res.status(500).json({
      success: false,
      error: '주문 내역 조회 중 오류가 발생했습니다.'
    })
  }
})

// 주문 상태 업데이트 (관리자용)
router.patch('/:orderId/status', async (req, res): Promise<any> => {
  try {
    const { orderId } = req.params
    const { status } = req.body
    const userId = (req as any).user.id

    // 관리자 권한 확인 (간단 구현)
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user || user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        error: '관리자 권한이 필요합니다.'
      })
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        completedAt: status === 'COMPLETED' ? new Date() : undefined
      }
    })

    // 주문 완료 시 추천인 커미션 처리
    if (status === 'COMPLETED') {
      setTimeout(() => {
        processOrderCommissions(orderId);
        processPendingOrder(orderId);
      }, 1000)
    }

    res.json({
      success: true,
      data: order
    })

  } catch (error) {
    console.error('Update order status error:', error)
    res.status(500).json({
      success: false,
      error: '주문 상태 업데이트 중 오류가 발생했습니다.'
    })
  }
})

export default router
