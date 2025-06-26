// 확장된 서비스 데이터 구조 (SNS Shop 분석 기반)

export interface Service {
  id: string
  name: string
  platform: Platform
  category: ServiceCategory
  subCategory?: string
  description: string
  price: number
  minQuantity: number
  maxQuantity: number
  discountRate?: number
  estimatedTime: string
  qualityLevel: QualityLevel
  features: string[]
  isActive: boolean
  isPopular?: boolean
  isNew?: boolean
  isFeatured?: boolean
  isRecommended?: boolean
  tags: string[]
  guideUrl?: string
  thumbnailUrl?: string
}

export enum Platform {
  INSTAGRAM = 'INSTAGRAM',
  YOUTUBE = 'YOUTUBE',
  FACEBOOK = 'FACEBOOK',
  TIKTOK = 'TIKTOK',
  X = 'X', // 트위터/X
  THREADS = 'THREADS', // 메타 스레드
  KAKAO = 'KAKAO',
  NAVER = 'NAVER', // 네이버 포털
  LINKEDIN = 'LINKEDIN',
  PINTEREST = 'PINTEREST',
  SNAPCHAT = 'SNAPCHAT',
  DISCORD = 'DISCORD',
  TELEGRAM = 'TELEGRAM',
  TWITCH = 'TWITCH',
  GENERAL = 'GENERAL' // 일반/기타
}

export enum ServiceCategory {
  RECOMMEND = 'RECOMMEND', // 추천서비스
  FOLLOWERS = 'FOLLOWERS', // 팔로워
  LIKES = 'LIKES', // 좋아요
  VIEWS = 'VIEWS', // 조회수
  COMMENTS = 'COMMENTS', // 댓글
  SHARES = 'SHARES', // 공유
  SUBSCRIBERS = 'SUBSCRIBERS', // 구독자
  TOP_EXPOSURE = 'TOP_EXPOSURE', // 상위노출
  ACCOUNT_MGMT = 'ACCOUNT_MGMT', // 계정관리
  PACKAGE = 'PACKAGE', // 패키지
  EVENT = 'EVENT', // 이벤트
  STORE_MARKETING = 'STORE_MARKETING', // 스토어마케팅
  APP_MARKETING = 'APP_MARKETING', // 어플마케팅
  BRAND_MARKETING = 'BRAND_MARKETING', // 브랜드마케팅
  SEO_TRAFFIC = 'SEO_TRAFFIC', // SEO트래픽
  NEWS_MEDIA = 'NEWS_MEDIA', // 뉴스언론보도
  LIVE_STREAMING = 'LIVE_STREAMING', // 라이브스트리밍
  STORY_HIGHLIGHT = 'STORY_HIGHLIGHT', // 스토리하이라이트
  REELS_SHORTS = 'REELS_SHORTS', // 릴스/쇼츠
  PREMIUM = 'PREMIUM', // 프리미엄
  OTHER = 'OTHER' // 기타
}

export enum QualityLevel {
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  ULTIMATE = 'ULTIMATE',
  VIP = 'VIP'
}

export enum ServerStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  MAINTENANCE = 'MAINTENANCE',
  SLOW = 'SLOW',
  ERROR = 'ERROR'
}

// 플랫폼별 설정
export const PLATFORM_CONFIG = {
  [Platform.INSTAGRAM]: {
    name: '인스타그램',
    icon: '📷',
    color: 'from-pink-500 to-purple-600',
    description: '세계 1위 사진 SNS',
    serverStatus: ServerStatus.ONLINE,
    categories: [ServiceCategory.FOLLOWERS, ServiceCategory.LIKES, ServiceCategory.VIEWS, ServiceCategory.COMMENTS, ServiceCategory.STORY_HIGHLIGHT, ServiceCategory.REELS_SHORTS]
  },
  [Platform.YOUTUBE]: {
    name: '유튜브',
    icon: '📺',
    color: 'from-red-500 to-red-600',
    description: '글로벌 동영상 플랫폼',
    serverStatus: ServerStatus.ONLINE,
    categories: [ServiceCategory.SUBSCRIBERS, ServiceCategory.VIEWS, ServiceCategory.LIKES, ServiceCategory.COMMENTS, ServiceCategory.LIVE_STREAMING]
  },
  [Platform.FACEBOOK]: {
    name: '페이스북',
    icon: '👥',
    color: 'from-blue-600 to-blue-700',
    description: '세계 최대 소셜 네트워크',
    serverStatus: ServerStatus.ONLINE,
    categories: [ServiceCategory.FOLLOWERS, ServiceCategory.LIKES, ServiceCategory.SHARES, ServiceCategory.COMMENTS]
  },
  [Platform.TIKTOK]: {
    name: '틱톡',
    icon: '🎵',
    color: 'from-black to-gray-800',
    description: '글로벌 숏폼 비디오 플랫폼',
    serverStatus: ServerStatus.ONLINE,
    categories: [ServiceCategory.FOLLOWERS, ServiceCategory.LIKES, ServiceCategory.VIEWS, ServiceCategory.SHARES]
  },
  [Platform.X]: {
    name: '트위터(X)',
    icon: '🐦',
    color: 'from-gray-800 to-black',
    description: '실시간 소통 플랫폼',
    serverStatus: ServerStatus.ONLINE,
    categories: [ServiceCategory.FOLLOWERS, ServiceCategory.LIKES, ServiceCategory.SHARES, ServiceCategory.VIEWS]
  },
  [Platform.THREADS]: {
    name: '스레드',
    icon: '🧵',
    color: 'from-purple-600 to-indigo-600',
    description: '메타의 텍스트 기반 SNS',
    serverStatus: ServerStatus.ONLINE,
    categories: [ServiceCategory.FOLLOWERS, ServiceCategory.LIKES, ServiceCategory.SHARES]
  },
  [Platform.KAKAO]: {
    name: '카카오',
    icon: '💬',
    color: 'from-yellow-400 to-yellow-500',
    description: '국내 대표 메신저 플랫폼',
    serverStatus: ServerStatus.ONLINE,
    categories: [ServiceCategory.FOLLOWERS, ServiceCategory.LIKES, ServiceCategory.SHARES]
  },
  [Platform.NAVER]: {
    name: '네이버',
    icon: '🟢',
    color: 'from-green-500 to-green-600',
    description: '국내 최대 포털 사이트',
    serverStatus: ServerStatus.ONLINE,
    categories: [ServiceCategory.SEO_TRAFFIC, ServiceCategory.TOP_EXPOSURE, ServiceCategory.NEWS_MEDIA]
  }
}

// 서비스 카테고리별 설정
export const CATEGORY_CONFIG = {
  [ServiceCategory.RECOMMEND]: {
    name: '추천서비스',
    icon: '⭐',
    description: '큐레이션된 추천 서비스',
    color: 'from-yellow-400 to-orange-500'
  },
  [ServiceCategory.FOLLOWERS]: {
    name: '팔로워',
    icon: '👥',
    description: '실제 활성 팔로워 증가',
    color: 'from-blue-500 to-cyan-500'
  },
  [ServiceCategory.LIKES]: {
    name: '좋아요',
    icon: '❤️',
    description: '자연스러운 좋아요 증가',
    color: 'from-red-500 to-pink-500'
  },
  [ServiceCategory.VIEWS]: {
    name: '조회수',
    icon: '👁️',
    description: '고품질 조회수 증가',
    color: 'from-green-500 to-emerald-500'
  },
  [ServiceCategory.SUBSCRIBERS]: {
    name: '구독자',
    icon: '📺',
    description: '진짜 구독자 확보',
    color: 'from-red-500 to-red-600'
  },
  [ServiceCategory.PACKAGE]: {
    name: '패키지',
    icon: '📦',
    description: '최고 할인 패키지 상품',
    color: 'from-purple-500 to-indigo-600'
  },
  [ServiceCategory.EVENT]: {
    name: '이벤트',
    icon: '🎉',
    description: '특가 이벤트 서비스',
    color: 'from-pink-500 to-rose-500'
  },
  [ServiceCategory.TOP_EXPOSURE]: {
    name: '상위노출',
    icon: '📈',
    description: '검색 상위 노출 서비스',
    color: 'from-emerald-500 to-teal-500'
  },
  [ServiceCategory.PREMIUM]: {
    name: '프리미엄',
    icon: '💎',
    description: '최고급 프리미엄 서비스',
    color: 'from-violet-500 to-purple-600'
  }
}

// 확장된 서비스 데이터
export const SERVICES: Service[] = [
  // 인스타그램 서비스
  {
    id: 'ig_followers_kr',
    name: '인스타그램 팔로워 (한국인)',
    platform: Platform.INSTAGRAM,
    category: ServiceCategory.FOLLOWERS,
    description: '100% 실제 한국인 팔로워, 계정 안전 보장',
    price: 100,
    minQuantity: 10,
    maxQuantity: 10000,
    estimatedTime: '1-3시간',
    qualityLevel: QualityLevel.PREMIUM,
    features: ['실제 한국인 계정', '즉시 시작', '계정 안전', '평생 보장'],
    isActive: true,
    isPopular: true,
    isRecommended: true,
    tags: ['인스타그램', '팔로워', '한국인', '안전']
  },
  {
    id: 'ig_likes_instant',
    name: '인스타그램 좋아요 (즉시)',
    platform: Platform.INSTAGRAM,
    category: ServiceCategory.LIKES,
    description: '게시물 업로드 후 즉시 좋아요 증가',
    price: 50,
    minQuantity: 10,
    maxQuantity: 5000,
    estimatedTime: '즉시-30분',
    qualityLevel: QualityLevel.STANDARD,
    features: ['즉시 시작', '자연스러운 증가', '고품질 계정'],
    isActive: true,
    tags: ['인스타그램', '좋아요', '즉시']
  },
  {
    id: 'ig_reels_views',
    name: '인스타그램 릴스 조회수',
    platform: Platform.INSTAGRAM,
    category: ServiceCategory.REELS_SHORTS,
    description: '릴스 영상 조회수 급속 증가',
    price: 30,
    minQuantity: 100,
    maxQuantity: 100000,
    estimatedTime: '30분-2시간',
    qualityLevel: QualityLevel.PREMIUM,
    features: ['고품질 조회수', '빠른 시작', '알고리즘 최적화'],
    isActive: true,
    isNew: true,
    tags: ['인스타그램', '릴스', '조회수']
  },

  // 유튜브 서비스
  {
    id: 'yt_subscribers_kr',
    name: '유튜브 구독자 (한국인)',
    platform: Platform.YOUTUBE,
    category: ServiceCategory.SUBSCRIBERS,
    description: '실제 한국인 구독자, 활성도 높은 계정',
    price: 200,
    minQuantity: 10,
    maxQuantity: 5000,
    estimatedTime: '1-3일',
    qualityLevel: QualityLevel.PREMIUM,
    features: ['실제 한국인', '활성 계정', '장기 유지', '댓글 활동'],
    isActive: true,
    isPopular: true,
    tags: ['유튜브', '구독자', '한국인']
  },
  {
    id: 'yt_views_premium',
    name: '유튜브 조회수 (프리미엄)',
    platform: Platform.YOUTUBE,
    category: ServiceCategory.VIEWS,
    description: '고품질 조회수, 시청시간 최적화',
    price: 20,
    minQuantity: 100,
    maxQuantity: 1000000,
    estimatedTime: '1-6시간',
    qualityLevel: QualityLevel.PREMIUM,
    features: ['고품질 조회수', '시청시간 증가', '지역 타겟팅'],
    isActive: true,
    tags: ['유튜브', '조회수', '프리미엄']
  },

  // 틱톡 서비스 (NEW)
  {
    id: 'tt_followers_global',
    name: '틱톡 팔로워 (글로벌)',
    platform: Platform.TIKTOK,
    category: ServiceCategory.FOLLOWERS,
    description: '전세계 활성 사용자 팔로워',
    price: 80,
    minQuantity: 10,
    maxQuantity: 50000,
    estimatedTime: '2-6시간',
    qualityLevel: QualityLevel.STANDARD,
    features: ['글로벌 팔로워', '빠른 증가', '안정적 유지'],
    isActive: true,
    isNew: true,
    tags: ['틱톡', '팔로워', '글로벌']
  },
  {
    id: 'tt_views_viral',
    name: '틱톡 조회수 (바이럴)',
    platform: Platform.TIKTOK,
    category: ServiceCategory.VIEWS,
    description: '바이럴 효과를 위한 초고속 조회수',
    price: 15,
    minQuantity: 100,
    maxQuantity: 100000,
    estimatedTime: '30분-2시간',
    qualityLevel: QualityLevel.PREMIUM,
    features: ['초고속 증가', '바이럴 효과', '알고리즘 부스트'],
    isActive: true,
    isPopular: true,
    tags: ['틱톡', '조회수', '바이럴']
  },
  {
    id: 'tt_likes_instant',
    name: '틱톡 좋아요 (즉시)',
    platform: Platform.TIKTOK,
    category: ServiceCategory.LIKES,
    description: '영상 업로드 후 즉시 좋아요 폭증',
    price: 25,
    minQuantity: 10,
    maxQuantity: 10000,
    estimatedTime: '즉시-1시간',
    qualityLevel: QualityLevel.STANDARD,
    features: ['즉시 시작', '자연스러운 패턴', '고품질'],
    isActive: true,
    isNew: true,
    tags: ['틱톡', '좋아요', '즉시']
  },

  // 페이스북 서비스 (NEW)
  {
    id: 'fb_page_likes',
    name: '페이스북 페이지 좋아요',
    platform: Platform.FACEBOOK,
    category: ServiceCategory.LIKES,
    description: '페이지 팬 증가, 신뢰도 향상',
    price: 90,
    minQuantity: 10,
    maxQuantity: 10000,
    estimatedTime: '2-8시간',
    qualityLevel: QualityLevel.STANDARD,
    features: ['실제 계정', '지역 타겟팅', '안전한 증가'],
    isActive: true,
    tags: ['페이스북', '페이지', '좋아요']
  },
  {
    id: 'fb_followers',
    name: '페이스북 팔로워',
    platform: Platform.FACEBOOK,
    category: ServiceCategory.FOLLOWERS,
    description: '개인 계정 또는 페이지 팔로워 증가',
    price: 85,
    minQuantity: 10,
    maxQuantity: 15000,
    estimatedTime: '1-6시간',
    qualityLevel: QualityLevel.STANDARD,
    features: ['활성 계정', '빠른 증가', '안전 보장'],
    isActive: true,
    tags: ['페이스북', '팔로워']
  },

  // 트위터(X) 서비스 (NEW)
  {
    id: 'x_followers',
    name: '트위터(X) 팔로워',
    platform: Platform.X,
    category: ServiceCategory.FOLLOWERS,
    description: '실시간 소통을 위한 팔로워 증가',
    price: 95,
    minQuantity: 10,
    maxQuantity: 20000,
    estimatedTime: '1-4시간',
    qualityLevel: QualityLevel.PREMIUM,
    features: ['활성 사용자', '실시간 증가', '오가닉 패턴'],
    isActive: true,
    isNew: true,
    tags: ['트위터', 'X', '팔로워']
  },
  {
    id: 'x_likes',
    name: '트위터(X) 좋아요',
    platform: Platform.X,
    category: ServiceCategory.LIKES,
    description: '트윗 참여도 및 가시성 증가',
    price: 40,
    minQuantity: 10,
    maxQuantity: 5000,
    estimatedTime: '30분-2시간',
    qualityLevel: QualityLevel.STANDARD,
    features: ['즉시 시작', '자연스러운 증가'],
    isActive: true,
    tags: ['트위터', 'X', '좋아요']
  },

  // 패키지 상품 (NEW)
  {
    id: 'package_instagram_starter',
    name: '인스타그램 스타터 패키지',
    platform: Platform.INSTAGRAM,
    category: ServiceCategory.PACKAGE,
    description: '팔로워 + 좋아요 + 조회수 완벽 패키지',
    price: 45000,
    minQuantity: 1,
    maxQuantity: 10,
    discountRate: 30,
    estimatedTime: '1-5일',
    qualityLevel: QualityLevel.ULTIMATE,
    features: ['팔로워 500명', '좋아요 1000개', '릴스 조회수 10,000회', '30% 할인'],
    isActive: true,
    isFeatured: true,
    isPopular: true,
    tags: ['패키지', '인스타그램', '올인원', '할인']
  },
  {
    id: 'package_youtube_growth',
    name: '유튜브 성장 패키지',
    platform: Platform.YOUTUBE,
    category: ServiceCategory.PACKAGE,
    description: '구독자 + 조회수 + 좋아요 성장 패키지',
    price: 85000,
    minQuantity: 1,
    maxQuantity: 5,
    discountRate: 25,
    estimatedTime: '3-7일',
    qualityLevel: QualityLevel.ULTIMATE,
    features: ['구독자 200명', '조회수 50,000회', '좋아요 2,000개', '25% 할인'],
    isActive: true,
    isFeatured: true,
    tags: ['패키지', '유튜브', '성장', '할인']
  },
  {
    id: 'package_tiktok_viral',
    name: '틱톡 바이럴 패키지',
    platform: Platform.TIKTOK,
    category: ServiceCategory.PACKAGE,
    description: '바이럴을 위한 완벽한 틱톡 패키지',
    price: 35000,
    minQuantity: 1,
    maxQuantity: 15,
    discountRate: 35,
    estimatedTime: '1-3일',
    qualityLevel: QualityLevel.PREMIUM,
    features: ['팔로워 300명', '조회수 100,000회', '좋아요 5,000개', '35% 할인'],
    isActive: true,
    isFeatured: true,
    isNew: true,
    tags: ['패키지', '틱톡', '바이럴', '할인']
  },

  // 이벤트 상품 (NEW)
  {
    id: 'event_weekend_special',
    name: '주말 특가 이벤트',
    platform: Platform.GENERAL,
    category: ServiceCategory.EVENT,
    description: '주말 한정! 모든 서비스 50% 할인',
    price: 1000,
    minQuantity: 1,
    maxQuantity: 1000,
    discountRate: 50,
    estimatedTime: '즉시',
    qualityLevel: QualityLevel.PREMIUM,
    features: ['50% 할인', '주말 한정', '전 서비스 적용'],
    isActive: true,
    isFeatured: true,
    isNew: true,
    tags: ['이벤트', '할인', '주말특가']
  },
  {
    id: 'event_new_year',
    name: '신년 런칭 이벤트',
    platform: Platform.GENERAL,
    category: ServiceCategory.EVENT,
    description: '2024년 신년 기념 특별 할인',
    price: 5000,
    minQuantity: 1,
    maxQuantity: 500,
    discountRate: 40,
    estimatedTime: '즉시',
    qualityLevel: QualityLevel.PREMIUM,
    features: ['40% 할인', '신년 한정', '선착순 500명'],
    isActive: true,
    isFeatured: true,
    tags: ['이벤트', '신년', '특가']
  },

  // 프리미엄 서비스 (NEW)
  {
    id: 'premium_celebrity_package',
    name: '셀럽 프리미엄 패키지',
    platform: Platform.GENERAL,
    category: ServiceCategory.PREMIUM,
    description: '연예인급 SNS 관리 서비스',
    price: 500000,
    minQuantity: 1,
    maxQuantity: 5,
    estimatedTime: '7-14일',
    qualityLevel: QualityLevel.VIP,
    features: ['전담 매니저', '24시간 관리', '맞춤 전략', 'VIP 지원'],
    isActive: true,
    isFeatured: true,
    tags: ['프리미엄', 'VIP', '셀럽', '전담관리']
  },
  {
    id: 'premium_business_solution',
    name: '비즈니스 프리미엄 솔루션',
    platform: Platform.GENERAL,
    category: ServiceCategory.PREMIUM,
    description: '기업용 SNS 마케팅 솔루션',
    price: 300000,
    minQuantity: 1,
    maxQuantity: 10,
    estimatedTime: '5-10일',
    qualityLevel: QualityLevel.VIP,
    features: ['멀티 플랫폼', '분석 리포트', '마케팅 컨설팅'],
    isActive: true,
    tags: ['프리미엄', '비즈니스', '기업용']
  },

  // SEO 및 포털 서비스
  {
    id: 'naver_blog_traffic',
    name: '네이버 블로그 트래픽',
    platform: Platform.NAVER,
    category: ServiceCategory.SEO_TRAFFIC,
    description: '네이버 검색 상위 노출 및 트래픽 증가',
    price: 300,
    minQuantity: 100,
    maxQuantity: 10000,
    estimatedTime: '3-7일',
    qualityLevel: QualityLevel.PREMIUM,
    features: ['검색 상위 노출', '실제 방문자', '체류시간 증가'],
    isActive: true,
    tags: ['네이버', 'SEO', '트래픽', '상위노출']
  }
]

// 서버 상태 모니터링
export class ServerStatusManager {
  private static statusCache: Map<Platform, ServerStatus> = new Map()
  private static lastUpdate: Date = new Date()

  static async checkServerStatus(platform?: Platform): Promise<ServerStatus> {
    // 실제 환경에서는 API 호출로 상태 확인
    // 현재는 시뮬레이션
    const status = Math.random() > 0.1 ? ServerStatus.ONLINE : ServerStatus.SLOW

    if (platform) {
      this.statusCache.set(platform, status)
    }

    this.lastUpdate = new Date()
    return status
  }

  static getAllServerStatus(): Record<Platform, ServerStatus> {
    const status: Record<Platform, ServerStatus> = {} as any

    Object.values(Platform).forEach(platform => {
      status[platform] = this.statusCache.get(platform) || ServerStatus.ONLINE
    })

    return status
  }

  static getLastUpdateTime(): Date {
    return this.lastUpdate
  }
}

// 서비스 필터링 및 검색 유틸리티
export class ServiceManager {
  static getServicesByPlatform(platform: Platform): Service[] {
    return SERVICES.filter(service => service.platform === platform || service.platform === Platform.GENERAL)
  }

  static getServicesByCategory(category: ServiceCategory): Service[] {
    return SERVICES.filter(service => service.category === category)
  }

  static getPopularServices(): Service[] {
    return SERVICES.filter(service => service.isPopular)
  }

  static getNewServices(): Service[] {
    return SERVICES.filter(service => service.isNew)
  }

  static getFeaturedServices(): Service[] {
    return SERVICES.filter(service => service.isFeatured)
  }

  static getRecommendedServices(): Service[] {
    return SERVICES.filter(service => service.isRecommended)
  }

  static getPackageServices(): Service[] {
    return SERVICES.filter(service => service.category === ServiceCategory.PACKAGE)
  }

  static getEventServices(): Service[] {
    return SERVICES.filter(service => service.category === ServiceCategory.EVENT)
  }

  static getPremiumServices(): Service[] {
    return SERVICES.filter(service => service.category === ServiceCategory.PREMIUM)
  }

  static searchServices(query: string): Service[] {
    const lowerQuery = query.toLowerCase()
    return SERVICES.filter(service =>
      service.name.toLowerCase().includes(lowerQuery) ||
      service.description.toLowerCase().includes(lowerQuery) ||
      service.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  static getServicesByPriceRange(min: number, max: number): Service[] {
    return SERVICES.filter(service => service.price >= min && service.price <= max)
  }

  static getServicesByQuality(quality: QualityLevel): Service[] {
    return SERVICES.filter(service => service.qualityLevel === quality)
  }
}
