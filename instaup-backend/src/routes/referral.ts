import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import { prisma } from '../index'
import { processPendingOrder } from '../services/orderService'

const router = Router()

// 추천인 코드 생성 유틸리티
function generateUniqueReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = 'INSTA'
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 커미션 계산 알고리즘 (SNS Shop 스타일)
function calculateCommission(orderAmount: number, level: number): number {
  const rates = {
    1: 0.05,  // 1단계: 5%
    2: 0.03,  // 2단계: 3%
    3: 0.02   // 3단계: 2%
  }

  return Math.floor(orderAmount * (rates[level as keyof typeof rates] || 0))
}

// 다단계 추천인 찾기
async function findReferralChain(userId: string) {
  const chain: Array<{level: number, referrerId: string}> = []
  let currentUserId = userId

  for (let level = 1; level <= 3; level++) {
    const referral = await prisma.referral.findFirst({
      where: { referredId: currentUserId },
      select: { referrerId: true }
    })

    if (!referral) break

    chain.push({ level, referrerId: referral.referrerId })
    currentUserId = referral.referrerId
  }

  return chain
}

// GET /api/referral/stats - 추천인 통계 조회
router.get('/stats', authMiddleware, async (req, res): Promise<any> => {
  try {
    const userId = (req as any).user?.id

    // 추천인 통계 조회 또는 생성
    let stats = await prisma.referralStats.findUnique({
      where: { userId }
    })

    if (!stats) {
      stats = await prisma.referralStats.create({
        data: { userId }
      })
    }

    // 실시간 통계 업데이트
    const directReferrals = await prisma.referral.count({
      where: { referrerId: userId, level: 1 }
    })

    const activeReferrals = await prisma.referral.count({
      where: {
        referrerId: userId,
        level: 1,
        status: 'ACTIVE'
      }
    })

    const level2Referrals = await prisma.referral.count({
      where: { referrerId: userId, level: 2 }
    })

    const level3Referrals = await prisma.referral.count({
      where: { referrerId: userId, level: 3 }
    })

    // 이번 달 커미션
    const thisMonthStart = new Date()
    thisMonthStart.setDate(1)
    thisMonthStart.setHours(0, 0, 0, 0)

    const thisMonthCommissions = await prisma.referralCommission.aggregate({
      where: {
        referral: { referrerId: userId },
        status: 'PAID',
        paidAt: { gte: thisMonthStart }
      },
      _sum: { amount: true }
    })

    // 대기 중인 커미션
    const pendingCommissions = await prisma.referralCommission.aggregate({
      where: {
        referral: { referrerId: userId },
        status: 'PENDING'
      },
      _sum: { amount: true }
    })

    // 총 커미션
    const totalCommissions = await prisma.referralCommission.aggregate({
      where: {
        referral: { referrerId: userId },
        status: 'PAID'
      },
      _sum: { amount: true }
    })

    // 통계 업데이트
    const updatedStats = await prisma.referralStats.update({
      where: { userId },
      data: {
        directReferrals,
        activeReferrals,
        level2Referrals,
        level3Referrals,
        totalCommission: totalCommissions._sum.amount || 0,
        thisMonthCommission: thisMonthCommissions._sum.amount || 0,
        pendingCommission: pendingCommissions._sum.amount || 0
      }
    })

    res.json({
      success: true,
      data: updatedStats
    })

  } catch (error) {
    console.error('Get referral stats error:', error)
    res.status(500).json({
      success: false,
      error: '통계 조회 중 오류가 발생했습니다.'
    })
  }
})

// GET /api/referral/history - 추천인 내역 조회
router.get('/history', authMiddleware, async (req, res): Promise<any> => {
  try {
    const userId = (req as any).user?.id
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const skip = (page - 1) * limit

    const referrals = await prisma.referral.findMany({
      where: { referrerId: userId },
      include: {
        referred: {
          select: {
            id: true,
            email: true,
            nickname: true,
            createdAt: true
          }
        },
        commissions: {
          include: {
            order: {
              select: {
                id: true,
                finalPrice: true,
                createdAt: true,
                service: {
                  select: { name: true, platform: true }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })

    const total = await prisma.referral.count({
      where: { referrerId: userId }
    })

    res.json({
      success: true,
      data: {
        referrals,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Get referral history error:', error)
    res.status(500).json({
      success: false,
      error: '추천 내역 조회 중 오류가 발생했습니다.'
    })
  }
})

// GET /api/referral/commissions - 커미션 내역 조회
router.get('/commissions', authMiddleware, async (req, res): Promise<any> => {
  try {
    const userId = (req as any).user?.id
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const skip = (page - 1) * limit
    const status = req.query.status as string

    const whereClause: any = {
      referral: { referrerId: userId }
    }

    if (status && ['PENDING', 'PAID', 'CANCELLED'].includes(status)) {
      whereClause.status = status
    }

    const commissions = await prisma.referralCommission.findMany({
      where: whereClause,
      include: {
        referral: {
          include: {
            referred: {
              select: { nickname: true }
            }
          }
        },
        order: {
          select: {
            id: true,
            finalPrice: true,
            service: {
              select: { name: true, platform: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })

    const total = await prisma.referralCommission.count({
      where: whereClause
    })

    res.json({
      success: true,
      data: {
        commissions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Get commissions error:', error)
    res.status(500).json({
      success: false,
      error: '커미션 내역 조회 중 오류가 발생했습니다.'
    })
  }
})

// POST /api/referral/claim - 커미션 지급 요청
router.post('/claim', authMiddleware, async (req, res): Promise<any> => {
  try {
    const userId = (req as any).user?.id
    const { commissionIds } = req.body

    if (!commissionIds || !Array.isArray(commissionIds)) {
      return res.status(400).json({
        success: false,
        error: '유효한 커미션 ID가 필요합니다.'
      })
    }

    // 트랜잭션으로 커미션 지급 처리
    const result = await prisma.$transaction(async (tx) => {
      // 지급 가능한 커미션 확인
      const commissions = await tx.referralCommission.findMany({
        where: {
          id: { in: commissionIds },
          referral: { referrerId: userId },
          status: 'PENDING'
        }
      })

      if (commissions.length === 0) {
        throw new Error('지급 가능한 커미션이 없습니다.')
      }

      const totalAmount = commissions.reduce((sum, c) => sum + c.amount, 0)

      // 사용자 잔액 업데이트
      await tx.user.update({
        where: { id: userId },
        data: {
          balance: { increment: totalAmount }
        }
      })

      // 커미션 상태 업데이트
      await tx.referralCommission.updateMany({
        where: {
          id: { in: commissionIds }
        },
        data: {
          status: 'PAID',
          paidAt: new Date()
        }
      })

      return { totalAmount, count: commissions.length }
    })

    res.json({
      success: true,
      data: {
        message: '커미션이 성공적으로 지급되었습니다.',
        totalAmount: result.totalAmount,
        count: result.count
      }
    })

  } catch (error) {
    console.error('Claim commissions error:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '커미션 지급 중 오류가 발생했습니다.'
    })
  }
})

// GET /api/referral/code - 내 추천인 코드 조회
router.get('/code', authMiddleware, async (req, res): Promise<any> => {
  try {
    const userId = (req as any).user?.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { referralCode: true }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        error: '사용자를 찾을 수 없습니다.'
      })
    }

    const referralLink = `${process.env.FRONTEND_URL || 'https://instaup.co.kr'}/signup?ref=${user.referralCode}`

    res.json({
      success: true,
      data: {
        referralCode: user.referralCode,
        referralLink
      }
    })

  } catch (error) {
    console.error('Get referral code error:', error)
    res.status(500).json({
      success: false,
      error: '추천인 코드 조회 중 오류가 발생했습니다.'
    })
  }
})

// 내부 함수: 주문 완료 시 커미션 처리 (다른 컨트롤러에서 호출)
export async function processOrderCommissions(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true }
    })

    if (!order) return

    // 추천인 체인 찾기
    const referralChain = await findReferralChain(order.userId)

    if (referralChain.length === 0) return

    // 각 단계별 커미션 생성
    for (const { level, referrerId } of referralChain) {
      const referral = await prisma.referral.findFirst({
        where: {
          referrerId,
          referredId: level === 1 ? order.userId : referralChain[level - 2]?.referrerId
        }
      })

      if (!referral) continue

      const commissionAmount = calculateCommission(order.finalPrice, level)

      if (commissionAmount > 0) {
        // 커미션 기록 생성
        await prisma.referralCommission.create({
          data: {
            referralId: referral.id,
            orderId: order.id,
            amount: commissionAmount,
            rate: level === 1 ? 0.05 : level === 2 ? 0.03 : 0.02,
            type: level === 1 ? 'ORDER_COMMISSION' :
                  level === 2 ? 'LEVEL2_COMMISSION' : 'LEVEL3_COMMISSION'
          }
        })

        // 첫 주문 보너스 처리
        if (level === 1 && !referral.isFirstOrderRewarded) {
          await prisma.referralCommission.create({
            data: {
              referralId: referral.id,
              orderId: order.id,
              amount: referral.firstOrderBonus,
              rate: 0,
              type: 'FIRST_ORDER_BONUS'
            }
          })

          await prisma.referral.update({
            where: { id: referral.id },
            data: {
              isFirstOrderRewarded: true,
              firstOrderRewardedAt: new Date(),
              status: 'ACTIVE'
            }
          })
        }
      }
    }

  } catch (error) {
    console.error('Process order commissions error:', error)
  }
}

// Re-export for other modules
export { processPendingOrder }

export default router
