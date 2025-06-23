import { useState, useEffect } from 'react'

interface ServerStatusProps {
  compact?: boolean
}

export default function ServerStatusMonitor({ compact = false }: ServerStatusProps) {
  const [status, setStatus] = useState('online')
  const [lastCheck, setLastCheck] = useState(new Date())

  useEffect(() => {
    const checkStatus = () => {
      // 서버 상태 시뮬레이션
      const isOnline = Math.random() > 0.05 // 95% 정상
      setStatus(isOnline ? 'online' : 'slow')
      setLastCheck(new Date())
    }

    checkStatus()
    const interval = setInterval(checkStatus, 30000) // 30초마다 체크

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'slow': return 'bg-yellow-500'
      default: return 'bg-red-500'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'online': return '모든 서비스 정상 가동중'
      case 'slow': return '일부 서비스 지연 중'
      default: return '서비스 점검 중'
    }
  }

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`}></div>
        <span className="text-sm text-gray-600">{getStatusText()}</span>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">서버 상태</h3>
        <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`}></div>
      </div>

      <p className="text-gray-700 mb-2">{getStatusText()}</p>
      <p className="text-xs text-gray-500">
        마지막 확인: {lastCheck.toLocaleTimeString('ko-KR')}
      </p>
    </div>
  )
}
