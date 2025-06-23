import type React from 'react'
import { useState } from 'react'
import { useOrders, type Order, type OrderNotification } from '../contexts/OrderContext'
import { useAuth } from '../hooks/useAuth'
import { useAdmin } from '../contexts/AdminContext'

const OrderDashboard: React.FC = () => {
  const { orders, notifications, updateOrderStatus, markNotificationAsRead, getUnreadNotificationsCount } = useOrders()
  const { user } = useAuth()
  const { isAdmin } = useAdmin()
  const isAdminMode = isAdmin
  const [selectedTab, setSelectedTab] = useState<'orders' | 'notifications'>('orders')
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all')

  // 사용자별 주문 필터링
  const displayOrders = isAdminMode
    ? orders
    : orders.filter(order => order.userId === user?.id)

  const filteredOrders = statusFilter === 'all'
    ? displayOrders
    : displayOrders.filter(order => order.status === statusFilter)

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'failed': return 'bg-red-100 text-red-800 border-red-200'
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '대기중'
      case 'processing': return '처리중'
      case 'completed': return '완료'
      case 'failed': return '실패'
      case 'cancelled': return '취소'
      default: return status
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isAdminMode ? '주문 관리' : '내 주문'}
          </h1>
          <p className="text-gray-600">
            {isAdminMode ? '모든 주문을 관리하고 모니터링할 수 있습니다.' : '주문 내역과 상태를 확인할 수 있습니다.'}
          </p>
        </div>

        {/* 탭 메뉴 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
          <div className="flex">
            <button
              onClick={() => setSelectedTab('orders')}
              className={`flex-1 py-4 px-6 text-center font-medium rounded-l-2xl transition-colors ${
                selectedTab === 'orders'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              주문 내역
            </button>
            {isAdminMode && (
              <button
                onClick={() => setSelectedTab('notifications')}
                className={`flex-1 py-4 px-6 text-center font-medium rounded-r-2xl transition-colors relative ${
                  selectedTab === 'notifications'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                알림
                {getUnreadNotificationsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getUnreadNotificationsCount()}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {selectedTab === 'orders' && (
          <>
            {/* 필터 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-wrap gap-2">
                {['all', 'pending', 'processing', 'completed', 'failed', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status as typeof statusFilter)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      statusFilter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'all' ? '전체' : getStatusText(status as Order['status'])}
                  </button>
                ))}
              </div>
            </div>

            {/* 주문 목록 */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                  <div className="text-gray-400 text-6xl mb-4">📦</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">주문이 없습니다</h3>
                  <p className="text-gray-500">첫 주문을 시작해보세요!</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {order.platform} - {order.service}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          {isAdminMode && (
                            <p className="text-sm text-gray-600 mb-1">
                              주문자: {order.userNickname} ({order.userEmail})
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            주문일: {formatDate(order.createdAt)}
                          </p>
                          {order.completedAt && (
                            <p className="text-sm text-gray-600">
                              완료일: {formatDate(order.completedAt)}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {formatPrice(order.finalPrice)}원
                          </div>
                          <div className="text-sm text-gray-500">
                            수량: {order.quantity.toLocaleString()}개
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">대상 URL:</span>
                            <div className="text-blue-600 break-all mt-1">{order.targetUrl}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">결제 정보:</span>
                            <div className="mt-1">
                              <div>원가: {formatPrice(order.originalPrice)}원</div>
                              {order.discountAmount > 0 && (
                                <div className="text-green-600">할인: -{formatPrice(order.discountAmount)}원</div>
                              )}
                              {order.pointsUsed > 0 && (
                                <div className="text-blue-600">포인트 사용: -{formatPrice(order.pointsUsed)}원</div>
                              )}
                            </div>
                          </div>
                        </div>

                        {order.notes && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-500 text-sm">메모:</span>
                            <div className="text-gray-700 text-sm mt-1">{order.notes}</div>
                          </div>
                        )}

                        {isAdminMode && (
                          <div className="mt-4 flex gap-2">
                            {order.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'processing')}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                >
                                  처리 시작
                                </button>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                  className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                                >
                                  취소
                                </button>
                              </>
                            )}
                            {order.status === 'processing' && (
                              <>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'completed')}
                                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                >
                                  완료 처리
                                </button>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'failed')}
                                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                >
                                  실패 처리
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {selectedTab === 'notifications' && isAdminMode && (
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">🔔</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">알림이 없습니다</h3>
                <p className="text-gray-500">새로운 주문이 들어오면 알림을 받을 수 있습니다.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-2xl shadow-sm border overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${
                    notification.is_read ? 'border-gray-200' : 'border-blue-200 bg-blue-50'
                  }`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-2xl">
                            {notification.type === 'new_order' && '📦'}
                            {notification.type === 'order_completed' && '✅'}
                            {notification.type === 'order_failed' && '❌'}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {notification.message}
                          </h3>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {formatDate(notification.created_at)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          주문 ID: {notification.order_id}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderDashboard
