import { useEffect, useState, useCallback } from 'react'
import { io, type Socket } from 'socket.io-client'
import { useAuth } from './useAuth'

interface OrderStatus {
  orderId: string
  status: string
  progress: number
  service: string
  createdAt: string
  updatedAt: string
}

interface AdminStats {
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  todayOrders: number
  activeOrders: number
  recentOrders: Array<{
    id: string
    user: { email: string; nickname: string }
    service: { name: string; platform: string }
  }>
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: string
}

interface SocketData {
  connected: boolean
  orderStatus: OrderStatus | null
  adminStats: AdminStats | null
  notifications: Notification[]
}

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [data, setData] = useState<SocketData>({
    connected: false,
    orderStatus: null,
    adminStats: null,
    notifications: []
  })
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    // Connect to WebSocket server
    const socketInstance = io('http://localhost:3001', {
      auth: {
        token: localStorage.getItem('instaup_token')
      }
    })

    socketInstance.on('connect', () => {
      setData(prev => ({ ...prev, connected: true }))
      console.log('✅ WebSocket connected')
    })

    socketInstance.on('disconnect', () => {
      setData(prev => ({ ...prev, connected: false }))
      console.log('❌ WebSocket disconnected')
    })

    // Order status updates
    socketInstance.on('order_status', (status: OrderStatus) => {
      setData(prev => ({ ...prev, orderStatus: status }))
    })

    // Real-time notifications
    socketInstance.on('notification', (notification: Notification) => {
      setData(prev => ({
        ...prev,
        notifications: [...prev.notifications, notification]
      }))
    })

    // Admin dashboard data
    socketInstance.on('admin_stats', (stats: AdminStats) => {
      setData(prev => ({ ...prev, adminStats: stats }))
    })

    // Error handling
    socketInstance.on('error', (error: Error) => {
      console.error('Socket error:', error)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [user])

  const trackOrder = useCallback((orderId: string) => {
    if (socket?.connected) {
      socket.emit('track_order', orderId)
    }
  }, [socket])

  const requestAdminDashboard = useCallback(() => {
    if (socket?.connected) {
      socket.emit('admin_dashboard')
    }
  }, [socket])

  const sendUserActivity = useCallback((action: string, activityData?: Record<string, unknown>) => {
    if (socket?.connected) {
      socket.emit('user_activity', { action, data: activityData })
    }
  }, [socket])

  const clearNotifications = useCallback(() => {
    setData(prev => ({ ...prev, notifications: [] }))
  }, [])

  return {
    ...data,
    trackOrder,
    requestAdminDashboard,
    sendUserActivity,
    clearNotifications
  }
}
