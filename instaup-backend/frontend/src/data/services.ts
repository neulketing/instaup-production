import {
  Platform,
  type PlatformInfo,
  ServiceCategory,
  type ServiceItem,
  type ServiceStats,
} from "../types/services";

// SNS Shop 완전 재현 플랫폼 정보 (실제 아이콘 사용)
export const platformsData: PlatformInfo[] = [
  {
    id: Platform.RECOMMEND,
    name: "추천서비스",
    icon: "https://ext.same-assets.com/3036106235/1198882009.svg",
    color: "#ff6b6b",
    description: "인기 있는 추천 서비스",
    isActive: true,
    serverStatus: "online",
    orderCount: 15847,
  },
  {
    id: Platform.INSTAGRAM,
    name: "인스타그램",
    icon: "https://ext.same-assets.com/3036106235/3403627917.svg",
    color: "#e1306c",
    description: "인스타그램 팔로워, 좋아요, 조회수",
    isActive: true,
    serverStatus: "online",
    orderCount: 8945672,
  },
  {
    id: Platform.YOUTUBE,
    name: "유튜브",
    icon: "https://ext.same-assets.com/3036106235/118996313.svg",
    color: "#ff0000",
    description: "유튜브 구독자, 조회수, 좋아요",
    isActive: true,
    serverStatus: "online",
    orderCount: 7234891,
  },
  {
    id: Platform.TIKTOK,
    name: "틱톡",
    icon: "https://ext.same-assets.com/3036106235/543643870.svg",
    color: "#000000",
    description: "틱톡 팔로워, 좋아요, 조회수",
    isActive: true,
    serverStatus: "online",
    orderCount: 5678234,
  },
  {
    id: Platform.FACEBOOK,
    name: "페이스북",
    icon: "https://ext.same-assets.com/3036106235/579375520.svg",
    color: "#1877f2",
    description: "페이스북 팔로워, 좋아요, 공유",
    isActive: true,
    serverStatus: "online",
    orderCount: 3456789,
  },
  {
    id: Platform.TWITTER,
    name: "X(트위터)",
    icon: "https://ext.same-assets.com/3036106235/1541654493.svg",
    color: "#1da1f2",
    description: "X(트위터) 팔로워, 좋아요, 리트윗",
    isActive: true,
    serverStatus: "online",
    orderCount: 2789456,
  },
  {
    id: Platform.PACKAGE,
    name: "패키지",
    icon: "https://ext.same-assets.com/3036106235/3564447473.svg",
    color: "#8b5cf6",
    description: "복합 서비스 할인 패키지",
    isActive: true,
    serverStatus: "online",
    orderCount: 456789,
  },
  {
    id: Platform.TOP_EXPOSURE,
    name: "상위노출",
    icon: "https://ext.same-assets.com/3036106235/2797106922.svg",
    color: "#10b981",
    description: "SEO 최적화 상위노출 서비스",
    isActive: true,
    serverStatus: "online",
    orderCount: 123456,
  },
];

// SNS Shop 실제 통계 데이터
export const serviceStats: ServiceStats = {
  totalOrders: 27147423,
  totalMembers: 248207,
  completedOrders: 25799451,
  serverStatus: "all_online",
};

// SNS Shop 완전 재현 서비스 데이터 (실제 주문 알고리즘 기반)
export const servicesData: ServiceItem[] = [
  // 인스타그램 실제 한국인 팔로워 서비스 (SNS샵 완전 재현)
  {
    id: "ig_kr_followers_general",
    platform: Platform.INSTAGRAM,
    category: ServiceCategory.FOLLOWERS,
    name: "🇰🇷 실제 한국인 팔로워 [일반]",
    description:
      "100% 실제 활동하는 한국인 유저들이 인스타 공식앱을 통해 직접 방문하여 팔로우를 눌러드리는 방식으로 안전하게 진행됩니다.",
    price: 180,
    minOrder: 5,
    maxOrder: 30000,
    deliveryTime: "1-5분 내 자동 시작",
    quality: "basic",
    isPopular: true,
    features: [
      "100% 실제 활동하는 한국인 유저",
      "인스타 공식앱을 통한 직접 팔로우",
      "계정활성화 및 계정홍보에 효과적",
      "60일간 3회 리필 제공",
      "1-5분 내 자동 시작",
      "실시간 진행 현황 확인",
    ],
    warningNote:
      "주문 전 공개 상태인지 확인해 주세요. 작업 진행 중 아이디 변경 및 비공개 전환 금지. 인스타 아이디를 변경하면 리필이 종료됩니다.",
  },
  {
    id: "ig_kr_followers_female",
    platform: Platform.INSTAGRAM,
    category: ServiceCategory.FOLLOWERS,
    name: "🇰🇷 실제 한국인 팔로워 [여성]",
    description: "여성 한국인 계정으로만 구성된 프리미엄 팔로워 서비스입니다.",
    price: 270,
    minOrder: 5,
    maxOrder: 30000,
    deliveryTime: "1-5분 내 자동 시작",
    quality: "premium",
    isRecommended: true,
    features: [
      "100% 여성 한국인 계정",
      "높은 프로필 완성도",
      "활발한 인스타그램 활동",
      "60일간 3회 리필 제공",
      "1-5분 내 자동 시작",
      "실시간 진행 현황 확인",
    ],
    warningNote:
      "주문 전 공개 상태인지 확인해 주세요. 작업 진행 중 아이디 변경 및 비공개 전환 금지.",
  },
  {
    id: "ig_kr_followers_male",
    platform: Platform.INSTAGRAM,
    category: ServiceCategory.FOLLOWERS,
    name: "🇰🇷 실제 한국인 팔로워 [남성]",
    description: "남성 한국인 계정으로만 구성된 프리미엄 팔로워 서비스입니다.",
    price: 270,
    minOrder: 5,
    maxOrder: 30000,
    deliveryTime: "1-5분 내 자동 시작",
    quality: "premium",
    features: [
      "100% 남성 한국인 계정",
      "높은 프로필 완성도",
      "활발한 인스타그램 활동",
      "60일간 3회 리필 제공",
      "1-5분 내 자동 시작",
      "실시간 진행 현황 확인",
    ],
    warningNote:
      "주문 전 공개 상태인지 확인해 주세요. 작업 진행 중 아이디 변경 및 비공개 전환 금지.",
  },
  {
    id: "ig_kr_followers_ghost_quality",
    platform: Platform.INSTAGRAM,
    category: ServiceCategory.FOLLOWERS,
    name: "🇰🇷 고퀄리티 한국인 팔로워 [유령]",
    description:
      "저렴한 가격의 한국인 팔로워로 수치 증가에 특화된 서비스입니다.",
    price: 50,
    minOrder: 10,
    maxOrder: 30000,
    deliveryTime: "즉시 시작",
    quality: "basic",
    features: [
      "가성비 최고의 한국인 팔로워",
      "빠른 수치 증가",
      "30일 품질 보장",
      "즉시 시작",
    ],
    warningNote: "유령형 서비스는 수치 증가 목적으로 권장합니다.",
  },
  {
    id: "ig_kr_followers_ghost_ultra",
    platform: Platform.INSTAGRAM,
    category: ServiceCategory.FOLLOWERS,
    name: "🇰🇷 초고퀄리티 한국인 팔로워 [유령]",
    description: "프리미엄 유령형 한국인 팔로워 서비스입니다.",
    price: 99,
    minOrder: 10,
    maxOrder: 30000,
    deliveryTime: "즉시 시작",
    quality: "premium",
    features: [
      "초고퀄리티 한국인 팔로워",
      "우수한 계정 품질",
      "30일 품질 보장",
      "즉시 시작",
    ],
  },

  // 인스타그램 특별 서비스들
  {
    id: "ig_popular_post_ranking",
    platform: Platform.INSTAGRAM,
    category: ServiceCategory.TOP_EXPOSURE_SERVICE,
    name: "인스타 인기게시물 상위노출",
    description: "인스타그램 해시태그 인기게시물 상위 노출 서비스입니다.",
    price: 2500,
    minOrder: 1,
    maxOrder: 10,
    deliveryTime: "24시간 내",
    quality: "premium",
    isRecommended: true,
    features: [
      "해시태그 인기게시물 상위 노출",
      "24시간 지속 노출",
      "자연스러운 노출 증가",
      "실시간 노출 확인",
    ],
  },
  {
    id: "ig_30day_management",
    platform: Platform.INSTAGRAM,
    category: ServiceCategory.PREMIUM_SERVICE,
    name: "인스타 30일 최적화 계정관리",
    description:
      "30일간 전문가가 계정을 최적화하여 관리해드리는 프리미엄 서비스입니다.",
    price: 150000,
    minOrder: 1,
    maxOrder: 3,
    deliveryTime: "24시간 내 시작",
    quality: "vip",
    isRecommended: true,
    features: [
      "30일간 전문 계정 관리",
      "인기게시물 상위노출 최적화",
      "해시태그 전략 수립",
      "일일 성과 리포트",
      "전담 매니저 배정",
    ],
  },

  // 유튜브 서비스들
  {
    id: "yt_kr_subscribers",
    platform: Platform.YOUTUBE,
    category: ServiceCategory.SUBSCRIBERS,
    name: "유튜브 구독자 늘리기",
    description: "실제 한국인 구독자로 채널을 성장시켜드립니다.",
    price: 800,
    minOrder: 10,
    maxOrder: 5000,
    deliveryTime: "6시간 이내",
    quality: "basic",
    isPopular: true,
    features: ["100% 실제 구독자", "한국인 계정", "즉시 시작", "30일 보장"],
  },
  {
    id: "yt_views",
    platform: Platform.YOUTUBE,
    category: ServiceCategory.VIEWS,
    name: "유튜브 조회수 늘리기",
    description: "동영상 조회수를 빠르게 늘려드립니다.",
    price: 150,
    minOrder: 100,
    maxOrder: 100000,
    deliveryTime: "30분 이내",
    quality: "basic",
    features: ["즉시 시작", "고품질 조회수", "분산 배송", "자연스러운 증가"],
  },

  // 틱톡 서비스들
  {
    id: "tt_followers",
    platform: Platform.TIKTOK,
    category: ServiceCategory.FOLLOWERS,
    name: "틱톡 팔로워 늘리기",
    description: "틱톡 팔로워를 안전하게 늘려드립니다.",
    price: 300,
    minOrder: 50,
    maxOrder: 10000,
    deliveryTime: "2시간 이내",
    quality: "basic",
    isPopular: true,
    features: ["실제 계정", "즉시 시작", "24시간 배송", "30일 보장"],
  },

  // 패키지 서비스들
  {
    id: "package_starter_premium",
    platform: Platform.PACKAGE,
    category: ServiceCategory.PACKAGE_SERVICE,
    name: "인스타 패키지 서비스",
    description: "인스타그램 팔로워 + 좋아요 + 조회수가 포함된 패키지입니다.",
    price: 2500,
    originalPrice: 3500,
    discount: 29,
    minOrder: 1,
    maxOrder: 10,
    deliveryTime: "24시간 이내",
    quality: "premium",
    isRecommended: true,
    features: [
      "팔로워 500명 + 좋아요 1000개",
      "릴스 조회수 5000회 포함",
      "29% 할인 적용",
      "통합 진행 관리",
      "30일 품질 보장",
    ],
  },
];

// 서비스 필터링 및 검색 함수
export const getServicesByPlatform = (platform: Platform): ServiceItem[] => {
  return servicesData.filter((service) => service.platform === platform);
};

export const getServicesByCategory = (
  category: ServiceCategory,
): ServiceItem[] => {
  return servicesData.filter((service) => service.category === category);
};

export const getPopularServices = (): ServiceItem[] => {
  return servicesData.filter((service) => service.isPopular);
};

export const getRecommendedServices = (): ServiceItem[] => {
  return servicesData.filter((service) => service.isRecommended);
};

export const getEventServices = (): ServiceItem[] => {
  return servicesData.filter((service) => service.isEvent);
};
