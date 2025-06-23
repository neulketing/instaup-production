import type { Request } from 'express'

// 기본 타입 정의
export interface User {
  id: string
  email: string
  nickname: string
  password: string
  balance: number
  totalSpent: number
  referralCode: string
  isActive: boolean
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Service {
  id: string
  name: string
  description: string
  platform: string
  category: string
  price: number
  minQuantity: number
  maxQuantity: number
  isActive: boolean
  estimatedTime: string
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  userId: string
  serviceId: string
  quantity: number
  targetUrl: string
  status: OrderStatus
  totalPrice: number
  createdAt: Date
  updatedAt: Date
}

export interface Payment {
  id: string
  orderId: string
  userId: string
  method: PaymentMethod
  amount: number
  status: PaymentStatus
  transactionId?: string
  createdAt: Date
  updatedAt: Date
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum PaymentMethod {
  KAKAOPAY = 'kakaopay',
  TOSSPAY = 'tosspay',
  CREDIT_CARD = 'credit_card',
  BALANCE = 'balance'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginationOptions {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Request extensions
export interface AuthenticatedRequest extends Request {
  user?: User
}
