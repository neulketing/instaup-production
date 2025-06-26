// SNS Shop 완전 재현을 위한 확장된 서비스 타입 정의

export enum Platform {
  // 기본 SNS 플랫폼
  INSTAGRAM = "instagram",
  YOUTUBE = "youtube",
  TIKTOK = "tiktok",
  FACEBOOK = "facebook",
  TWITTER = "twitter",
  THREADS = "threads",

  // 한국 플랫폼
  KAKAO = "kakao",
  NAVER = "naver",
  NAVER_BLOG = "naver_blog",
  NAVER_BAND = "naver_band",

  // 글로벌 플랫폼
  LINKEDIN = "linkedin",
  PINTEREST = "pinterest",
  SNAPCHAT = "snapchat",
  DISCORD = "discord",
  TELEGRAM = "telegram",
  TWITCH = "twitch",

  // 특별 카테고리
  RECOMMEND = "recommend",
  PACKAGE = "package",
  EVENT = "event",
  PREMIUM = "premium",
  TOP_EXPOSURE = "top_exposure",

  // 마케팅 서비스
  BRAND_MARKETING = "brand_marketing",
  STORE_MARKETING = "store_marketing",
  SEO_TRAFFIC = "seo_traffic",
  NEWS_MEDIA = "news_media",
  APP_MARKETING = "app_marketing",
  ACCOUNT_MANAGEMENT = "account_management",
}

export enum ServiceCategory {
  // 기본 서비스
  FOLLOWERS = "followers",
  LIKES = "likes",
  VIEWS = "views",
  SUBSCRIBERS = "subscribers",
  COMMENTS = "comments",
  SHARES = "shares",

  // 고급 서비스
  REELS_SHORTS = "reels_shorts",
  STORY_HIGHLIGHTS = "story_highlights",
  LIVE_STREAMING = "live_streaming",
  PLAYLIST_SAVES = "playlist_saves",

  // 특별 서비스
  RECOMMEND_SERVICE = "recommend_service",
  EVENT_SERVICE = "event_service",
  PACKAGE_SERVICE = "package_service",
  PREMIUM_SERVICE = "premium_service",
  TOP_EXPOSURE_SERVICE = "top_exposure_service",

  // 마케팅 서비스
  STORE_MARKETING = "store_marketing",
  BRAND_MARKETING = "brand_marketing",
  SEO_TRAFFIC = "seo_traffic",
  NEWS_MEDIA = "news_media",
}

export interface ServiceItem {
  id: string;
  platform: Platform;
  category: ServiceCategory;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  minOrder: number;
  maxOrder: number;
  deliveryTime: string;
  quality: "basic" | "premium" | "vip";
  unit?: string;
  isPopular?: boolean;
  isRecommended?: boolean;
  isEvent?: boolean;
  features: string[];
  warningNote?: string;
  guideUrl?: string;
}

export interface PlatformInfo {
  id: Platform;
  name: string;
  icon: string;
  color: string;
  description: string;
  isActive: boolean;
  serverStatus: "online" | "maintenance" | "offline";
  orderCount: number;
}

export interface ServerStatus {
  platform: Platform;
  status: "online" | "maintenance" | "offline";
  responseTime: number;
  lastChecked: string;
  successRate: number;
}

export interface ServiceStats {
  totalOrders: number;
  totalMembers: number;
  completedOrders: number;
  serverStatus: "all_online" | "partial_maintenance" | "maintenance";
}
