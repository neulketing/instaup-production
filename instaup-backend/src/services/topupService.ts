import { prisma } from '../config/database'
import { TopUpStatus, PaymentMethod, PaymentStatus } from '@prisma/client'
import { retryPendingOrders } from './orderService'
import { sendAdminNotification } from '../utils/notifications'

export async function topUpBalance(userId: string, amount: number) {
  if (amount <= 0) throw new Error('충전 금액은 0보다 커야 합니다.')

  try {
    const topupResult = await prisma.$transaction(async (tx) => {
      // create topup record
      const topup = await tx.topUp.create({
        data: { userId, amount, status: TopUpStatus.SUCCESS }
      })

      // increase user balance
      await tx.user.update({
        where: { id: userId },
        data: { balance: { increment: amount } }
      })

      // create payment record (method: POINTS -> topup).
      await tx.payment.create({
        data: {
          orderId: topup.id, // not linked to order, but we need unique; using topup id
          userId,
          amount,
          method: PaymentMethod.BANK_TRANSFER,
          status: PaymentStatus.COMPLETED
        }
      })

      return topup
    })

    // after topup, try to complete pending orders
    const retryResult = await retryPendingOrders()

    // send success notification
    await sendAdminNotification({
      type: 'topup_success',
      userId,
      amount
    })

    return {
      topup: topupResult,
      retriedOrders: retryResult
    }
  } catch (error) {
    // send failure notification
    await sendAdminNotification({
      type: 'topup_failed',
      userId,
      error: String(error)
    })
    throw error
  }
}
