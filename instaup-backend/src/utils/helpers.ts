import { prisma } from '../config/database'

export const generateReferralCode = async (): Promise<string> => {
  let code: string
  let isUnique = false

  while (!isUnique) {
    code = Math.random().toString(36).substring(2, 10).toUpperCase()

    const existingUser = await prisma.user.findFirst({
      where: { referralCode: code }
    })

    if (!existingUser) {
      isUnique = true
      return code
    }
  }

  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const formatKoreanCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount)
}

export const generateOrderId = (): string => {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8)
  return `ORD-${timestamp}-${random}`.toUpperCase()
}

export const calculateBulkDiscount = (quantity: number, basePrice: number): number => {
  let discountRate = 0

  if (quantity >= 10000) discountRate = 0.15
  else if (quantity >= 5000) discountRate = 0.10
  else if (quantity >= 1000) discountRate = 0.05

  return basePrice * (1 - discountRate)
}

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}

export const isValidKoreanPhone = (phone: string): boolean => {
  const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/
  return phoneRegex.test(phone)
}

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
