import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../index'

// 추천인 코드 생성 함수
function generateUniqueReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = 'INSTA'
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, nickname, referralCode: inputReferralCode } = req.body

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: '이미 등록된 이메일입니다.'
      })
    }

    // 추천인 확인
    let referrer = null
    if (inputReferralCode) {
      referrer = await prisma.user.findUnique({
        where: { referralCode: inputReferralCode }
      })

      if (!referrer) {
        return res.status(400).json({
          success: false,
          error: '유효하지 않은 추천인 코드입니다.'
        })
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // 유니크한 추천인 코드 생성
    let newReferralCode: string
    do {
      newReferralCode = generateUniqueReferralCode()
    } while (await prisma.user.findUnique({ where: { referralCode: newReferralCode } }))

    // 트랜잭션으로 사용자 생성 및 추천 관계 설정
    const result = await prisma.$transaction(async (tx) => {
      // 사용자 생성
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          nickname,
          referralCode: newReferralCode,
          referredBy: referrer?.id || null,
          balance: 10000 // 기본 가입 보너스
        },
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

      // 추천인 관계 및 보상 처리
      if (referrer) {
        // 1단계 추천 관계 생성
        await tx.referral.create({
          data: {
            referrerId: referrer.id,
            referredId: user.id,
            level: 1,
            status: 'PENDING'
          }
        })

        // 추천인에게 가입 보너스 지급
        await tx.user.update({
          where: { id: referrer.id },
          data: {
            balance: { increment: 10000 }
          }
        })

        // 가입 보너스 커미션 기록
        const referralRecord = await tx.referral.findFirst({
          where: {
            referrerId: referrer.id,
            referredId: user.id
          }
        })

        if (referralRecord) {
          await tx.referralCommission.create({
            data: {
              referralId: referralRecord.id,
              orderId: user.id, // 임시로 사용자 ID 사용 (주문이 아닌 가입 보너스)
              amount: 10000,
              rate: 0,
              type: 'SIGNUP_BONUS',
              status: 'PAID',
              paidAt: new Date()
            }
          })

          // 추천 관계 상태 업데이트
          await tx.referral.update({
            where: { id: referralRecord.id },
            data: {
              isSignupRewarded: true,
              signupRewardedAt: new Date()
            }
          })
        }

        // 2단계, 3단계 추천인 찾기 및 관계 설정
        const referrerReferral = await tx.referral.findFirst({
          where: { referredId: referrer.id }
        })

        if (referrerReferral) {
          // 2단계 추천 관계 생성
          await tx.referral.create({
            data: {
              referrerId: referrerReferral.referrerId,
              referredId: user.id,
              level: 2,
              status: 'PENDING'
            }
          })

          // 3단계 추천인 찾기
          const level2ReferrerReferral = await tx.referral.findFirst({
            where: { referredId: referrerReferral.referrerId }
          })

          if (level2ReferrerReferral) {
            // 3단계 추천 관계 생성
            await tx.referral.create({
              data: {
                referrerId: level2ReferrerReferral.referrerId,
                referredId: user.id,
                level: 3,
                status: 'PENDING'
              }
            })
          }
        }
      }

      // 추천인 통계 초기화
      await tx.referralStats.create({
        data: {
          userId: user.id
        }
      })

      return user
    })

    const jwtSecret = process.env.JWT_SECRET || 'instaup_dev_secret_key_very_long_string_for_security_2024'

    const token = jwt.sign(
      { userId: result.id, email: result.email },
      jwtSecret,
      { expiresIn: '7d' }
    )

    const refreshToken = jwt.sign(
      { userId: result.id, email: result.email, type: 'refresh' },
      jwtSecret,
      { expiresIn: '30d' }
    )

    res.status(201).json({
      success: true,
      data: { user: result, token, refreshToken },
      message: referrer
        ? '회원가입이 완료되었습니다. 추천인 보너스가 지급되었습니다!'
        : '회원가입이 완료되었습니다.'
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      error: '회원가입 중 오류가 발생했습니다.'
    })
  }
}

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email, isActive: true }
    })

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({
        success: false,
        error: '이메일 또는 비밀번호가 올바르지 않습니다.'
      })
    }

    const jwtSecret = process.env.JWT_SECRET || 'instaup_dev_secret_key_very_long_string_for_security_2024'

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      { expiresIn: '7d' }
    )

    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email, type: 'refresh' },
      jwtSecret,
      { expiresIn: '30d' }
    )

    const { password: _, ...userWithoutPassword } = user

    res.json({
      success: true,
      data: { user: userWithoutPassword, token, refreshToken },
      message: '로그인 성공'
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      error: '로그인 중 오류가 발생했습니다.'
    })
  }
}

export const getProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      success: false,
      error: '프로필 조회 중 오류가 발생했습니다.'
    })
  }
}

// JWT 토큰 갱신
export const refreshToken = async (req: Request, res: Response): Promise<any> => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: '리프레시 토큰이 필요합니다.'
      })
    }

    // 실제 환경에서는 refreshToken을 DB에 저장하고 검증해야 합니다.
    // 현재는 JWT로 간단하게 처리
    const jwtSecret = process.env.JWT_SECRET || 'instaup_dev_secret_key_very_long_string_for_security_2024'

    try {
      const decoded = jwt.verify(refreshToken, jwtSecret) as any

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
          error: '유효하지 않은 리프레시 토큰입니다.'
        })
      }

      // 새로운 액세스 토큰 생성
      const newAccessToken = jwt.sign(
        { userId: user.id, email: user.email },
        jwtSecret,
        { expiresIn: '7d' }
      )

      // 새로운 리프레시 토큰 생성 (선택사항)
      const newRefreshToken = jwt.sign(
        { userId: user.id, email: user.email, type: 'refresh' },
        process.env.JWT_SECRET!,
        { expiresIn: '30d' }
      )

      res.json({
        success: true,
        data: {
          user,
          token: newAccessToken,
          refreshToken: newRefreshToken
        },
        message: '토큰이 갱신되었습니다.'
      })

    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        error: '만료되거나 유효하지 않은 리프레시 토큰입니다.'
      })
    }

  } catch (error) {
    console.error('Refresh token error:', error)
    res.status(500).json({
      success: false,
      error: '토큰 갱신 중 오류가 발생했습니다.'
    })
  }
}
