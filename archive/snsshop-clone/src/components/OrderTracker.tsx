import { useState, useEffect } from 'react'
import { useSocket } from '../hooks/useSocket'

interface OrderTrackerProps {
  orderId: string
  onClose: () => void
}

export default function OrderTracker({ orderId, onClose }: OrderTrackerProps) {
  const { trackOrder, orderStatus, connected } = useSocket()
  const [isTracking, setIsTracking] = useState(false)

  useEffect(() => {
    if (connected && orderId) {
      setIsTracking(true)
      trackOrder(orderId)
    }
  }, [connected, orderId, trackOrder])

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return '주문 대기'
      case 'PAYMENT_PENDING': return '결제 대기'
      case 'PAYMENT_COMPLETED': return '결제 완료'
      case 'PROCESSING': return '작업 준비'
      case 'IN_PROGRESS': return '작업 진행중'
      case 'COMPLETED': return '작업 완료'
      case 'CANCELLED': return '주문 취소'
      case 'REFUNDED': return '환불 완료'
      default: return '상태 확인중'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'PAYMENT_PENDING': return 'text-yellow-600 bg-yellow-50'
      case 'PAYMENT_COMPLETED':
      case 'PROCESSING': return 'text-blue-600 bg-blue-50'
      case 'IN_PROGRESS': return 'text-purple-600 bg-purple-50'
      case 'COMPLETED': return 'text-green-600 bg-green-50'
      case 'CANCELLED':
      case 'REFUNDED': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const steps = [
    { key: 'PENDING', label: '주문 접수', icon: '📝' },
    { key: 'PAYMENT_COMPLETED', label: '결제 완료', icon: '💳' },
    { key: 'PROCESSING', label: '작업 준비', icon: '⚙️' },
    { key: 'IN_PROGRESS', label: '작업 진행', icon: '🚀' },
    { key: 'COMPLETED', label: '완료', icon: '✅' }
  ]

  const getCurrentStepIndex = () => {
    if (!orderStatus) return -1
    return steps.findIndex(step => step.key === orderStatus.status)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">주문 추적</h2>
              <p className="text-gray-600 mt-1">실시간으로 주문 상태를 확인하세요</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl w-10 h-10 rounded-2xl hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>

          {/* Connection Status */}
          <div className="mb-6">
            <div className={`inline-flex items-center px-3 py-2 rounded-2xl text-sm font-medium ${
              connected ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                connected ? 'bg-green-500' : 'bg-gray-400'
              }`} />
              {connected ? '실시간 연결됨' : '연결 중...'}
            </div>
          </div>

          {/* Order Info */}
          {orderStatus && (
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{orderStatus.service}</h3>
                  <p className="text-sm text-gray-600 mt-1">주문번호: {orderStatus.orderId}</p>
                </div>
                <div className={`px-3 py-2 rounded-2xl text-sm font-medium ${getStatusColor(orderStatus.status)}`}>
                  {getStatusText(orderStatus.status)}
                </div>
              </div>

              {/* Progress Bar */}
              {orderStatus.status === 'IN_PROGRESS' && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>진행률</span>
                    <span>{orderStatus.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${orderStatus.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">주문일시</span>
                  <p className="text-gray-900 mt-1">{new Date(orderStatus.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-500">최근 업데이트</span>
                  <p className="text-gray-900 mt-1">{new Date(orderStatus.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Process Steps */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">진행 단계</h4>
            <div className="space-y-3">
              {steps.map((step, index) => {
                const currentIndex = getCurrentStepIndex()
                const isCompleted = index <= currentIndex
                const isCurrent = index === currentIndex

                return (
                  <div
                    key={step.key}
                    className={`flex items-center p-4 rounded-2xl transition-colors ${
                      isCompleted
                        ? isCurrent
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-green-50 border border-green-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-medium mr-4 ${
                      isCompleted
                        ? isCurrent
                          ? 'bg-blue-600 text-white'
                          : 'bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {isCompleted && !isCurrent ? '✓' : index + 1}
                    </div>
                    <div className="flex-1">
                      <h5 className={`font-medium ${
                        isCompleted ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </h5>
                      {isCurrent && (
                        <p className="text-sm text-blue-600 mt-1">현재 진행 중</p>
                      )}
                    </div>
                    <div className="text-lg">
                      {step.icon}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Auto Refresh Notice */}
          <div className="mt-8 p-4 bg-blue-50 rounded-2xl">
            <div className="flex items-center text-blue-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse" />
              <span className="text-sm">실시간으로 업데이트됩니다</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
