let redis: any = null

// Redis 연결 시도 (선택적)
try {
  if (process.env.REDIS_URL) {
    const Redis = require('redis')
    redis = Redis.createClient({
      url: process.env.REDIS_URL
    })

    redis.on('connect', () => {
      console.log('✅ Redis connected successfully')
    })

    redis.on('error', (error: Error) => {
      console.error('❌ Redis connection failed:', error.message)
    })
  } else {
    console.log('ℹ️ Redis URL not provided, using memory storage')
  }
} catch (error) {
  console.log('ℹ️ Redis not available, using memory storage')
}

export default redis
