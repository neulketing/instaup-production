import { Request, Response, NextFunction } from 'express'

const requests = new Map()

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown'
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 100

  if (!requests.has(ip)) {
    requests.set(ip, { count: 1, resetTime: now + windowMs })
    return next()
  }

  const client = requests.get(ip)

  if (now > client.resetTime) {
    client.count = 1
    client.resetTime = now + windowMs
    return next()
  }

  if (client.count >= maxRequests) {
    return res.status(429).json({
      success: false,
      error: '너무 많은 요청입니다. 잠시 후 다시 시도해주세요.'
    })
  }

  client.count++
  next()
}
