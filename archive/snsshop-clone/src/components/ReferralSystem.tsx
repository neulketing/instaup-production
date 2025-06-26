import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import apiService from '../services/api'

interface ReferralSystemProps {
  onClose: () => void
}

interface ReferralStats {
  id: string
  userId: string
  directReferrals: number
  activeReferrals: number
  level2Referrals: number
  level3Referrals: number
  totalCommission: number
  thisMonthCommission: number
  pendingCommission: number
  totalOrders: number
  conversionRate: number
  updatedAt: string
}

interface ReferralRecord {
  id: string
  referredId: string
  level: number
  status: string
  isSignupRewarded: boolean
  isFirstOrderRewarded: boolean
  totalCommission: number
  totalOrders: number
  createdAt: string
  referred: {
    id: string
    email: string
    nickname: string
    createdAt: string
  }
  commissions: Array<{
    id: string
    amount: number
    type: string
    status: string
    createdAt: string
    order: {
      id: string
      finalPrice: number
      service: {
        name: string
        platform: string
      }
    }
  }>
}

interface Commission {
  id: string
  amount: number
  rate: number
  type: string
  status: string
  createdAt: string
  paidAt?: string
  referral: {
    referred: {
      nickname: string
    }
  }
  order: {
    id: string
    finalPrice: number
    service: {
      name: string
      platform: string
    }
  }
}

export default function ReferralSystem({ onClose }: ReferralSystemProps) {
  const { user } = useAuth()
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [referrals, setReferrals] = useState<ReferralRecord[]>([])
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'commissions'>('overview')
  const [referralCode, setReferralCode] = useState('')
  const [referralLink, setReferralLink] = useState('')
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [loading, setLoading] = useState(true)
  const [commissionsFilter, setCommissionsFilter] = useState<'ALL' | 'PENDING' | 'PAID'>('ALL')

  useEffect(() => {
    loadReferralData()
  }, [])

  const loadReferralData = async () => {
    try {
      setLoading(true)

      // 병렬로 데이터 로드
      const [statsRes, codeRes, referralsRes, commissionsRes] = await Promise.all([
        apiService.request('/referral/stats'),
        apiService.request('/referral/code'),
        apiService.request('/referral/history?limit=50'),
        apiService.request('/referral/commissions?limit=50')
      ])

      if (statsRes.success) setStats(statsRes.data)
      if (codeRes.success) {
        setReferralCode(codeRes.data.referralCode)
        setReferralLink(codeRes.data.referralLink)
      }
      if (referralsRes.success) setReferrals(referralsRes.data.referrals)
      if (commissionsRes.success) setCommissions(commissionsRes.data.commissions)

    } catch (error) {
      console.error('Failed to load referral data:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, type: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'code') {
        setCopiedCode(true)
        setTimeout(() => setCopiedCode(false), 2000)
      } else {
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2000)
      }
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const claimCommissions = async () => {
    try {
      const pendingCommissionIds = commissions
        .filter(c => c.status === 'PENDING')
        .map(c => c.id)

      if (pendingCommissionIds.length === 0) {
        alert('지급 받을 수 있는 커미션이 없습니다.')
        return
      }

      const response = await apiService.request('/referral/claim', {
        method: 'POST',
        body: JSON.stringify({ commissionIds: pendingCommissionIds })
      })

      if (response.success) {
        alert(`${response.data.totalAmount.toLocaleString()}원의 커미션이 지급되었습니다!`)
        loadReferralData() // 데이터 새로고침
      }
    } catch (error) {
      alert('커미션 지급 중 오류가 발생했습니다.')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'PENDING': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '대기중' },
      'ACTIVE': { bg: 'bg-green-100', text: 'text-green-800', label: '활성' },
      'INACTIVE': { bg: 'bg-gray-100', text: 'text-gray-800', label: '비활성' },
      'BLOCKED': { bg: 'bg-red-100', text: 'text-red-800', label: '차단' },
      'PAID': { bg: 'bg-blue-100', text: 'text-blue-800', label: '지급완료' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const getCommissionTypeLabel = (type: string) => {
    const typeLabels = {
      'SIGNUP_BONUS': '가입 보너스',
      'FIRST_ORDER_BONUS': '첫 주문 보너스',
      'ORDER_COMMISSION': '주문 커미션',
      'LEVEL2_COMMISSION': '2단계 커미션',
      'LEVEL3_COMMISSION': '3단계 커미션'
    }
    return typeLabels[type as keyof typeof typeLabels] || type
  }

  const filteredCommissions = commissions.filter(c =>
    commissionsFilter === 'ALL' || c.status === commissionsFilter
  )

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22426f] mx-auto"></div>
          <p className="text-center mt-4">추천인 데이터 로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">추천인 시스템</h2>
              <p className="text-gray-600">친구를 추천하고 3단계 다단계 커미션을 받으세요!</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl w-12 h-12 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                <h3 className="text-sm font-medium text-blue-100 mb-2">직접 추천</h3>
                <p className="text-3xl font-bold">{stats.directReferrals}명</p>
                <p className="text-sm text-blue-100">활성: {stats.activeReferrals}명</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                <h3 className="text-sm font-medium text-green-100 mb-2">다단계 추천</h3>
                <p className="text-3xl font-bold">{stats.level2Referrals + stats.level3Referrals}명</p>
                <p className="text-sm text-green-100">2단계: {stats.level2Referrals}명 | 3단계: {stats.level3Referrals}명</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                <h3 className="text-sm font-medium text-purple-100 mb-2">총 수익</h3>
                <p className="text-3xl font-bold">{stats.totalCommission.toLocaleString()}원</p>
                <p className="text-sm text-purple-100">이번 달: {stats.thisMonthCommission.toLocaleString()}원</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                <h3 className="text-sm font-medium text-orange-100 mb-2">대기 보상</h3>
                <p className="text-3xl font-bold">{stats.pendingCommission.toLocaleString()}원</p>
                <div className="mt-2">
                  <button
                    onClick={claimCommissions}
                    disabled={stats.pendingCommission === 0}
                    className="bg-white text-orange-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    지급받기
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-xl">
            {[
              { id: 'overview', label: '개요', icon: '📊' },
              { id: 'referrals', label: '추천 내역', icon: '👥' },
              { id: 'commissions', label: '커미션 내역', icon: '💰' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white shadow-sm text-[#22426f]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Referral Tools */}
              <div className="space-y-6">
                {/* Referral Code */}
                <div className="bg-gradient-to-r from-[#22426f] to-blue-700 rounded-2xl p-6 text-white">
                  <h3 className="text-xl font-semibold mb-4">나만의 추천인 코드</h3>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex-1 bg-white/20 rounded-xl p-4 backdrop-blur">
                      <code className="text-lg font-mono text-white">{referralCode}</code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(referralCode, 'code')}
                      className="bg-white/20 backdrop-blur text-white px-4 py-3 rounded-xl hover:bg-white/30 transition-colors"
                    >
                      {copiedCode ? '✓' : '📋'}
                    </button>
                  </div>
                  <p className="text-sm text-blue-100">
                    친구가 이 코드로 가입하면 둘 다 10,000원 보너스!
                  </p>
                </div>

                {/* Referral Link */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                  <h3 className="text-xl font-semibold mb-4">추천 링크 공유</h3>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex-1 bg-white/20 rounded-xl p-4 backdrop-blur">
                      <div className="text-sm text-white break-all">{referralLink}</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(referralLink, 'link')}
                      className="bg-white/20 backdrop-blur text-white px-4 py-3 rounded-xl hover:bg-white/30 transition-colors"
                    >
                      {copiedLink ? '✓' : '🔗'}
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-white/20 backdrop-blur text-white px-3 py-2 rounded-lg text-sm hover:bg-white/30 transition-colors">
                      카카오톡
                    </button>
                    <button className="bg-white/20 backdrop-blur text-white px-3 py-2 rounded-lg text-sm hover:bg-white/30 transition-colors">
                      페이스북
                    </button>
                    <button className="bg-white/20 backdrop-blur text-white px-3 py-2 rounded-lg text-sm hover:bg-white/30 transition-colors">
                      인스타그램
                    </button>
                  </div>
                </div>

                {/* Commission Structure */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">커미션 구조</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <span className="font-medium text-purple-600">1단계 (직접 추천)</span>
                        <p className="text-sm text-gray-600">주문 금액의 5% 커미션</p>
                      </div>
                      <span className="text-lg font-bold text-purple-600">5%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <span className="font-medium text-blue-600">2단계 (간접 추천)</span>
                        <p className="text-sm text-gray-600">주문 금액의 3% 커미션</p>
                      </div>
                      <span className="text-lg font-bold text-blue-600">3%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <span className="font-medium text-green-600">3단계 (추가 보상)</span>
                        <p className="text-sm text-gray-600">주문 금액의 2% 커미션</p>
                      </div>
                      <span className="text-lg font-bold text-green-600">2%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* How it Works */}
              <div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-xl font-semibold mb-6 text-gray-900">추천 시스템 안내</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-[#22426f] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                      <div>
                        <h4 className="font-medium text-gray-900">친구 초대</h4>
                        <p className="text-sm text-gray-600">추천 코드나 링크를 친구에게 공유하세요</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-[#22426f] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                      <div>
                        <h4 className="font-medium text-gray-900">가입 보상</h4>
                        <p className="text-sm text-gray-600">친구가 가입하면 둘 다 10,000원 보너스 즉시 지급</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-[#22426f] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                      <div>
                        <h4 className="font-medium text-gray-900">첫 주문 보너스</h4>
                        <p className="text-sm text-gray-600">첫 주문 완료 시 추가 15,000원 보상</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-[#22426f] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                      <div>
                        <h4 className="font-medium text-gray-900">지속적 커미션</h4>
                        <p className="text-sm text-gray-600">친구의 모든 주문에서 평생 커미션 획득</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-[#22426f] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
                      <div>
                        <h4 className="font-medium text-gray-900">다단계 보상</h4>
                        <p className="text-sm text-gray-600">친구가 추천한 사람들의 주문에서도 커미션 획득</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'referrals' && (
            <div>
              <h3 className="text-2xl font-semibold mb-6">추천 내역</h3>
              <div className="space-y-4">
                {referrals.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👥</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">추천 내역이 없습니다</h4>
                    <p className="text-gray-600">친구들을 초대하고 커미션을 받아보세요!</p>
                  </div>
                ) : (
                  referrals.map((referral) => (
                    <div key={referral.id} className="bg-white rounded-2xl p-6 border border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{referral.referred.nickname}</h4>
                          <p className="text-sm text-gray-500">{referral.referred.email}</p>
                          <p className="text-xs text-gray-400">
                            가입일: {new Date(referral.referred.createdAt).toLocaleDateString('ko-KR')}
                          </p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(referral.status)}
                          <p className="text-sm text-green-600 font-semibold mt-1">
                            +{referral.totalCommission.toLocaleString()}원
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">단계:</span>
                          <span className="ml-1 font-medium">{referral.level}단계</span>
                        </div>
                        <div>
                          <span className="text-gray-500">주문 수:</span>
                          <span className="ml-1 font-medium">{referral.totalOrders}회</span>
                        </div>
                        <div>
                          <span className="text-gray-500">커미션 수:</span>
                          <span className="ml-1 font-medium">{referral.commissions.length}건</span>
                        </div>
                      </div>
                      {referral.commissions.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">최근 커미션</h5>
                          <div className="space-y-2">
                            {referral.commissions.slice(0, 3).map((commission) => (
                              <div key={commission.id} className="flex justify-between text-xs">
                                <span className="text-gray-600">
                                  {getCommissionTypeLabel(commission.type)} - {commission.order.service.name}
                                </span>
                                <span className="font-medium text-green-600">
                                  +{commission.amount.toLocaleString()}원
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'commissions' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">커미션 내역</h3>
                <div className="flex space-x-2">
                  {['ALL', 'PENDING', 'PAID'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setCommissionsFilter(filter as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        commissionsFilter === filter
                          ? 'bg-[#22426f] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {filter === 'ALL' ? '전체' : filter === 'PENDING' ? '대기중' : '지급완료'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredCommissions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💰</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">커미션 내역이 없습니다</h4>
                    <p className="text-gray-600">친구들이 주문하면 커미션을 받을 수 있습니다!</p>
                  </div>
                ) : (
                  filteredCommissions.map((commission) => (
                    <div key={commission.id} className="bg-white rounded-2xl p-6 border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {getCommissionTypeLabel(commission.type)}
                            </h4>
                            {getStatusBadge(commission.status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            추천인: {commission.referral.referred.nickname}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            서비스: {commission.order.service.name} ({commission.order.service.platform})
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(commission.createdAt).toLocaleDateString('ko-KR')}
                            {commission.paidAt && ` | 지급일: ${new Date(commission.paidAt).toLocaleDateString('ko-KR')}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            +{commission.amount.toLocaleString()}원
                          </div>
                          <div className="text-sm text-gray-500">
                            {(commission.rate * 100).toFixed(1)}% 커미션
                          </div>
                          <div className="text-xs text-gray-400">
                            주문금액: {commission.order.finalPrice.toLocaleString()}원
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
