import type React from 'react'
import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

export interface Order {
  id: string
  userId: string
  userEmail: string
  userNickname: string
  platform: string
  service: string
  quantity: number
  originalPrice: number
  discountAmount: number
  finalPrice: number
  pointsUsed: number
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  targetUrl: string
  createdAt: string
  completedAt?: string
  notes?: string
}

export interface OrderNotification {
  id: string
  order_id: string
  message: string
  type: 'new_order' | 'order_completed' | 'order_failed'
  created_at: string
  is_read: boolean
}

interface OrderContextType {
  orders: Order[]
  notifications: OrderNotification[]
  createOrder: (orderData: Omit<Order, 'id' | 'userId' | 'userEmail' | 'userNickname' | 'createdAt'>) => Promise<Order>
  updateOrderStatus: (orderId: string, status: Order['status'], notes?: string) => void
  getUserOrders: (userId: string) => Order[]
  markNotificationAsRead: (notificationId: string) => void
  getUnreadNotificationsCount: () => number
  processAutomaticOrder: (order: Order) => Promise<void>
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export const useOrders = () => {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider')
  }
  return context
}

// Mock 자동 주문 처리 함수
const simulateExternalOrderProcessing = async (order: Order): Promise<boolean> => {
  // 실제로는 여기서 외부 API 호출 (인스타그램, 유튜브 등)
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))

  // 90% 성공률로 시뮬레이션
  return Math.random() > 0.1
}

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([])
  const [notifications, setNotifications] = useState<OrderNotification[]>([])
  const { user } = useAuth()

  // Supabase에서 주문 데이터 로드
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })

        if (!ordersError && ordersData) {
          setOrders(ordersData)
        }

        const { data: notificationsData, error: notificationsError } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })

        if (!notificationsError && notificationsData) {
          setNotifications(notificationsData)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    loadOrders()

    // 실시간 구독 설정
    const ordersSubscription = supabase
      .channel('orders')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Order change:', payload)
          loadOrders() // 데이터 다시 로드
        }
      )
      .subscribe()

    const notificationsSubscription = supabase
      .channel('notifications')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        (payload) => {
          console.log('Notification change:', payload)
          loadOrders() // 데이터 다시 로드
        }
      )
      .subscribe()

    return () => {
      ordersSubscription.unsubscribe()
      notificationsSubscription.unsubscribe()
    }
  }, [])

  // 로컬 저장소 사용 중단 - Supabase가 데이터 관리

  const createOrder = async (orderData: Omit<Order, 'id' | 'userId' | 'userEmail' | 'userNickname' | 'createdAt'>): Promise<Order> => {
    console.log('🛒 주문 생성 시작:', orderData)

    if (!user) {
      console.error('❌ 사용자가 로그인되어 있지 않습니다.')
      throw new Error('사용자가 로그인되어 있지 않습니다.')
    }

    console.log('👤 현재 사용자:', { id: user.id, email: user.email, balance: user.balance })

    // 잔액 확인
    const totalCost = orderData.finalPrice
    console.log('💰 잔액 확인:', { userBalance: user.balance, totalCost })

    if (user.balance < totalCost) {
      console.error('❌ 잔액 부족:', { required: totalCost, available: user.balance })
      throw new Error('잔액이 부족합니다.')
    }

    try {
      // Supabase에 주문 생성
      const { data: newOrderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          service_id: null, // 서비스 ID는 나중에 매핑
          platform: orderData.platform,
          service_name: orderData.service,
          quantity: orderData.quantity,
          target_url: orderData.targetUrl,
          original_price: orderData.originalPrice,
          discount_amount: orderData.discountAmount,
          final_price: orderData.finalPrice,
          points_used: orderData.pointsUsed,
          status: 'pending'
        })
        .select()
        .single()

      if (orderError) {
        throw new Error(`주문 생성 실패: ${orderError.message}`)
      }

      const newOrder: Order = {
        id: newOrderData.id,
        userId: newOrderData.user_id,
        userEmail: user.email,
        userNickname: user.nickname,
        platform: newOrderData.platform,
        service: newOrderData.service_name,
        quantity: newOrderData.quantity,
        originalPrice: newOrderData.original_price,
        discountAmount: newOrderData.discount_amount,
        finalPrice: newOrderData.final_price,
        pointsUsed: newOrderData.points_used,
        status: newOrderData.status,
        targetUrl: newOrderData.target_url,
        createdAt: newOrderData.created_at,
        notes: newOrderData.notes
      }

      // 마일리지 차감
      // await updateBalance(-totalCost) // Temporarily disabled

      // 사용자 통계 업데이트 (주문 수, 총 결제 금액)
      // await updateUserStats(totalCost) // Temporarily disabled

      // 관리자 알림 생성
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          order_id: newOrder.id,
          message: `새 주문이 들어왔습니다: ${newOrder.service} (${newOrder.platform})`,
          type: 'new_order',
          is_read: false
        })

      if (notificationError) {
        console.error('Notification creation error:', notificationError)
      }

      // 자동 주문 처리 시작
      processAutomaticOrder(newOrder)

      return newOrder
    } catch (error) {
      console.error('Order creation error:', error)
      throw error
    }
  }

  const updateOrderStatus = async (orderId: string, status: Order['status'], notes?: string) => {
    try {
      // Supabase에서 주문 상태 업데이트
      const updateData: { status: string; notes?: string; completed_at?: string } = {
        status,
        notes
      }

      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString()
      }

      const { error: updateError } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)

      if (updateError) {
        console.error('Order status update error:', updateError)
        return
      }

      // 주문 정보 가져오기 (알림용)
      const { data: orderData } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (orderData) {
        // 주문 완료/실패 알림 생성
        if (status === 'completed' || status === 'failed') {
          const { error: notificationError } = await supabase
            .from('notifications')
            .insert({
              order_id: orderId,
              message: status === 'completed'
                ? `주문이 완료되었습니다: ${orderData.service_name}`
                : `주문이 실패했습니다: ${orderData.service_name}`,
              type: status === 'completed' ? 'order_completed' : 'order_failed',
              is_read: false
            })

          if (notificationError) {
            console.error('Notification creation error:', notificationError)
          }

          // 실패 시 환불 처리
          if (status === 'failed' && user) {
            // await updateBalance(orderData.final_price) // Temporarily disabled
          }
        }
      }
    } catch (error) {
      console.error('Update order status error:', error)
    }
  }

  const processAutomaticOrder = async (order: Order) => {
    try {
      // 주문 상태를 처리 중으로 변경
      updateOrderStatus(order.id, 'processing')

      // 외부 API 호출 시뮬레이션
      const success = await simulateExternalOrderProcessing(order)

      if (success) {
        updateOrderStatus(order.id, 'completed', '자동 처리 완료')
      } else {
        updateOrderStatus(order.id, 'failed', '외부 서비스 처리 실패')
      }
    } catch (error) {
      updateOrderStatus(order.id, 'failed', '처리 중 오류 발생')
    }
  }

  const getUserOrders = (userId: string): Order[] => {
    return orders.filter(order => order.userId === userId)
  }

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

      if (error) {
        console.error('Mark notification read error:', error)
      }
    } catch (error) {
      console.error('Mark notification read error:', error)
    }
  }

  const getUnreadNotificationsCount = (): number => {
    return notifications.filter(notif => !notif.is_read).length
  }

  const value: OrderContextType = {
    orders,
    notifications,
    createOrder,
    updateOrderStatus,
    getUserOrders,
    markNotificationAsRead,
    getUnreadNotificationsCount,
    processAutomaticOrder
  }

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  )
}
