import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../index'

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({
        success: false,
        error: '인증 토큰이 필요합니다.'
      })
    }

    const jwtSecret = process.env.JWT_SECRET || 'instaup_dev_secret_key_very_long_string_for_security_2024'
    const decoded = jwt.verify(token, jwtSecret) as any

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId, isActive: true },
      select: {
        id: true,
        email: true,
        nickname: true,
        balance: true,
        totalSpent: true,
        referralCode: true,
        createdAt: true
      }
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        error: '유효하지 않은 토큰입니다.'
      })
    }

    ;(req as any).user = user
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(401).json({
      success: false,
      error: '인증에 실패했습니다.'
    })
  }
}

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const user = (req as any).user
    if (!user) {
      return res.status(401).json({
        success: false,
        error: '인증이 필요합니다.'
      })
    }

    if (user.email !== 'neulketing@gmail.com') {
      return res.status(403).json({
        success: false,
        error: '관리자 권한이 필요합니다.'
      })
    }

    next()
  } catch (error) {
    console.error('Admin middleware error:', error)
    res.status(403).json({
      success: false,
      error: '권한 확인 중 오류가 발생했습니다.'
    })
  }
}
