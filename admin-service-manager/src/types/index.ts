// 서비스 유형 타입
export interface ServiceType {
  id: string;
  name: string;
  description: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 세부 서비스 타입
export interface DetailedService {
  id: string;
  serviceTypeId: string;
  name: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// 연결 부분 타입
export interface ConnectionOption {
  id: string;
  serviceTypeId: string;
  name: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// 상품 옵션 타입
export interface ProductOption {
  id: string;
  name: string;
  value: string;
  type: 'text' | 'number' | 'select' | 'boolean';
  isRequired: boolean;
  options?: string[]; // select 타입일 때 사용
}

// 구매 상품 타입
export interface Product {
  id: string;
  serviceTypeId: string;
  detailedServiceId: string;
  connectionOptionId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  options: ProductOption[];
  isActive: boolean;
  isPopular: boolean;
  stockQuantity?: number;
  minQuantity: number;
  maxQuantity: number;
  deliveryTime: string; // 예: "1-3 hours", "Instant"
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// 관리자 타입
export interface Admin {
  id: string;
  username: string;
  email: string;
  role: 'super' | 'admin' | 'moderator';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 페이지네이션 타입
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// 필터 타입
export interface FilterOptions {
  search?: string;
  isActive?: boolean;
  serviceTypeId?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 폼 상태 타입
export interface FormState {
  isLoading: boolean;
  errors: Record<string, string>;
  success: boolean;
}

// 대시보드 통계 타입
export interface DashboardStats {
  totalServices: number;
  totalProducts: number;
  activeServices: number;
  totalRevenue: number;
  monthlyGrowth: number;
  recentOrders: number;
}
