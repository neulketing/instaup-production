import axios from 'axios'
import { logger } from '../utils/logger'

export interface PaymentRequest {
  orderId: string
  amount: number
  orderName: string
  customerName: string
  customerEmail?: string
  successUrl: string
  failUrl: string
  cancelUrl: string
}

export interface PaymentResponse {
  success: boolean
  paymentKey?: string
  orderId: string
  amount: number
  approvalUrl?: string
  failReason?: string
}

// KakaoPay Implementation
export class KakaoPayService {
  private readonly baseUrl: string
  private readonly cid: string
  private readonly secretKey: string

  constructor() {
    this.baseUrl = process.env.KAKAO_PAY_API_URL || 'https://kapi.kakao.com'
    this.cid = process.env.KAKAO_PAY_CID || ''
    this.secretKey = process.env.KAKAO_PAY_SECRET_KEY || ''
  }

  async requestPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/payment/ready`,
        {
          cid: this.cid,
          partner_order_id: request.orderId,
          partner_user_id: request.customerEmail || 'guest',
          item_name: request.orderName,
          quantity: 1,
          total_amount: request.amount,
          tax_free_amount: 0,
          approval_url: request.successUrl,
          cancel_url: request.cancelUrl,
          fail_url: request.failUrl
        },
        {
          headers: {
            'Authorization': `KakaoAK ${this.secretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        }
      )

      return {
        success: true,
        paymentKey: response.data.tid,
        orderId: request.orderId,
        amount: request.amount,
        approvalUrl: response.data.next_redirect_pc_url
      }
    } catch (error: any) {
      logger.error('KakaoPay payment request failed:', error.response?.data || error.message)
      return {
        success: false,
        orderId: request.orderId,
        amount: request.amount,
        failReason: error.response?.data?.msg || error.message
      }
    }
  }

  async approvePayment(tid: string, pgToken: string, orderId: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/payment/approve`,
        {
          cid: this.cid,
          tid: tid,
          partner_order_id: orderId,
          partner_user_id: 'guest',
          pg_token: pgToken
        },
        {
          headers: {
            'Authorization': `KakaoAK ${this.secretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        }
      )

      return response.data
    } catch (error: any) {
      logger.error('KakaoPay payment approval failed:', error.response?.data || error.message)
      throw error
    }
  }
}

// TossPay Implementation
export class TossPayService {
  private readonly baseUrl: string
  private readonly clientKey: string
  private readonly secretKey: string

  constructor() {
    this.baseUrl = process.env.TOSS_PAY_API_URL || 'https://api.tosspayments.com'
    this.clientKey = process.env.TOSS_PAY_CLIENT_KEY || ''
    this.secretKey = process.env.TOSS_PAY_SECRET_KEY || ''
  }

  async requestPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // TossPay uses client-side integration, so we return the necessary data
      return {
        success: true,
        orderId: request.orderId,
        amount: request.amount,
        approvalUrl: `${this.baseUrl}/v1/payments`
      }
    } catch (error: any) {
      logger.error('TossPay payment request failed:', error.message)
      return {
        success: false,
        orderId: request.orderId,
        amount: request.amount,
        failReason: error.message
      }
    }
  }

  async confirmPayment(paymentKey: string, orderId: string, amount: number): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/payments/confirm`,
        {
          paymentKey,
          orderId,
          amount
        },
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${this.secretKey}:`).toString('base64')}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return response.data
    } catch (error: any) {
      logger.error('TossPay payment confirmation failed:', error.response?.data || error.message)
      throw error
    }
  }

  async cancelPayment(paymentKey: string, cancelReason: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/payments/${paymentKey}/cancel`,
        {
          cancelReason
        },
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${this.secretKey}:`).toString('base64')}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return response.data
    } catch (error: any) {
      logger.error('TossPay payment cancellation failed:', error.response?.data || error.message)
      throw error
    }
  }
}

// Payment Factory
export class PaymentServiceFactory {
  static createService(method: 'KAKAOPAY' | 'TOSSPAY') {
    switch (method) {
      case 'KAKAOPAY':
        return new KakaoPayService()
      case 'TOSSPAY':
        return new TossPayService()
      default:
        throw new Error(`Unsupported payment method: ${method}`)
    }
  }
}

// 헬퍼 함수들
import { prisma } from '../index'

// 토스페이먼츠 결제 생성
export async function createTossPayment(userId: string, amount: number, orderId?: string) {
  const orderIdToUse = orderId || `toss_${Date.now()}_${userId.slice(-6)}`

  const tossService = new TossPayService()

  // Payment 레코드 생성
  const payment = await prisma.payment.create({
    data: {
      id: orderIdToUse,
      userId,
      amount,
      method: 'CARD',
      status: 'PENDING',
      orderId: orderIdToUse
    }
  })

  return {
    paymentId: payment.id,
    orderId: orderIdToUse,
    amount,
    clientKey: process.env.TOSS_PAY_CLIENT_KEY,
    successUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success`,
    failUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/fail`
  }
}

// 토스페이먼츠 결제 확인
export async function confirmTossPayment(paymentKey: string, orderId: string, amount: number, userId: string) {
  const tossService = new TossPayService()

  try {
    // 토스페이먼츠 API로 결제 확인
    const confirmResult = await tossService.confirmPayment(paymentKey, orderId, amount)

    // Payment 레코드 업데이트
    const payment = await prisma.payment.update({
      where: { id: orderId },
      data: {
        status: 'COMPLETED',
        gatewayId: paymentKey,
        gatewayData: confirmResult,
        paidAt: new Date()
      }
    })

    // 사용자 잔액 업데이트
    await prisma.user.update({
      where: { id: userId },
      data: {
        balance: { increment: amount }
      }
    })

    return { payment, confirmResult }
  } catch (error) {
    // 결제 실패 시 Payment 상태 업데이트
    await prisma.payment.update({
      where: { id: orderId },
      data: { status: 'FAILED' }
    })
    throw error
  }
}

// 카카오페이 결제 생성
export async function createKakaoPayment(userId: string, amount: number) {
  const orderId = `kakao_${Date.now()}_${userId.slice(-6)}`

  const kakaoService = new KakaoPayService()

  const paymentRequest: PaymentRequest = {
    orderId,
    amount,
    orderName: `INSTAUP 포인트 충전 ${amount.toLocaleString()}원`,
    customerName: '사용자',
    customerEmail: 'user@example.com',
    successUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/kakao/success`,
    failUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/fail`,
    cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/cancel`
  }

  const result = await kakaoService.requestPayment(paymentRequest)

  if (result.success) {
    // Payment 레코드 생성
    await prisma.payment.create({
      data: {
        id: orderId,
        userId,
        amount,
        method: 'KAKAOPAY',
        status: 'PENDING',
        orderId,
        gatewayId: result.paymentKey
      }
    })
  }

  return result
}

// 카카오페이 결제 승인
export async function confirmKakaoPayment(tid: string, pgToken: string, userId: string) {
  const kakaoService = new KakaoPayService()

  try {
    // 카카오페이 API로 결제 승인
    const approveResult = await kakaoService.approvePayment(tid, pgToken, 'orderId')

    // Payment 레코드 찾기
    const payment = await prisma.payment.findFirst({
      where: { gatewayId: tid }
    })

    if (!payment) {
      throw new Error('결제 정보를 찾을 수 없습니다.')
    }

    // Payment 레코드 업데이트
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'COMPLETED',
        gatewayData: approveResult,
        paidAt: new Date()
      }
    })

    // 사용자 잔액 업데이트
    await prisma.user.update({
      where: { id: userId },
      data: {
        balance: { increment: payment.amount }
      }
    })

    return { payment, approveResult }
  } catch (error) {
    throw error
  }
}

// 네이버페이 결제 생성 (시뮬레이션)
export async function createNaverPayment(userId: string, amount: number) {
  const orderId = `naver_${Date.now()}_${userId.slice(-6)}`

  // 네이버페이 API는 실제 키가 필요하므로 시뮬레이션
  const payment = await prisma.payment.create({
    data: {
      id: orderId,
      userId,
      amount,
      method: 'CARD',
      status: 'PENDING',
      orderId
    }
  })

  return {
    paymentId: payment.id,
    orderId,
    amount,
    approvalUrl: `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=${encodeURIComponent(process.env.FRONTEND_URL || 'http://localhost:5173')}/payment/naver/callback&state=${orderId}`,
    message: '네이버페이 결제 준비 완료'
  }
}

// 네이버페이 결제 승인 (시뮬레이션)
export async function confirmNaverPayment(orderId: string, userId: string) {
  const payment = await prisma.payment.findUnique({
    where: { id: orderId }
  })

  if (!payment) {
    throw new Error('결제 정보를 찾을 수 없습니다.')
  }

  // Payment 레코드 업데이트
  await prisma.payment.update({
    where: { id: orderId },
    data: {
      status: 'COMPLETED',
      paidAt: new Date()
    }
  })

  // 사용자 잔액 업데이트
  await prisma.user.update({
    where: { id: userId },
    data: {
      balance: { increment: payment.amount }
    }
  })

  return { payment }
}
