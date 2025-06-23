import type { ServiceType, DetailedService, ConnectionOption, Product, DashboardStats } from '@/types';

// 서비스 유형 더미 데이터
export const mockServiceTypes: ServiceType[] = [
  {
    id: "1",
    name: "인스타그램",
    description: "Instagram 팔로워, 좋아요, 조회수 등 다양한 서비스",
    icon: "instagram",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "2",
    name: "틱톡",
    description: "TikTok 팔로워, 좋아요, 조회수 서비스",
    icon: "tiktok",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "3",
    name: "유튜브",
    description: "YouTube 구독자, 좋아요, 조회수 서비스",
    icon: "youtube",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "4",
    name: "페이스북",
    description: "Facebook 좋아요, 팔로워, 페이지 좋아요 서비스",
    icon: "facebook",
    isActive: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

// 세부 서비스 더미 데이터
export const mockDetailedServices: DetailedService[] = [
  {
    id: "1",
    serviceTypeId: "1",
    name: "팔로워",
    description: "Instagram 팔로워 증가 서비스",
    isActive: true,
    sortOrder: 1,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "2",
    serviceTypeId: "1",
    name: "좋아요",
    description: "Instagram 게시물 좋아요 서비스",
    isActive: true,
    sortOrder: 2,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "3",
    serviceTypeId: "1",
    name: "조회수",
    description: "Instagram 스토리/릴스 조회수 서비스",
    isActive: true,
    sortOrder: 3,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "4",
    serviceTypeId: "2",
    name: "팔로워",
    description: "TikTok 팔로워 증가 서비스",
    isActive: true,
    sortOrder: 1,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "5",
    serviceTypeId: "2",
    name: "좋아요",
    description: "TikTok 동영상 좋아요 서비스",
    isActive: true,
    sortOrder: 2,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

// 연결 옵션 더미 데이터
export const mockConnectionOptions: ConnectionOption[] = [
  {
    id: "1",
    serviceTypeId: "1",
    name: "계정 연결",
    description: "Instagram 계정 직접 연결",
    isActive: true,
    sortOrder: 1,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "2",
    serviceTypeId: "1",
    name: "URL 입력",
    description: "Instagram 프로필 또는 게시물 URL 입력",
    isActive: true,
    sortOrder: 2,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "3",
    serviceTypeId: "2",
    name: "계정 연결",
    description: "TikTok 계정 직접 연결",
    isActive: true,
    sortOrder: 1,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "4",
    serviceTypeId: "2",
    name: "URL 입력",
    description: "TikTok 프로필 또는 동영상 URL 입력",
    isActive: true,
    sortOrder: 2,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

// 구매 상품 더미 데이터
export const mockProducts: Product[] = [
  {
    id: "1",
    serviceTypeId: "1",
    detailedServiceId: "1",
    connectionOptionId: "1",
    name: "Instagram 팔로워 1000명",
    description: "고품질 Instagram 팔로워 1000명을 제공합니다. 실제 활성 사용자들로 구성되어 있습니다.",
    price: 15000,
    originalPrice: 20000,
    currency: "KRW",
    options: [
      {
        id: "1",
        name: "사용자명",
        value: "",
        type: "text",
        isRequired: true
      },
      {
        id: "2",
        name: "전달 속도",
        value: "",
        type: "select",
        isRequired: true,
        options: ["빠름 (1-6시간)", "보통 (6-24시간)", "느림 (1-3일)"]
      }
    ],
    isActive: true,
    isPopular: true,
    stockQuantity: 100,
    minQuantity: 1,
    maxQuantity: 10,
    deliveryTime: "1-6 hours",
    category: "팔로워",
    tags: ["인기", "고품질", "빠른배송"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "2",
    serviceTypeId: "1",
    detailedServiceId: "2",
    connectionOptionId: "2",
    name: "Instagram 좋아요 500개",
    description: "게시물에 자연스러운 좋아요 500개를 추가합니다.",
    price: 8000,
    currency: "KRW",
    options: [
      {
        id: "1",
        name: "게시물 URL",
        value: "",
        type: "text",
        isRequired: true
      },
      {
        id: "2",
        name: "점진적 증가",
        value: "true",
        type: "boolean",
        isRequired: false
      }
    ],
    isActive: true,
    isPopular: false,
    minQuantity: 1,
    maxQuantity: 20,
    deliveryTime: "Instant",
    category: "좋아요",
    tags: ["즉시", "자연스러움"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "3",
    serviceTypeId: "2",
    detailedServiceId: "4",
    connectionOptionId: "3",
    name: "TikTok 팔로워 500명",
    description: "TikTok 계정에 활성 팔로워 500명을 추가합니다.",
    price: 12000,
    originalPrice: 15000,
    currency: "KRW",
    options: [
      {
        id: "1",
        name: "TikTok 사용자명",
        value: "",
        type: "text",
        isRequired: true
      }
    ],
    isActive: true,
    isPopular: true,
    stockQuantity: 50,
    minQuantity: 1,
    maxQuantity: 5,
    deliveryTime: "2-12 hours",
    category: "팔로워",
    tags: ["인기", "TikTok"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

// 대시보드 통계 더미 데이터
export const mockDashboardStats: DashboardStats = {
  totalServices: 4,
  totalProducts: 15,
  activeServices: 3,
  totalRevenue: 2850000,
  monthlyGrowth: 12.5,
  recentOrders: 127
};
