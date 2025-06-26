export interface Service {
  id: string
  name: string
  platform: Platform
  category: ServiceCategory
  description: string
  price: number
  minQuantity: number
  maxQuantity: number
  estimatedTime: string
  qualityLevel: QualityLevel
  features: string[]
  isActive: boolean
  isPopular?: boolean
  isNew?: boolean
  isFeatured?: boolean
  tags: string[]
}

export enum Platform {
  INSTAGRAM = 'INSTAGRAM',
  YOUTUBE = 'YOUTUBE',
  FACEBOOK = 'FACEBOOK',
  TIKTOK = 'TIKTOK',
  X = 'X',
  THREADS = 'THREADS',
  KAKAO = 'KAKAO',
  NAVER = 'NAVER',
  GENERAL = 'GENERAL'
}

export enum ServiceCategory {
  RECOMMEND = 'RECOMMEND',
  FOLLOWERS = 'FOLLOWERS',
  LIKES = 'LIKES',
  VIEWS = 'VIEWS',
  SUBSCRIBERS = 'SUBSCRIBERS',
  PACKAGE = 'PACKAGE',
  EVENT = 'EVENT',
  TOP_EXPOSURE = 'TOP_EXPOSURE',
  PREMIUM = 'PREMIUM'
}

export enum QualityLevel {
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  ULTIMATE = 'ULTIMATE',
  VIP = 'VIP'
}

export const PLATFORM_CONFIG = {
  [Platform.INSTAGRAM]: {
    name: '인스타그램',
    icon: '📷',
    color: 'from-pink-500 to-purple-600',
    description: '세계 1위 사진 SNS'
  },
  [Platform.YOUTUBE]: {
    name: '유튜브',
    icon: '📺',
    color: 'from-red-500 to-red-600',
    description: '글로벌 동영상 플랫폼'
  },
  [Platform.TIKTOK]: {
    name: '틱톡',
    icon: '🎵',
    color: 'from-black to-gray-800',
    description: '글로벌 숏폼 비디오'
  },
  [Platform.FACEBOOK]: {
    name: '페이스북',
    icon: '👥',
    color: 'from-blue-600 to-blue-700',
    description: '소셜 네트워크'
  }
}

export const SERVICES: Service[] = [
  {
    id: 'ig_followers_kr',
    name: '인스타그램 팔로워 (한국인)',
    platform: Platform.INSTAGRAM,
    category: ServiceCategory.FOLLOWERS,
    description: '100% 실제 한국인 팔로워',
    price: 100,
    minQuantity: 10,
    maxQuantity: 10000,
    estimatedTime: '1-3시간',
    qualityLevel: QualityLevel.PREMIUM,
    features: ['실제 한국인', '안전 보장'],
    isActive: true,
    isPopular: true,
    tags: ['인스타그램', '팔로워']
  }
]
