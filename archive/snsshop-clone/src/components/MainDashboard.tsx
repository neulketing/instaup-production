import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import OrderForm from './OrderForm'
import TopUpModal from './TopUpModal'
import ReferralSystem from './ReferralSystem'
import MobileBottomNav from './MobileBottomNav'

interface ServiceCategory {
  id: string
  name: string
  icon: string
  color: string
  services: Service[]
  isPopular?: boolean
  isNew?: boolean
}

interface Service {
  id: string
  name: string
  platform: string
  price: number
  minQuantity: number
  maxQuantity: number
  description: string
  estimatedTime: string
  isPopular?: boolean
}

const serviceCategories: ServiceCategory[] = [
  {
    id: 'instagram',
    name: '인스타그램',
    icon: '📷',
    color: 'from-pink-500 to-purple-600',
    isPopular: true,
    services: [
      {
        id: 'ig-followers',
        name: '팔로워',
        platform: 'INSTAGRAM',
        price: 100,
        minQuantity: 10,
        maxQuantity: 10000,
        description: '100% 실제 한국인 팔로워',
        estimatedTime: '1-3시간',
        isPopular: true
      },
      {
        id: 'ig-likes',
        name: '좋아요',
        platform: 'INSTAGRAM',
        price: 50,
        minQuantity: 10,
        maxQuantity: 5000,
        description: '즉시 시작되는 좋아요',
        estimatedTime: '즉시-30분'
      }
    ]
  },
  {
    id: 'youtube',
    name: '유튜브',
    icon: '📺',
    color: 'from-red-500 to-red-600',
    services: [
      {
        id: 'yt-views',
        name: '조회수',
        platform: 'YOUTUBE',
        price: 30,
        minQuantity: 100,
        maxQuantity: 100000,
        description: '고품질 조회수',
        estimatedTime: '1-6시간'
      },
      {
        id: 'yt-subscribers',
        name: '구독자',
        platform: 'YOUTUBE',
        price: 200,
        minQuantity: 10,
        maxQuantity: 5000,
        description: '실제 구독자',
        estimatedTime: '1-3일'
      }
    ]
  },
  {
    id: 'tiktok',
    name: '틱톡',
    icon: '🎵',
    color: 'from-black to-gray-800',
    isNew: true,
    services: [
      {
        id: 'tt-views',
        name: '조회수',
        platform: 'TIKTOK',
        price: 20,
        minQuantity: 100,
        maxQuantity: 50000,
        description: '바이럴 조회수',
        estimatedTime: '30분-2시간'
      }
    ]
  }
]

export default function MainDashboard() {
  const { user, refreshUser, logout } = useAuth()
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [showReferralModal, setShowReferralModal] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [activeTab, setActiveTab] = useState('home')
  const [stats, setStats] = useState({
    totalOrders: 27147423,
    totalUsers: 248207,
    completedOrders: 25799451,
    todayOrders: 1247
  })

  useEffect(() => {
    // 애니메이션을 위한 숫자 카운트업 효과
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        todayOrders: prev.todayOrders + Math.floor(Math.random() * 3)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setShowOrderForm(true)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)

    // Handle specific tab actions
    switch (tab) {
      case 'orders':
        setShowOrderForm(true)
        break
      case 'wallet':
        setShowTopUpModal(true)
        break
      case 'referral':
        setShowReferralModal(true)
        break
      default:
        break
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeContent()
      case 'profile':
        return renderProfileContent()
      default:
        return renderHomeContent()
    }
  }

  const renderHomeContent = () => (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          안녕하세요, {user?.nickname}님! 👋
        </h1>
        <p className="text-gray-600">오늘도 SNS를 성장시켜보세요</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Main Balance Card */}
        <div className="md:col-span-2">
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-blue-100 text-sm font-medium">보유 잔액</p>
                <p className="text-4xl font-bold mt-1">
                  {user?.balance.toLocaleString()}원
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
                <span className="text-2xl">💰</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowTopUpModal(true)}
                className="flex-1 bg-white/20 backdrop-blur border border-white/30 text-white py-3 px-4 rounded-xl font-medium hover:bg-white/30 transition-all"
              >
                충전하기
              </button>
              <button
                onClick={() => setShowReferralModal(true)}
                className="flex-1 bg-white text-purple-600 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-all"
              >
                친구 추천
              </button>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 text-sm">총 사용액</span>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {user?.totalSpent.toLocaleString()}원
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 text-sm">서버 상태</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm font-medium text-green-600">모든 서비스 정상 운영중</p>
            <p className="text-xs text-gray-400 mt-1">마지막 확인: 방금 전</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: '⚡', label: '빠른 주문', color: 'from-yellow-400 to-orange-500', action: () => setShowOrderForm(true) },
          { icon: '💎', label: '프리미엄', color: 'from-purple-500 to-pink-500', action: () => {} },
          { icon: '🎯', label: '맞춤 추천', color: 'from-green-500 to-teal-500', action: () => {} },
          { icon: '📞', label: '1:1 상담', color: 'from-blue-500 to-indigo-500', action: () => {} }
        ].map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className={`bg-gradient-to-br ${item.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
          >
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className="font-semibold text-sm">{item.label}</div>
          </button>
        ))}
      </div>

      {/* Service Categories */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">서비스 카테고리</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            전체보기 →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center text-white text-xl`}>
                  {category.icon}
                </div>
                <div className="flex space-x-1">
                  {category.isPopular && (
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                      인기
                    </span>
                  )}
                  {category.isNew && (
                    <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
                      NEW
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {category.services.length}개 서비스 이용 가능
              </p>

              <div className="space-y-2">
                {category.services.slice(0, 2).map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group-hover:bg-blue-50"
                  >
                    <div className="text-left">
                      <div className="font-medium text-gray-900 text-sm">{service.name}</div>
                      <div className="text-gray-500 text-xs">{service.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600 text-sm">
                        {service.price}원
                      </div>
                      <div className="text-gray-400 text-xs">
                        최소 {service.minQuantity}개
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {category.services.length > 2 && (
                <button className="w-full mt-3 py-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
                  +{category.services.length - 2}개 더보기
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">최근 활동</h3>
        <div className="space-y-4">
          {[
            { icon: '🎉', title: '가입 축하 보너스', desc: '10,000원 지급 완료', time: '방금 전', color: 'green' },
            { icon: '👥', title: '친구 추천 성공', desc: '김철수님이 가입했어요', time: '1시간 전', color: 'blue' },
            { icon: '📈', title: '주문 완료', desc: '인스타그램 팔로워 100명', time: '2시간 전', color: 'purple' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                {activity.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{activity.title}</div>
                <div className="text-gray-600 text-sm">{activity.desc}</div>
              </div>
              <div className="text-gray-400 text-xs">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )

  const renderProfileContent = () => (
    <>
      {/* Profile Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold backdrop-blur">
              {user?.nickname.charAt(0)}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold">{user?.nickname}</h2>
              <p className="text-blue-100">{user?.email}</p>
              <p className="text-blue-100 text-sm">가입일: {new Date(user?.createdAt || '').toLocaleDateString('ko-KR')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: '보유 잔액', value: `${user?.balance.toLocaleString()}원`, icon: '💰', color: 'green' },
          { label: '총 사용액', value: `${user?.totalSpent.toLocaleString()}원`, icon: '📊', color: 'blue' },
          { label: '주문 수', value: '0건', icon: '📦', color: 'purple' },
          { label: '등급', value: '일반', icon: '⭐', color: 'yellow' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-lg font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Profile Actions */}
      <div className="space-y-4 mb-8">
        {[
          { icon: '🎯', title: '추천인 대시보드', desc: '친구 추천하고 수익 올리기', action: () => setShowReferralModal(true) },
          { icon: '📋', title: '주문 내역', desc: '지금까지의 주문 내역 확인', action: () => setShowOrderForm(true) },
          { icon: '💳', title: '잔액 충전', desc: '포인트 충전하고 서비스 이용하기', action: () => setShowTopUpModal(true) },
          { icon: '⚙️', title: '설정', desc: '계정 설정 및 개인정보 수정', action: () => {} },
          { icon: '📞', title: '고객 지원', desc: '1:1 문의 및 도움말', action: () => {} },
          { icon: '🚪', title: '로그아웃', desc: '계정에서 안전하게 로그아웃', action: logout }
        ].map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl mr-4">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{item.title}</div>
                <div className="text-gray-600 text-sm">{item.desc}</div>
              </div>
              <div className="text-gray-400">→</div>
            </div>
          </button>
        ))}
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">I</span>
              </div>
              <span className="text-xl font-bold text-gray-900">INSTAUP</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{stats.totalOrders.toLocaleString()}</div>
                  <div className="text-gray-500">총 주문</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{stats.totalUsers.toLocaleString()}</div>
                  <div className="text-gray-500">총 회원</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-600">{stats.todayOrders.toLocaleString()}</div>
                  <div className="text-gray-500">오늘 주문</div>
                </div>
              </div>

              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                {user?.nickname.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            안녕하세요, {user?.nickname}님! 👋
          </h1>
          <p className="text-gray-600">오늘도 SNS를 성장시켜보세요</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Main Balance Card */}
          <div className="md:col-span-2">
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-blue-100 text-sm font-medium">보유 잔액</p>
                  <p className="text-4xl font-bold mt-1">
                    {user?.balance.toLocaleString()}원
                  </p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
                  <span className="text-2xl">💰</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowTopUpModal(true)}
                  className="flex-1 bg-white/20 backdrop-blur border border-white/30 text-white py-3 px-4 rounded-xl font-medium hover:bg-white/30 transition-all"
                >
                  충전하기
                </button>
                <button
                  onClick={() => setShowReferralModal(true)}
                  className="flex-1 bg-white text-purple-600 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-all"
                >
                  친구 추천
                </button>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 text-sm">총 사용액</span>
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {user?.totalSpent.toLocaleString()}원
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 text-sm">서버 상태</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-sm font-medium text-green-600">모든 서비스 정상 운영중</p>
              <p className="text-xs text-gray-400 mt-1">마지막 확인: 방금 전</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: '⚡', label: '빠른 주문', color: 'from-yellow-400 to-orange-500', action: () => setShowOrderForm(true) },
            { icon: '💎', label: '프리미엄', color: 'from-purple-500 to-pink-500', action: () => {} },
            { icon: '🎯', label: '맞춤 추천', color: 'from-green-500 to-teal-500', action: () => {} },
            { icon: '📞', label: '1:1 상담', color: 'from-blue-500 to-indigo-500', action: () => {} }
          ].map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className={`bg-gradient-to-br ${item.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="font-semibold text-sm">{item.label}</div>
            </button>
          ))}
        </div>

        {/* Service Categories */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">서비스 카테고리</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              전체보기 →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center text-white text-xl`}>
                    {category.icon}
                  </div>
                  <div className="flex space-x-1">
                    {category.isPopular && (
                      <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                        인기
                      </span>
                    )}
                    {category.isNew && (
                      <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
                        NEW
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {category.services.length}개 서비스 이용 가능
                </p>

                <div className="space-y-2">
                  {category.services.slice(0, 2).map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceSelect(service)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group-hover:bg-blue-50"
                    >
                      <div className="text-left">
                        <div className="font-medium text-gray-900 text-sm">{service.name}</div>
                        <div className="text-gray-500 text-xs">{service.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600 text-sm">
                          {service.price}원
                        </div>
                        <div className="text-gray-400 text-xs">
                          최소 {service.minQuantity}개
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {category.services.length > 2 && (
                  <button className="w-full mt-3 py-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
                    +{category.services.length - 2}개 더보기
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">최근 활동</h3>
          <div className="space-y-4">
            {[
              { icon: '🎉', title: '가입 축하 보너스', desc: '10,000원 지급 완료', time: '방금 전', color: 'green' },
              { icon: '👥', title: '친구 추천 성공', desc: '김철수님이 가입했어요', time: '1시간 전', color: 'blue' },
              { icon: '📈', title: '주문 완료', desc: '인스타그램 팔로워 100명', time: '2시간 전', color: 'purple' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{activity.title}</div>
                  <div className="text-gray-600 text-sm">{activity.desc}</div>
                </div>
                <div className="text-gray-400 text-xs">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showOrderForm && (
        <OrderForm
          onClose={() => {
            setShowOrderForm(false)
            setSelectedService(null)
          }}
          userBalance={user?.balance || 0}
          onBalanceUpdate={refreshUser}
          preselectedService={selectedService}
        />
      )}

      {showTopUpModal && (
        <TopUpModal
          isOpen={showTopUpModal}
          onClose={() => setShowTopUpModal(false)}
          onSuccess={() => {
            refreshUser()
            setShowTopUpModal(false)
          }}
          currentBalance={user?.balance || 0}
        />
      )}

      {showReferralModal && (
        <ReferralSystem
          onClose={() => setShowReferralModal(false)}
        />
      )}
    </div>
  )
}
