import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useOrders } from '../contexts/OrderContext'
import ReferralSystem from './ReferralSystem'

interface UserDashboardProps {
  onClose: () => void
  onAddFunds: () => void
}

export default function UserDashboard({ onClose, onAddFunds }: UserDashboardProps) {
  const { user, logout } = useAuth()
  const { getUserOrders } = useOrders()
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'profile' | 'referral'>('overview')
  const [showReferral, setShowReferral] = useState(false)

  // 실제 주문 데이터 가져오기
  const userOrders = user ? getUserOrders(user.id) : []
  const recentOrders = userOrders.slice(0, 3) // 최근 3개 주문

  if (!user) {
    return null
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">완료</span>
      case 'processing':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">진행중</span>
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">대기</span>
      case 'failed':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">실패</span>
      case 'cancelled':
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">취소</span>
      default:
        return null
    }
  }

  const StatCard = ({ title, value, subtitle, color }: { title: string; value: string | number; subtitle?: string; color: string }) => (
    <div className={`bg-white rounded-2xl p-6 border-l-4 ${color} shadow-sm`}>
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
    </div>
  )

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Header - Toss Style */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
                  <span className="text-2xl md:text-3xl">{user.nickname.charAt(0)}</span>
                </div>
                <div>
                  <h2 className="text-xl md:text-3xl font-bold">안녕하세요, {user.nickname}님!</h2>
                  <p className="text-blue-100 mt-1 text-sm md:text-base">나만의 SNS 성장 대시보드</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-blue-100 hover:text-white text-2xl md:text-3xl w-10 h-10 md:w-12 md:h-12 rounded-2xl hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Sidebar - Mobile Optimized */}
            <div className="w-full md:w-64 bg-gray-50">
              {/* Mobile Tab Navigation */}
              <div className="md:hidden">
                <div className="flex overflow-x-auto p-4 space-x-2">
                  {[
                    { id: 'overview' as const, label: '대시보드', icon: '📊' },
                    { id: 'orders' as const, label: '주문내역', icon: '📦' },
                    { id: 'profile' as const, label: '프로필', icon: '👤' },
                    { id: 'referral' as const, label: '추천', icon: '👥' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-2xl text-xs transition-all ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-white'
                      }`}
                    >
                      <span className="text-lg mb-1">{tab.icon}</span>
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop Sidebar */}
              <div className="hidden md:block p-6">
                <div className="space-y-2">
                  {[
                    { id: 'overview' as const, label: '대시보드', icon: '📊' },
                    { id: 'orders' as const, label: '주문 내역', icon: '📦' },
                    { id: 'profile' as const, label: '프로필', icon: '👤' },
                    { id: 'referral' as const, label: '추천하기', icon: '👥' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-left transition-all ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-white hover:shadow-md'
                      }`}
                    >
                      <span className="text-xl">{tab.icon}</span>
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <span className="text-xl">🚪</span>
                    <span className="font-medium">로그아웃</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-120px)] md:max-h-[calc(90vh-140px)]">
              {activeTab === 'overview' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">계정 현황</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                      title="보유 포인트"
                      value={`${user.balance.toLocaleString()}원`}
                      subtitle="사용 가능한 포인트"
                      color="border-green-500"
                    />
                    <StatCard
                      title="총 주문 수"
                      value={user.totalOrders || 0}
                      subtitle="누적 주문 횟수"
                      color="border-blue-500"
                    />
                    <StatCard
                      title="총 결제 금액"
                      value={`${user.totalSpent.toLocaleString()}원`}
                      subtitle="누적 결제 금액"
                      color="border-purple-500"
                    />
                    <StatCard
                      title="회원 등급"
                      value="VIP"
                      subtitle="프리미엄 회원"
                      color="border-pink-500"
                    />
                  </div>

                  {/* Recent Orders */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
                    <h4 className="text-xl font-semibold mb-4">최근 주문</h4>
                    <div className="space-y-3">
                      {recentOrders.length > 0 ? (
                        recentOrders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                              <h5 className="font-medium">{order.service}</h5>
                              <p className="text-sm text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString('ko-KR')} • {order.quantity.toLocaleString()}개
                              </p>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(order.status)}
                              <p className="text-sm font-medium mt-1">{order.finalPrice.toLocaleString()}원</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <div className="text-4xl mb-2">📦</div>
                          <p>아직 주문이 없습니다</p>
                          <p className="text-sm">첫 주문을 시작해보세요!</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                      <h4 className="text-lg font-semibold mb-2">포인트 충전</h4>
                      <p className="text-purple-100 text-sm mb-4">포인트를 충전하고 더 많은 혜택을 받아보세요</p>
                      <button
                        onClick={onAddFunds}
                        className="bg-white text-purple-600 px-4 py-2 rounded-xl font-medium hover:bg-purple-50 transition-colors"
                      >
                        충전하기
                      </button>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                      <h4 className="text-lg font-semibold mb-2">새 주문</h4>
                      <p className="text-blue-100 text-sm mb-4">다양한 SNS 서비스를 주문해보세요</p>
                      <button className="bg-white text-blue-600 px-4 py-2 rounded-xl font-medium hover:bg-blue-50 transition-colors">
                        주문하기
                      </button>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
                      <h4 className="text-lg font-semibold mb-2">친구 초대</h4>
                      <p className="text-green-100 text-sm mb-4">친구를 초대하고 보상을 받아보세요</p>
                      <button
                        onClick={() => setShowReferral(true)}
                        className="bg-white text-green-600 px-4 py-2 rounded-xl font-medium hover:bg-green-50 transition-colors"
                      >
                        초대하기
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">주문 내역</h3>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                    <div className="p-6">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 font-medium text-gray-600">주문번호</th>
                              <th className="text-left py-3 font-medium text-gray-600">서비스</th>
                              <th className="text-left py-3 font-medium text-gray-600">수량</th>
                              <th className="text-left py-3 font-medium text-gray-600">금액</th>
                              <th className="text-left py-3 font-medium text-gray-600">상태</th>
                              <th className="text-left py-3 font-medium text-gray-600">날짜</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userOrders.length > 0 ? (
                              userOrders.map((order) => (
                                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                                  <td className="py-4 font-medium text-purple-600">{order.id}</td>
                                  <td className="py-4">
                                    <div>
                                      <div className="font-medium">{order.service}</div>
                                      <div className="text-gray-500 text-xs">{order.platform}</div>
                                    </div>
                                  </td>
                                  <td className="py-4">{order.quantity.toLocaleString()}개</td>
                                  <td className="py-4 font-medium">{order.finalPrice.toLocaleString()}원</td>
                                  <td className="py-4">{getStatusBadge(order.status)}</td>
                                  <td className="py-4 text-gray-600">
                                    {new Date(order.createdAt).toLocaleDateString('ko-KR')}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="py-12 text-center text-gray-500">
                                  <div className="text-4xl mb-2">📦</div>
                                  <p>주문 내역이 없습니다</p>
                                  <p className="text-sm">첫 주문을 시작해보세요!</p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">프로필 관리</h3>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          {user.nickname.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold">{user.nickname}</h4>
                          <p className="text-gray-600">{user.email}</p>
                          <p className="text-sm text-gray-500">가입일: {user.joinDate || user.createdAt?.split('T')[0]}</p>
                        </div>
                      </div>

                      <hr />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">닉네임</label>
                          <input
                            type="text"
                            value={user.nickname}
                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            readOnly
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                          <input
                            type="email"
                            value={user.email}
                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl bg-gray-50"
                            readOnly
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">휴대폰 번호</label>
                          <input
                            type="tel"
                            placeholder="010-1234-5678"
                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">생년월일</label>
                          <input
                            type="date"
                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl font-medium hover:from-purple-700 hover:to-pink-700 transition-colors">
                          프로필 수정
                        </button>
                        <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-medium hover:bg-gray-300 transition-colors">
                          비밀번호 변경
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'referral' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">친구 추천하기</h3>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-4">👥</div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">친구를 초대하고 보상받기</h4>
                      <p className="text-gray-600">친구가 가입하면 둘 다 10,000원, 첫 주문 시 추가 15,000원 보상!</p>
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={() => setShowReferral(true)}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        🎁 친구 초대하기
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showReferral && (
        <ReferralSystem onClose={() => setShowReferral(false)} />
      )}
    </>
  )
}
