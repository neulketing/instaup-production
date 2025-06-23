import type React from 'react'
import { createContext, useContext, useState, useEffect } from 'react'

export interface ServiceConfig {
  id: string
  name: string
  platform: string
  price: number
  minQuantity: number
  maxQuantity: number
  description: string
  isActive: boolean
  discountRate: number
  isPopular?: boolean
  isNew?: boolean
  category: string
  estimatedTime: string
  qualityLevel: 'standard' | 'premium' | 'ultimate'
  bulkDiscounts: BulkDiscount[]
  features: string[]
}

export interface BulkDiscount {
  minQuantity: number
  discountPercent: number
}

export interface LayoutConfig {
  heroTitle: string
  heroSubtitle: string
  primaryColor: string
  secondaryColor: string
  logoText: string
  companyName: string
  showPromotion: boolean
  promotionText: string
}

export interface OrderStats {
  totalOrders: number
  totalRevenue: number
  activeUsers: number
  completionRate: number
  dailyOrders: { date: string; orders: number; revenue: number }[]
}

interface AdminContextType {
  isAdmin: boolean
  adminLogin: (email: string, password: string) => boolean
  adminLogout: () => void
  serviceConfigs: ServiceConfig[]
  updateServiceConfig: (id: string, config: Partial<ServiceConfig>) => void
  addServiceConfig: (config: Omit<ServiceConfig, 'id'>) => void
  removeServiceConfig: (id: string) => void
  layoutConfig: LayoutConfig
  updateLayoutConfig: (config: Partial<LayoutConfig>) => void
  orderStats: OrderStats
  refreshStats: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

// Default configurations - Enhanced with Naver services
const defaultServices: ServiceConfig[] = [
  // Instagram Services - SNS샵 실제 가격 기준
  {
    id: 'instagram-followers-kr',
    name: '인스타그램 한국인 팔로워',
    platform: 'Instagram',
    category: '팔로워',
    description: '100% 실제 한국인 계정으로 안전하게 팔로워를 늘려드립니다',
    price: 150,  // SNS샵 실제 가격
    minQuantity: 100,
    maxQuantity: 10000,
    discountRate: 0,
    estimatedTime: '24~48시간',
    qualityLevel: 'ultimate',
    features: ['100% 한국인 계정', '30일 드롭 보장', '점진적 증가', '24시간 지원'],
    isActive: true,
    isPopular: true,
    isNew: false,
    bulkDiscounts: [
      { minQuantity: 500, discountPercent: 5 },
      { minQuantity: 1000, discountPercent: 10 },
      { minQuantity: 3000, discountPercent: 15 },
      { minQuantity: 5000, discountPercent: 20 }
    ]
  },
  {
    id: 'instagram-likes-kr',
    name: '인스타그램 한국인 좋아요',
    platform: 'Instagram',
    category: '좋아요',
    description: '실제 한국인이 누르는 자연스러운 좋아요',
    price: 80,  // SNS샵 실제 가격
    minQuantity: 50,
    maxQuantity: 5000,
    discountRate: 5,
    estimatedTime: '1~6시간',
    qualityLevel: 'premium',
    features: ['실제 한국인', '빠른 처리', '자연스러운 증가', '안전 보장'],
    isActive: true,
    isPopular: false,
    isNew: false,
    bulkDiscounts: [
      { minQuantity: 200, discountPercent: 8 },
      { minQuantity: 500, discountPercent: 12 },
      { minQuantity: 1000, discountPercent: 18 },
      { minQuantity: 2000, discountPercent: 25 }
    ]
  },

  // Naver Services - SNS샵 실제 가격 기준
  {
    id: 'naver-place-pageview',
    name: '네이버 플레이스 페이지뷰',
    platform: 'Naver',
    category: '플레이스 마케팅',
    description: '네이버 플레이스 노출을 증가시켜 더 많은 고객 유입을 도와드립니다',
    price: 600,  // SNS샵 실제 가격 기준
    minQuantity: 100,
    maxQuantity: 10000,
    discountRate: 0,
    estimatedTime: '1~3일',
    qualityLevel: 'premium',
    features: ['실제 한국인 방문', '지역별 타겟팅', '자연스러운 유입', '검색 노출 향상'],
    isActive: true,
    isPopular: true,
    isNew: true,
    bulkDiscounts: [
      { minQuantity: 500, discountPercent: 5 },
      { minQuantity: 1000, discountPercent: 10 },
      { minQuantity: 3000, discountPercent: 15 }
    ]
  },
  {
    id: 'naver-blog-visit',
    name: '네이버 블로그 방문자',
    platform: 'Naver',
    category: '블로그 마케팅',
    description: '네이버 블로그 방문자를 늘려 포스팅 노출과 검색 순위를 향상시킵니다',
    price: 30000,  // SNS샵 체험단 가격 기준 (30,000,000원/1000개 = 30,000원)
    minQuantity: 5,
    maxQuantity: 100,
    discountRate: 0,
    estimatedTime: '1~2일',
    qualityLevel: 'ultimate',
    features: ['실제 방문자', '체류시간 증가', 'SEO 향상', '전문 마케터 진행'],
    isActive: true,
    isPopular: false,
    isNew: false,
    bulkDiscounts: [
      { minQuantity: 20, discountPercent: 8 },
      { minQuantity: 50, discountPercent: 15 }
    ]
  },
  {
    id: 'naver-shopping-click',
    name: '네이버 쇼핑 클릭',
    platform: 'Naver',
    category: '쇼핑 마케팅',
    description: '네이버 쇼핑 상품 클릭수를 늘려 상품 노출과 판매를 증진시킵니다',
    price: 800,
    minQuantity: 50,
    maxQuantity: 5000,
    discountRate: 0,
    estimatedTime: '6~24시간',
    qualityLevel: 'premium',
    features: ['실제 클릭', '구매 전환율 향상', '상품 순위 상승', '타겟 고객 유입'],
    isActive: true,
    isPopular: true,
    isNew: false,
    bulkDiscounts: [
      { minQuantity: 200, discountPercent: 10 },
      { minQuantity: 500, discountPercent: 15 },
      { minQuantity: 1000, discountPercent: 20 }
    ]
  },
  {
    id: 'naver-jisik-recommend',
    name: '네이버 지식인 추천',
    platform: 'Naver',
    category: '지식인 마케팅',
    description: '네이버 지식인 답변 추천수를 늘려 신뢰도와 노출을 향상시킵니다',
    price: 1500,
    minQuantity: 10,
    maxQuantity: 500,
    discountRate: 0,
    estimatedTime: '6~48시간',
    qualityLevel: 'premium',
    features: ['실제 계정 추천', '답변 신뢰도 향상', '상위 노출', '브랜드 인지도 증가'],
    isActive: true,
    isPopular: false,
    isNew: false,
    bulkDiscounts: [
      { minQuantity: 30, discountPercent: 8 },
      { minQuantity: 50, discountPercent: 12 },
      { minQuantity: 100, discountPercent: 18 }
    ]
  },
  {
    id: 'naver-cafe-member',
    name: '네이버 카페 가입',
    platform: 'Naver',
    category: '카페 마케팅',
    description: '네이버 카페 회원수를 늘려 커뮤니티 활성화를 도와드립니다',
    price: 2000,
    minQuantity: 20,
    maxQuantity: 1000,
    discountRate: 0,
    estimatedTime: '1~3일',
    qualityLevel: 'premium',
    features: ['실제 계정 가입', '활동 가능한 회원', '커뮤니티 활성화', '자연스러운 증가'],
    isActive: true,
    isPopular: false,
    isNew: false,
    bulkDiscounts: [
      { minQuantity: 50, discountPercent: 5 },
      { minQuantity: 100, discountPercent: 10 },
      { minQuantity: 300, discountPercent: 15 }
    ]
  },
  {
    id: 'naver-news-view',
    name: '네이버 뉴스 조회수',
    platform: 'Naver',
    category: '뉴스 마케팅',
    description: '네이버 뉴스 기사 조회수를 늘려 이슈성과 화제성을 증대시킵니다',
    price: 10,
    minQuantity: 1000,
    maxQuantity: 100000,
    discountRate: 0,
    estimatedTime: '30분~2시간',
    qualityLevel: 'standard',
    features: ['실제 조회', '이슈 확산', '언론 주목도 증가', '빠른 확산'],
    isActive: true,
    isPopular: false,
    isNew: true,
    bulkDiscounts: [
      { minQuantity: 5000, discountPercent: 10 },
      { minQuantity: 10000, discountPercent: 15 },
      { minQuantity: 30000, discountPercent: 25 }
    ]
  },
  {
    id: 'naver-map-view',
    name: '네이버 지도 검색',
    platform: 'Naver',
    category: '지도 마케팅',
    description: '네이버 지도에서 업체 검색 노출을 증가시켜 방문 고객을 늘려드립니다',
    price: 500,
    minQuantity: 100,
    maxQuantity: 5000,
    discountRate: 0,
    estimatedTime: '6~24시간',
    qualityLevel: 'premium',
    features: ['지역별 검색', '실제 위치 기반', '방문 고객 증가', '업체 인지도 향상'],
    isActive: true,
    isPopular: true,
    isNew: false,
    bulkDiscounts: [
      { minQuantity: 300, discountPercent: 8 },
      { minQuantity: 500, discountPercent: 12 },
      { minQuantity: 1000, discountPercent: 18 }
    ]
  },

  // YouTube Services - SNS샵 실제 가격 기준
  {
    id: 'youtube-subscribers-kr',
    name: '유튜브 한국인 구독자',
    platform: 'YouTube',
    category: '구독자',
    description: '실제 한국인 계정의 구독',
    price: 300,  // SNS샵 실제 가격
    minQuantity: 100,
    maxQuantity: 5000,
    discountRate: 0,
    estimatedTime: '48~72시간',
    qualityLevel: 'ultimate',
    features: ['100% 한국인', '활성 계정', '장기 유지', '드롭 보장'],
    isActive: true,
    isPopular: true,
    isNew: false,
    bulkDiscounts: [
      { minQuantity: 250, discountPercent: 8 },
      { minQuantity: 500, discountPercent: 12 },
      { minQuantity: 1000, discountPercent: 18 },
      { minQuantity: 2000, discountPercent: 25 }
    ]
  },
  {
    id: 'youtube-views',
    name: '유튜브 조회수',
    platform: 'YouTube',
    category: '조회수',
    description: '자연스러운 조회수 증가로 알고리즘 최적화',
    price: 25,  // SNS샵 실제 가격
    minQuantity: 1000,
    maxQuantity: 100000,
    discountRate: 15,
    estimatedTime: '12~24시간',
    qualityLevel: 'standard',
    features: ['점진적 증가', '유지율 보장', '알고리즘 친화적', '실시간 처리'],
    isActive: true,
    isPopular: false,
    isNew: true,
    bulkDiscounts: [
      { minQuantity: 5000, discountPercent: 10 },
      { minQuantity: 15000, discountPercent: 15 },
      { minQuantity: 30000, discountPercent: 22 },
      { minQuantity: 50000, discountPercent: 30 }
    ]
  },

  // TikTok Services - SNS샵 실제 가격 기준
  {
    id: 'tiktok-followers',
    name: '틱톡 팔로워',
    platform: 'TikTok',
    category: '팔로워',
    description: '틱톡 알고리즘에 최적화된 팔로워',
    price: 120,  // SNS샵 실제 가격
    minQuantity: 100,
    maxQuantity: 10000,
    discountRate: 0,
    estimatedTime: '24~48시간',
    qualityLevel: 'premium',
    features: ['실제 계정', '활성 사용자', '알고리즘 최적화'],
    isActive: true,
    isPopular: true,
    isNew: false,
    bulkDiscounts: [
      { minQuantity: 500, discountPercent: 7 },
      { minQuantity: 1000, discountPercent: 12 },
      { minQuantity: 2500, discountPercent: 18 },
      { minQuantity: 5000, discountPercent: 25 }
    ]
  }
]

const defaultLayout: LayoutConfig = {
  heroTitle: '실제 한국인 팔로워로 SNS 성장하기',
  heroSubtitle: 'INSTAUP과 함께 인스타그램, 유튜브, 틱톡, 네이버 등 다양한 플랫폼에서 실제 한국인 팔로워와 좋아요를 통해 계정을 성장시키세요.',
  primaryColor: '#3b82f6', // blue-500
  secondaryColor: '#6366f1', // indigo-500
  logoText: 'INSTAUP',
  companyName: 'INSTAUP',
  showPromotion: true,
  promotionText: '🎉 신규 가입시 10,000원 적립금 + 네이버 서비스 런칭 기념 특가!'
}

const generateMockStats = (): OrderStats => {
  const today = new Date()
  const dailyOrders = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    dailyOrders.push({
      date: date.toISOString().split('T')[0],
      orders: Math.floor(Math.random() * 50) + 10,
      revenue: Math.floor(Math.random() * 500000) + 100000
    })
  }

  return {
    totalOrders: 1367,
    totalRevenue: 18750000,
    activeUsers: 423,
    completionRate: 96.2,
    dailyOrders
  }
}

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [serviceConfigs, setServiceConfigs] = useState<ServiceConfig[]>(defaultServices)
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>(defaultLayout)
  const [orderStats, setOrderStats] = useState<OrderStats>(generateMockStats())

  // Check for existing admin session
  useEffect(() => {
    const adminSession = localStorage.getItem('instaup_admin')
    if (adminSession) {
      setIsAdmin(true)
    }

    // Load saved configurations
    const savedServices = localStorage.getItem('instaup_service_configs')
    if (savedServices) {
      setServiceConfigs(JSON.parse(savedServices))
    }

    const savedLayout = localStorage.getItem('instaup_layout_config')
    if (savedLayout) {
      setLayoutConfig(JSON.parse(savedLayout))
    }
  }, [])

  const adminLogin = (email: string, password: string): boolean => {
    // Admin credentials: neulketing@gmail.com / smfzpxld1!
    if (email === 'neulketing@gmail.com' && password === 'smfzpxld1!') {
      setIsAdmin(true)
      localStorage.setItem('instaup_admin', 'true')
      localStorage.setItem('instaup_admin_email', email)
      return true
    }
    return false
  }

  const adminLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem('instaup_admin')
  }

  const updateServiceConfig = (id: string, config: Partial<ServiceConfig>) => {
    const updatedConfigs = serviceConfigs.map(service =>
      service.id === id ? { ...service, ...config } : service
    )
    setServiceConfigs(updatedConfigs)
    localStorage.setItem('instaup_service_configs', JSON.stringify(updatedConfigs))
  }

  const addServiceConfig = (config: Omit<ServiceConfig, 'id'>) => {
    const newService = {
      ...config,
      id: `service_${Date.now()}`
    }
    const updatedConfigs = [...serviceConfigs, newService]
    setServiceConfigs(updatedConfigs)
    localStorage.setItem('instaup_service_configs', JSON.stringify(updatedConfigs))
  }

  const removeServiceConfig = (id: string) => {
    const updatedConfigs = serviceConfigs.filter(service => service.id !== id)
    setServiceConfigs(updatedConfigs)
    localStorage.setItem('instaup_service_configs', JSON.stringify(updatedConfigs))
  }

  const updateLayoutConfig = (config: Partial<LayoutConfig>) => {
    const updatedConfig = { ...layoutConfig, ...config }
    setLayoutConfig(updatedConfig)
    localStorage.setItem('instaup_layout_config', JSON.stringify(updatedConfig))
  }

  const refreshStats = () => {
    setOrderStats(generateMockStats())
  }

  const value: AdminContextType = {
    isAdmin,
    adminLogin,
    adminLogout,
    serviceConfigs,
    updateServiceConfig,
    addServiceConfig,
    removeServiceConfig,
    layoutConfig,
    updateLayoutConfig,
    orderStats,
    refreshStats
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}
