import { useState } from 'react'
import { useAdmin, type ServiceConfig, type BulkDiscount } from '../contexts/AdminContext'

interface AdminPanelProps {
  onClose: () => void
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const {
    serviceConfigs,
    updateServiceConfig,
    addServiceConfig,
    removeServiceConfig,
    layoutConfig,
    updateLayoutConfig,
    orderStats,
    refreshStats
  } = useAdmin()

  const [activeTab, setActiveTab] = useState<'dashboard' | 'services' | 'layout' | 'orders'>('dashboard')

  type TabType = 'dashboard' | 'services' | 'layout' | 'orders'
  const [editingService, setEditingService] = useState<ServiceConfig | null>(null)
  const [showAddService, setShowAddService] = useState(false)

  const StatCard = ({ title, value, subtitle, color }: { title: string; value: string | number; subtitle?: string; color: string }) => (
    <div className={`bg-white rounded-2xl p-6 border-l-4 ${color}`}>
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
    </div>
  )

  const ServiceEditModal = ({ service, onSave, onCancel }: {
    service: ServiceConfig | null
    onSave: (config: ServiceConfig) => void
    onCancel: () => void
  }) => {
    const [formData, setFormData] = useState<ServiceConfig>(
      service || {
        id: '',
        name: '',
        platform: 'Instagram',
        price: 100,
        minQuantity: 100,
        maxQuantity: 10000,
        description: '',
        isActive: true,
        discountRate: 0,
        isPopular: false,
        isNew: false,
        category: '',
        estimatedTime: '',
        qualityLevel: 'standard',
        bulkDiscounts: [],
        features: []
      }
    )

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (service) {
        updateServiceConfig(service.id, formData)
      } else {
        addServiceConfig(formData)
      }
      onSave(formData)
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <h3 className="text-2xl font-bold mb-6">{service ? '서비스 편집' : '새 서비스 추가'}</h3>

            <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
              {/* 기본 정보 */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h4 className="text-lg font-semibold mb-4 text-gray-900">기본 정보</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">서비스명</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">플랫폼</label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({...formData, platform: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Instagram">Instagram</option>
                      <option value="YouTube">YouTube</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Facebook">Facebook</option>
                      <option value="X">X (Twitter)</option>
                      <option value="Threads">Threads</option>
                      <option value="Naver">Naver</option>
                      <option value="Kakao">Kakao</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="팔로워, 좋아요, 조회수 등"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">품질 등급</label>
                    <select
                      value={formData.qualityLevel}
                      onChange={(e) => setFormData({...formData, qualityLevel: e.target.value as 'standard' | 'premium' | 'ultimate'})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                      <option value="ultimate">Ultimate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">예상 처리 시간</label>
                    <input
                      type="text"
                      value={formData.estimatedTime}
                      onChange={(e) => setFormData({...formData, estimatedTime: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="24-48시간"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* 가격 및 수량 */}
              <div className="bg-blue-50 rounded-2xl p-6">
                <h4 className="text-lg font-semibold mb-4 text-gray-900">가격 및 수량</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">기본 가격 (원)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: Number.parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">기본 할인율 (%)</label>
                    <input
                      type="number"
                      value={formData.discountRate}
                      onChange={(e) => setFormData({...formData, discountRate: Number.parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="0"
                      max="99"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">최소 수량</label>
                    <input
                      type="number"
                      value={formData.minQuantity}
                      onChange={(e) => setFormData({...formData, minQuantity: Number.parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">최대 수량</label>
                    <input
                      type="number"
                      value={formData.maxQuantity}
                      onChange={(e) => setFormData({...formData, maxQuantity: Number.parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 대량 할인 설정 */}
              <div className="bg-green-50 rounded-2xl p-6">
                <h4 className="text-lg font-semibold mb-4 text-gray-900">대량 주문 할인</h4>
                <div className="space-y-4">
                  {formData.bulkDiscounts.map((discount, index) => (
                    <div key={`${discount.minQuantity}-${discount.discountPercent}-${index}`} className="flex items-center space-x-4 bg-white p-4 rounded-xl">
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">최소 수량</label>
                        <input
                          type="number"
                          value={discount.minQuantity}
                          onChange={(e) => {
                            const newDiscounts = [...formData.bulkDiscounts]
                            newDiscounts[index].minQuantity = Number.parseInt(e.target.value)
                            setFormData({...formData, bulkDiscounts: newDiscounts})
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          min="1"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">할인율 (%)</label>
                        <input
                          type="number"
                          value={discount.discountPercent}
                          onChange={(e) => {
                            const newDiscounts = [...formData.bulkDiscounts]
                            newDiscounts[index].discountPercent = Number.parseInt(e.target.value)
                            setFormData({...formData, bulkDiscounts: newDiscounts})
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          min="0"
                          max="99"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newDiscounts = formData.bulkDiscounts.filter((_, i) => i !== index)
                          setFormData({...formData, bulkDiscounts: newDiscounts})
                        }}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newDiscounts = [...formData.bulkDiscounts, { minQuantity: 100, discountPercent: 5 }]
                      setFormData({...formData, bulkDiscounts: newDiscounts})
                    }}
                    className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition-colors"
                  >
                    + 할인 단계 추가
                  </button>
                </div>
              </div>

              {/* 서비스 특징 */}
              <div className="bg-purple-50 rounded-2xl p-6">
                <h4 className="text-lg font-semibold mb-4 text-gray-900">서비스 특징</h4>
                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div key={`feature-${index}-${feature}`} className="flex items-center space-x-4 bg-white p-3 rounded-xl">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...formData.features]
                          newFeatures[index] = e.target.value
                          setFormData({...formData, features: newFeatures})
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="서비스 특징을 입력하세요"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newFeatures = formData.features.filter((_, i) => i !== index)
                          setFormData({...formData, features: newFeatures})
                        }}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({...formData, features: [...formData.features, '']})
                    }}
                    className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition-colors"
                  >
                    + 특징 추가
                  </button>
                </div>
              </div>

              {/* 상태 설정 */}
              <div className="bg-orange-50 rounded-2xl p-6">
                <h4 className="text-lg font-semibold mb-4 text-gray-900">상태 설정</h4>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">활성화</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPopular || false}
                      onChange={(e) => setFormData({...formData, isPopular: e.target.checked})}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">인기 서비스</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isNew || false}
                      onChange={(e) => setFormData({...formData, isNew: e.target.checked})}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">신규 서비스</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors"
                >
                  저장
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-2xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">관리자 패널</h2>
              <p className="text-purple-100 mt-1">시스템 설정 및 통계 관리</p>
            </div>
            <button
              onClick={onClose}
              className="text-purple-100 hover:text-white text-3xl w-12 h-12 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 p-6">
            <div className="space-y-2">
              {[
                { id: 'dashboard' as TabType, label: '대시보드', icon: '📊' },
                { id: 'services' as TabType, label: '서비스 관리', icon: '⚙️' },
                { id: 'layout' as TabType, label: '레이아웃 설정', icon: '🎨' },
                { id: 'orders' as TabType, label: '주문 관리', icon: '📦' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
            {activeTab === 'dashboard' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">통계 대시보드</h3>
                  <button
                    onClick={refreshStats}
                    className="bg-purple-600 text-white px-4 py-2 rounded-2xl hover:bg-purple-700 transition-colors"
                  >
                    새로고침
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard
                    title="총 주문수"
                    value={orderStats.totalOrders.toLocaleString()}
                    subtitle="누적 주문"
                    color="border-blue-500"
                  />
                  <StatCard
                    title="총 매출"
                    value={`${orderStats.totalRevenue.toLocaleString()}원`}
                    subtitle="누적 매출"
                    color="border-green-500"
                  />
                  <StatCard
                    title="활성 사용자"
                    value={orderStats.activeUsers.toLocaleString()}
                    subtitle="월간 활성 사용자"
                    color="border-purple-500"
                  />
                  <StatCard
                    title="완료율"
                    value={`${orderStats.completionRate}%`}
                    subtitle="주문 완료율"
                    color="border-pink-500"
                  />
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h4 className="text-xl font-semibold mb-4">일별 주문 현황</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3">날짜</th>
                          <th className="text-right py-3">주문수</th>
                          <th className="text-right py-3">매출</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderStats.dailyOrders.map((day) => (
                          <tr key={day.date} className="border-b">
                            <td className="py-3">{day.date}</td>
                            <td className="text-right py-3">{day.orders}</td>
                            <td className="text-right py-3">{day.revenue.toLocaleString()}원</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">서비스 관리</h3>
                  <button
                    onClick={() => setShowAddService(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-colors"
                  >
                    + 새 서비스 추가
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {serviceConfigs.map((service) => (
                    <div key={service.id} className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-lg font-semibold">{service.name}</h4>
                            {service.isPopular && <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">인기</span>}
                            {service.isNew && <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">NEW</span>}
                            {!service.isActive && <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">비활성</span>}
                          </div>
                          <p className="text-gray-600 text-sm">{service.platform}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingService(service)}
                            className="bg-blue-100 text-blue-600 p-2 rounded-xl hover:bg-blue-200 transition-colors"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => removeServiceConfig(service.id)}
                            className="bg-red-100 text-red-600 p-2 rounded-xl hover:bg-red-200 transition-colors"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">가격:</span>
                          <span className="ml-2 font-medium">
                            {service.discountRate > 0 ? (
                              <>
                                <span className="line-through text-gray-400">{service.price}원</span>
                                <span className="ml-1 text-red-600">
                                  {Math.floor(service.price * (1 - service.discountRate / 100))}원
                                </span>
                              </>
                            ) : (
                              `${service.price}원`
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">할인:</span>
                          <span className="ml-2 font-medium">{service.discountRate}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">최소:</span>
                          <span className="ml-2 font-medium">{service.minQuantity}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">최대:</span>
                          <span className="ml-2 font-medium">{service.maxQuantity}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">카테고리:</span>
                          <span className="ml-2 font-medium">{service.category}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">처리시간:</span>
                          <span className="ml-2 font-medium">{service.estimatedTime}</span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="text-gray-500 text-sm">품질: </span>
                        <span className={`text-sm font-medium px-2 py-1 rounded ${
                          service.qualityLevel === 'ultimate' ? 'bg-purple-100 text-purple-700' :
                          service.qualityLevel === 'premium' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {service.qualityLevel.toUpperCase()}
                        </span>
                      </div>

                      {service.bulkDiscounts && service.bulkDiscounts.length > 0 && (
                        <div className="mb-3">
                          <span className="text-gray-500 text-sm">대량할인: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {service.bulkDiscounts.map((discount, idx) => (
                              <span key={`${discount.minQuantity}-${discount.discountPercent}`} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                {discount.minQuantity}+ → {discount.discountPercent}%
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-gray-600 text-sm">{service.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'layout' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">레이아웃 설정</h3>

                <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">메인 제목</label>
                    <input
                      type="text"
                      value={layoutConfig.heroTitle}
                      onChange={(e) => updateLayoutConfig({ heroTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">서브 제목</label>
                    <textarea
                      value={layoutConfig.heroSubtitle}
                      onChange={(e) => updateLayoutConfig({ heroSubtitle: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">메인 컬러</label>
                      <input
                        type="color"
                        value={layoutConfig.primaryColor}
                        onChange={(e) => updateLayoutConfig({ primaryColor: e.target.value })}
                        className="w-full h-12 border border-gray-300 rounded-2xl"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">서브 컬러</label>
                      <input
                        type="color"
                        value={layoutConfig.secondaryColor}
                        onChange={(e) => updateLayoutConfig({ secondaryColor: e.target.value })}
                        className="w-full h-12 border border-gray-300 rounded-2xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={layoutConfig.showPromotion}
                        onChange={(e) => updateLayoutConfig({ showPromotion: e.target.checked })}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">프로모션 배너 표시</span>
                    </label>
                  </div>

                  {layoutConfig.showPromotion && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">프로모션 텍스트</label>
                      <input
                        type="text"
                        value={layoutConfig.promotionText}
                        onChange={(e) => updateLayoutConfig({ promotionText: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">주문 관리</h3>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <p className="text-gray-600">주문 관리 시스템이 곧 추가됩니다.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Service Edit Modal */}
        {(editingService || showAddService) && (
          <ServiceEditModal
            service={editingService}
            onSave={() => {
              setEditingService(null)
              setShowAddService(false)
            }}
            onCancel={() => {
              setEditingService(null)
              setShowAddService(false)
            }}
          />
        )}
      </div>
    </div>
  )
}
