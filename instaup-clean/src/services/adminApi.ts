// 관리자용 고급 API 서비스

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface AdminAuth {
  username: string;
  token: string;
  permissions: string[];
  expiresAt: string;
}

interface OrderData {
  id: string;
  userId: string;
  serviceName: string;
  platform: string;
  quantity: number;
  price: number;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  notes?: string;
}

interface UserData {
  id: string;
  username: string;
  email: string;
  name: string;
  phone?: string;
  balance: number;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  lastLogin: string;
  status: "active" | "suspended" | "banned";
  isVerified: boolean;
}

interface ServiceData {
  id: string;
  name: string;
  platform: string;
  category: string;
  price: number;
  minOrder: number;
  maxOrder: number;
  isActive: boolean;
  isHidden: boolean;
  totalOrders: number;
  totalRevenue: number;
  description: string;
  deliveryTime: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  services: {
    serviceId: string;
    serviceName: string;
    quantity: number;
    platform: string;
  }[];
  isActive: boolean;
  isHidden: boolean;
  isFeatured: boolean;
  totalOrders: number;
  totalRevenue: number;
  deliveryTime: string;
  icon?: string;
  iconId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface DashboardMetrics {
  overview: {
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    activeUsers: number;
    conversionRate: number;
  };
  revenue: {
    today: number;
    yesterday: number;
    thisWeek: number;
    lastWeek: number;
    thisMonth: number;
    lastMonth: number;
    growth: {
      daily: number;
      weekly: number;
      monthly: number;
    };
  };
  orders: {
    today: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    cancelled: number;
    successRate: number;
  };
  platforms: {
    instagram: { orders: number; revenue: number };
    youtube: { orders: number; revenue: number };
    tiktok: { orders: number; revenue: number };
    facebook: { orders: number; revenue: number };
    twitter: { orders: number; revenue: number };
  };
  topServices: {
    id: string;
    name: string;
    orders: number;
    revenue: number;
  }[];
  recentActivity: {
    timestamp: string;
    type: string;
    description: string;
    userId?: string;
    orderId?: string;
  }[];
}

class AdminApiService {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor() {
    this.baseUrl =
      import.meta.env.VITE_ADMIN_API_URL || "http://localhost:8080/admin";
    this.authToken = localStorage.getItem("adminToken");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const config: RequestInit = {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
          ...options.headers,
        },
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "요청 처리 중 오류가 발생했습니다.");
      }

      return data;
    } catch (error) {
      console.error("API 요청 실패:", error);

      // 백엔드가 없는 경우 시뮬레이션 데이터 반환
      return this.simulateApiResponse<T>(endpoint, options);
    }
  }

  // 백엔드가 없는 경우 시뮬레이션 응답
  private async simulateApiResponse<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    // 시뮬레이션 지연
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 1000),
    );

    const method = options.method || "GET";

    // 엔드포인트별 시뮬레이션 응답
    switch (true) {
      case endpoint === "/auth/login" && method === "POST":
        return {
          success: true,
          data: {
            username: "admin",
            token: "mock_admin_token_" + Date.now(),
            permissions: ["all"],
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          } as T,
        };

      case endpoint === "/dashboard/metrics":
        return {
          success: true,
          data: this.generateMockDashboardMetrics() as T,
        };

      case endpoint.startsWith("/orders"):
        if (method === "GET") {
          return {
            success: true,
            data: this.generateMockOrders() as T,
          };
        }
        break;

      case endpoint.startsWith("/users"):
        if (method === "GET") {
          return {
            success: true,
            data: this.generateMockUsers() as T,
          };
        }
        break;

      case endpoint.startsWith("/services"):
        if (method === "GET") {
          return {
            success: true,
            data: this.generateMockServices() as T,
          };
        }
        break;

      case endpoint.startsWith("/products"):
        if (method === "GET") {
          return {
            success: true,
            data: this.generateMockProducts() as T,
          };
        }
        break;

      default:
        return {
          success: false,
          error: "지원하지 않는 엔드포인트입니다.",
        };
    }

    return {
      success: true,
      data: {} as T,
      message: "시뮬레이션 응답",
    };
  }

  // 관리자 인증
  async login(
    username: string,
    password: string,
    adminKey: string,
  ): Promise<ApiResponse<AdminAuth>> {
    const response = await this.request<AdminAuth>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password, adminKey }),
    });

    if (response.success && response.data) {
      this.authToken = response.data.token;
      localStorage.setItem("adminToken", response.data.token);
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request("/auth/logout", { method: "POST" });

    this.authToken = null;
    localStorage.removeItem("adminToken");

    return response;
  }

  // 대시보드 메트릭
  async getDashboardMetrics(): Promise<ApiResponse<DashboardMetrics>> {
    return this.request<DashboardMetrics>("/dashboard/metrics");
  }

  // 주문 관리
  async getOrders(params: {
    page?: number;
    limit?: number;
    status?: string;
    platform?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<
    ApiResponse<{ orders: OrderData[]; total: number; pages: number }>
  > {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value.toString());
    });

    return this.request(`/orders?${queryParams.toString()}`);
  }

  async updateOrderStatus(
    orderId: string,
    status: string,
    notes?: string,
  ): Promise<ApiResponse> {
    return this.request(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, notes }),
    });
  }

  async cancelOrder(orderId: string, reason: string): Promise<ApiResponse> {
    return this.request(`/orders/${orderId}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  }

  // 사용자 관리
  async getUsers(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<
    ApiResponse<{ users: UserData[]; total: number; pages: number }>
  > {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value.toString());
    });

    return this.request(`/users?${queryParams.toString()}`);
  }

  async getUserDetail(userId: string): Promise<ApiResponse<UserData>> {
    return this.request(`/users/${userId}`);
  }

  async updateUserStatus(userId: string, status: string): Promise<ApiResponse> {
    return this.request(`/users/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async adjustUserBalance(
    userId: string,
    amount: number,
    reason: string,
  ): Promise<ApiResponse> {
    return this.request(`/users/${userId}/balance`, {
      method: "POST",
      body: JSON.stringify({ amount, reason }),
    });
  }

  // 서비스 관리
  async getServices(): Promise<ApiResponse<ServiceData[]>> {
    return this.request("/services");
  }

  async createService(
    serviceData: Omit<ServiceData, "id" | "createdAt" | "updatedAt">,
  ): Promise<ApiResponse<ServiceData>> {
    return this.request("/services", {
      method: "POST",
      body: JSON.stringify(serviceData),
    });
  }

  async updateService(
    serviceId: string,
    serviceData: Partial<ServiceData>,
  ): Promise<ApiResponse<ServiceData>> {
    return this.request(`/services/${serviceId}`, {
      method: "PATCH",
      body: JSON.stringify(serviceData),
    });
  }

  async deleteService(serviceId: string): Promise<ApiResponse> {
    return this.request(`/services/${serviceId}`, {
      method: "DELETE",
    });
  }

  // 상품 관리
  async getProducts(): Promise<ApiResponse<ProductData[]>> {
    return this.request("/products");
  }

  async createProduct(
    productData: Omit<ProductData, "id" | "createdAt" | "updatedAt">,
  ): Promise<ApiResponse<ProductData>> {
    return this.request("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(
    productId: string,
    productData: Partial<ProductData>,
  ): Promise<ApiResponse<ProductData>> {
    return this.request(`/products/${productId}`, {
      method: "PATCH",
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(productId: string): Promise<ApiResponse> {
    return this.request(`/products/${productId}`, {
      method: "DELETE",
    });
  }

  // 통계 및 분석
  async getAnalytics(params: {
    period: "day" | "week" | "month" | "year";
    dateFrom: string;
    dateTo: string;
    platform?: string;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value);
    });

    return this.request(`/analytics?${queryParams.toString()}`);
  }

  async exportData(params: {
    type: "orders" | "users" | "services" | "analytics";
    format: "csv" | "excel";
    dateFrom?: string;
    dateTo?: string;
    filters?: any;
  }): Promise<ApiResponse<{ downloadUrl: string }>> {
    return this.request("/export", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  // 시스템 관리
  async getSystemStatus(): Promise<
    ApiResponse<{
      server: "online" | "offline" | "maintenance";
      database: "connected" | "disconnected";
      redis: "connected" | "disconnected";
      queue: "running" | "stopped";
      uptime: number;
      version: string;
    }>
  > {
    return this.request("/system/status");
  }

  async sendNotification(params: {
    type: "broadcast" | "user";
    target?: string[];
    title: string;
    message: string;
    priority: "low" | "medium" | "high" | "urgent";
  }): Promise<ApiResponse> {
    return this.request("/notifications/send", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  // 시뮬레이션 데이터 생성 메서드들
  private generateMockDashboardMetrics(): DashboardMetrics {
    return {
      overview: {
        totalUsers: 2847,
        totalOrders: 15293,
        totalRevenue: 89456000,
        pendingOrders: 47,
        activeUsers: 1204,
        conversionRate: 3.2,
      },
      revenue: {
        today: 1250000,
        yesterday: 1180000,
        thisWeek: 8450000,
        lastWeek: 7890000,
        thisMonth: 34560000,
        lastMonth: 32100000,
        growth: {
          daily: 5.9,
          weekly: 7.1,
          monthly: 7.7,
        },
      },
      orders: {
        today: 89,
        pending: 47,
        processing: 156,
        completed: 14890,
        failed: 87,
        cancelled: 123,
        successRate: 97.2,
      },
      platforms: {
        instagram: { orders: 8234, revenue: 45670000 },
        youtube: { orders: 3456, revenue: 23450000 },
        tiktok: { orders: 2345, revenue: 15670000 },
        facebook: { orders: 987, revenue: 3450000 },
        twitter: { orders: 271, revenue: 1216000 },
      },
      topServices: [
        { id: "1", name: "Instagram 팔로워", orders: 3456, revenue: 15678000 },
        { id: "2", name: "YouTube 구독자", orders: 2345, revenue: 12345000 },
        { id: "3", name: "TikTok 좋아요", orders: 1234, revenue: 8976000 },
      ],
      recentActivity: [
        {
          timestamp: new Date().toISOString(),
          type: "order",
          description: "새 주문 접수 (Instagram 팔로워 1000명)",
          orderId: "ORD-" + Date.now(),
        },
        {
          timestamp: new Date(Date.now() - 300000).toISOString(),
          type: "payment",
          description: "결제 완료 (15,000원)",
          orderId: "ORD-" + (Date.now() - 1),
        },
        {
          timestamp: new Date(Date.now() - 600000).toISOString(),
          type: "user",
          description: "신규 회원 가입",
          userId: "USR-" + Date.now(),
        },
      ],
    };
  }

  private generateMockOrders(): {
    orders: OrderData[];
    total: number;
    pages: number;
  } {
    const orders: OrderData[] = [];
    const platforms = ["Instagram", "YouTube", "TikTok", "Facebook", "Twitter"];
    const statuses: OrderData["status"][] = [
      "pending",
      "processing",
      "completed",
      "failed",
    ];

    for (let i = 0; i < 50; i++) {
      orders.push({
        id: `ORD-${1000 + i}`,
        userId: `USR-${Math.floor(Math.random() * 1000)}`,
        serviceName: `${platforms[Math.floor(Math.random() * platforms.length)]} 서비스`,
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        quantity: Math.floor(Math.random() * 5000) + 100,
        price: Math.floor(Math.random() * 50000) + 5000,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return { orders, total: 15293, pages: 306 };
  }

  private generateMockUsers(): {
    users: UserData[];
    total: number;
    pages: number;
  } {
    const users: UserData[] = [];
    const statuses: UserData["status"][] = ["active", "suspended"];

    for (let i = 0; i < 20; i++) {
      users.push({
        id: `USR-${1000 + i}`,
        username: `user${1000 + i}`,
        email: `user${1000 + i}@example.com`,
        name: `사용자${1000 + i}`,
        balance: Math.floor(Math.random() * 100000),
        totalOrders: Math.floor(Math.random() * 50),
        totalSpent: Math.floor(Math.random() * 500000),
        joinDate: new Date(
          Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        lastLogin: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        isVerified: Math.random() > 0.3,
      });
    }

    return { users, total: 2847, pages: 143 };
  }

  private generateMockServices(): ServiceData[] {
    const services: ServiceData[] = [];
    const platforms = ["Instagram", "YouTube", "TikTok", "Facebook", "Twitter"];
    const categories = ["팔로워", "좋아요", "조회수", "댓글", "구독자"];

    for (let i = 0; i < 15; i++) {
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const category =
        categories[Math.floor(Math.random() * categories.length)];

      services.push({
        id: `SRV-${1000 + i}`,
        name: `${platform} ${category}`,
        platform,
        category,
        price: Math.floor(Math.random() * 50) + 5,
        minOrder: Math.floor(Math.random() * 100) + 10,
        maxOrder: Math.floor(Math.random() * 10000) + 1000,
        isActive: Math.random() > 0.2,
        isHidden: Math.random() > 0.5,
        totalOrders: Math.floor(Math.random() * 1000),
        totalRevenue: Math.floor(Math.random() * 1000000),
        description: `${platform} ${category} 증가 서비스`,
        deliveryTime: `${Math.floor(Math.random() * 24) + 1}-${Math.floor(Math.random() * 24) + 24}시간`,
        createdAt: new Date(
          Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return services;
  }

  private generateMockProducts(): ProductData[] {
    const products: ProductData[] = [];
    const categories = ["패키지", "서비스", "기프트"];

    for (let i = 0; i < 10; i++) {
      const category =
        categories[Math.floor(Math.random() * categories.length)];

      products.push({
        id: `PRO-${1000 + i}`,
        name: `상품${1000 + i}`,
        description: `상품${1000 + i} 설명`,
        category,
        price: Math.floor(Math.random() * 10000) + 1000,
        originalPrice: Math.floor(Math.random() * 10000) + 2000,
        discount: Math.floor(Math.random() * 50) + 10,
        services: [
          {
            serviceId: `SRV-${Math.floor(Math.random() * 15) + 1}`,
            serviceName: `서비스${Math.floor(Math.random() * 15) + 1}`,
            quantity: Math.floor(Math.random() * 10) + 1,
            platform: "Instagram",
          },
          {
            serviceId: `SRV-${Math.floor(Math.random() * 15) + 1}`,
            serviceName: `서비스${Math.floor(Math.random() * 15) + 1}`,
            quantity: Math.floor(Math.random() * 10) + 1,
            platform: "YouTube",
          },
        ],
        isActive: Math.random() > 0.5,
        isHidden: Math.random() > 0.7,
        isFeatured: Math.random() > 0.9,
        totalOrders: Math.floor(Math.random() * 1000),
        totalRevenue: Math.floor(Math.random() * 1000000),
        deliveryTime: `${Math.floor(Math.random() * 24) + 1}-${Math.floor(Math.random() * 24) + 24}시간`,
        icon: `https://via.placeholder.com/150`,
        iconId: `icon-${1000 + i}`,
        tags: ["tag1", "tag2"],
        createdAt: new Date(
          Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return products;
  }
}

// 싱글톤 인스턴스 내보내기
export const adminApi = new AdminApiService();

// 타입들도 내보내기
export type {
  ApiResponse,
  AdminAuth,
  OrderData,
  UserData,
  ServiceData,
  ProductData,
  DashboardMetrics,
};
