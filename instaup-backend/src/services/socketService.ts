import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import { logger } from '../utils/logger'
import { prisma } from '../index'

interface SocketUser {
  id: string
  email: string
  isAdmin?: boolean
}

interface AuthenticatedSocket extends Socket {
  user?: SocketUser
}

import { Socket } from 'socket.io'

export function initializeSocket(io: Server) {
  // store io instance for broadcasting
  (global as any).ioServer = io
  // Authentication middleware for socket connections
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token

      if (!token) {
        return next(new Error('Authentication error: No token provided'))
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      })

      if (!user) {
        return next(new Error('Authentication error: User not found'))
      }

      socket.user = {
        id: user.id,
        email: user.email
      }

      logger.info(`User ${user.email} connected via WebSocket`)
      next()
    } catch (error) {
      logger.error('Socket authentication error:', error)
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.user?.id

    if (userId) {
      // Join user-specific room
      socket.join(`user:${userId}`)

      // Join admin room if user is admin
      socket.join('admins')
    }

    // Handle order status requests
    socket.on('track_order', async (orderId: string) => {
      try {
        if (!userId) return

        const order = await prisma.order.findFirst({
          where: {
            id: orderId,
            userId: userId
          },
          include: {
            service: true
          }
        })

        if (order) {
          socket.emit('order_status', {
            orderId: order.id,
            status: order.status,
            progress: order.progress,
            service: order.service.name,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
          })
        }
      } catch (error) {
        logger.error('Error tracking order:', error)
        socket.emit('error', { message: 'Failed to track order' })
      }
    })

    // Handle admin requests
    socket.on('admin_dashboard', async () => {
      try {
        if (!userId) return

        // Check if user is admin
        const admin = await prisma.admin.findUnique({
          where: { email: socket.user?.email }
        })

        if (!admin) {
          socket.emit('error', { message: 'Access denied' })
          return
        }

        // Get real-time stats
        const stats = await getAdminStats()
        socket.emit('admin_stats', stats)
      } catch (error) {
        logger.error('Error getting admin dashboard:', error)
        socket.emit('error', { message: 'Failed to get admin data' })
      }
    })

    // Handle user activity tracking
    socket.on('user_activity', async (activity: { action: string; data?: any }) => {
      try {
        if (!userId) return

        await prisma.userActivity.create({
          data: {
            userId: userId,
            action: activity.action,
            data: activity.data,
            ipAddress: socket.handshake.address,
            userAgent: socket.handshake.headers['user-agent']
          }
        })
      } catch (error) {
        logger.error('Error tracking user activity:', error)
      }
    })

    socket.on('disconnect', () => {
      logger.info(`User ${socket.user?.email} disconnected from WebSocket`)
    })
  })

  return io
}

// Utility functions for broadcasting updates
export function broadcastOrderUpdate(io: Server, orderId: string, update: any) {
  io.to(`order:${orderId}`).emit('order_update', update)
  io.to('admins').emit('admin_order_update', { orderId, ...update })
}

export function broadcastUserNotification(io: Server, userId: string, notification: any) {
  io.to(`user:${userId}`).emit('notification', notification)
}

export function broadcastAdminAlert(io: Server, alert: any) {
  io.to('admins').emit('admin_alert', alert)
}

// Get admin statistics
async function getAdminStats() {
  const [
    totalUsers,
    totalOrders,
    totalRevenue,
    todayOrders,
    activeOrders,
    recentOrders
  ] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.payment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true }
    }),
    prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    }),
    prisma.order.count({
      where: {
        status: {
          in: ['PROCESSING', 'IN_PROGRESS']
        }
      }
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { email: true, nickname: true }
        },
        service: {
          select: { name: true, platform: true }
        }
      }
    })
  ])

  return {
    totalUsers,
    totalOrders,
    totalRevenue: totalRevenue._sum.amount || 0,
    todayOrders,
    activeOrders,
    recentOrders
  }
}
