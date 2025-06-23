// 백엔드 API 연동 서비스
import { OrderRequest, type OrderResponse } from "./api";

// API 응답 타입 정의
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 사용자 정보 타입
export interface User {
  id: string;
  email: string;
  nickname: string;
  username?: string;
  balance: number;
  referralCode?: string;
  totalSpent?: number;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

// 인증 관련 타입
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  nickname: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// 주문 관련 타입
export interface Order {
  id: string;
  userId: string;
  serviceId: string;
  targetUrl: string;
  quantity: number;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed" | "refunded";
  progress: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  service?: Service;
}

// 서비스 관련 타입
export interface Service {
  id: string;
  name: string;
  platform: string;
  category: string;
  price: number;
  minQuantity: number;
  maxQuantity: number;
  isActive: boolean;
  description?: string;
}

// 결제 관련 타입
export interface PaymentRequest {
  amount: number;
  method: "card" | "kakao" | "naver" | "toss" | "bank";
  orderId?: string;
}

export interface PaymentResponse {
  paymentId: string;
  status: "pending" | "completed" | "failed";
  paymentUrl?: string;
  amount: number;
}

class BackendApiService {
  private baseUrl: string;
  private token: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // 환경에 따른 API URL 설정
    this.baseUrl =
      import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3001";
    this.token = localStorage.getItem("auth_token");
    this.refreshToken = localStorage.getItem("refresh_token");
  }

  // 인증 헤더 설정
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // API 호출 래퍼
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}/api${endpoint}`;
      const config: RequestInit = {
        headers: this.getHeaders(),
        ...options,
      };

      let response = await fetch(url, config);

      // 401 에러시 토큰 갱신 시도
      if (response.status === 401 && this.token) {
        const refreshSuccess = await this.refreshAccessToken();
        if (refreshSuccess) {
          // 새로운 토큰으로 재시도
          const newConfig: RequestInit = {
            headers: this.getHeaders(),
            ...options,
          };
          response = await fetch(url, newConfig);
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
      };
    }
  }

  // 토큰 설정
  setToken(token: string, refreshToken?: string) {
    this.token = token;
    localStorage.setItem("auth_token", token);
    if (refreshToken) {
      this.refreshToken = refreshToken;
      localStorage.setItem("refresh_token", refreshToken);
    }
  }

  // 토큰 제거
  clearToken() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
  }

  // 토큰 자동 갱신
  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.token) {
          this.setToken(data.data.token, data.data.refreshToken);
          return true;
        }
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }

    // 갱신 실패 시 토큰 제거
    this.clearToken();
    return false;
  }

  // === 인증 API ===

  // 로그인
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.makeRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token, response.data.refreshToken);
    }

    return response;
  }

  // 회원가입
  async register(
    userData: RegisterRequest,
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await this.makeRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token, response.data.refreshToken);
    }

    return response;
  }

  // 로그아웃
  async logout(): Promise<void> {
    await this.makeRequest("/auth/logout", { method: "POST" });
    this.clearToken();
  }

  // 프로필 조회
  async getProfile(): Promise<ApiResponse<User>> {
    return this.makeRequest<User>("/auth/profile");
  }

  // === 서비스 API ===

  // 서비스 목록 조회
  async getServices(): Promise<ApiResponse<Service[]>> {
    return this.makeRequest<Service[]>("/services");
  }

  // 서비스 상세 조회
  async getService(id: string): Promise<ApiResponse<Service>> {
    return this.makeRequest<Service>(`/services/${id}`);
  }

  // === 주문 API ===

  // 주문 생성
  async createOrder(orderRequest: {
    serviceId: string;
    quantity: number;
    targetUrl: string;
  }) {
    return this.makeRequest<OrderResponse>("/orders", {
      method: "POST",
      body: JSON.stringify(orderRequest),
    });
  }

  // 주문 목록 조회
  async getOrders(filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ orders: Order[]; total: number; page: number }>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const query = params.toString() ? `?${params.toString()}` : "";
    return this.makeRequest<{ orders: Order[]; total: number; page: number }>(
      `/order${query}`,
    );
  }

  // 주문 상세 조회
  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return this.makeRequest<Order>(`/order/${id}`);
  }

  // 주문 상태 업데이트
  async updateOrderStatus(
    id: string,
    status: string,
  ): Promise<ApiResponse<Order>> {
    return this.makeRequest<Order>(`/order/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  // === 결제 API ===

  // 결제 생성
  async createPayment(
    paymentData: PaymentRequest,
  ): Promise<ApiResponse<PaymentResponse>> {
    return this.makeRequest<PaymentResponse>("/payment/create", {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
  }

  // 카카오페이 결제 준비
  async prepareKakaoPayment(amount: number): Promise<ApiResponse<any>> {
    return this.makeRequest("/payment/kakao/ready", {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
  }

  // 토스페이 결제 확인
  async confirmTossPayment(
    paymentKey: string,
    orderId: string,
    amount: number,
  ): Promise<ApiResponse<any>> {
    return this.makeRequest("/payment/toss/confirm", {
      method: "POST",
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });
  }

  // 잔액 충전
  async addBalance(amount: number, method: string): Promise<ApiResponse<any>> {
    return this.makeRequest("/payment/recharge", {
      method: "POST",
      body: JSON.stringify({ amount, method }),
    });
  }

  // === 사용자 API ===

  // 사용자 정보 업데이트
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.makeRequest<User>("/user/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // 비밀번호 변경
  async changePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<ApiResponse<any>> {
    return this.makeRequest("/user/password", {
      method: "PATCH",
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  }

  // 잔액 조회
  async getBalance(): Promise<ApiResponse<{ balance: number }>> {
    return this.makeRequest<{ balance: number }>("/user/balance");
  }

  // === 관리자 API ===

  // 관리자 대시보드 데이터
  async getAdminDashboard(): Promise<ApiResponse<any>> {
    return this.makeRequest("/admin/dashboard");
  }

  // 모든 사용자 조회 (관리자)
  async getAllUsers(
    page = 1,
    limit = 20,
  ): Promise<ApiResponse<{ users: User[]; total: number }>> {
    return this.makeRequest<{ users: User[]; total: number }>(
      `/admin/users?page=${page}&limit=${limit}`,
    );
  }

  // 모든 주문 조회 (관리자)
  async getAllOrders(filters?: {
    status?: string;
    userId?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ orders: Order[]; total: number }>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.userId) params.append("userId", filters.userId);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const query = params.toString() ? `?${params.toString()}` : "";
    return this.makeRequest<{ orders: Order[]; total: number }>(
      `/admin/orders${query}`,
    );
  }

  // 서비스 관리 (관리자)
  async createService(
    serviceData: Omit<Service, "id">,
  ): Promise<ApiResponse<Service>> {
    return this.makeRequest<Service>("/admin/services", {
      method: "POST",
      body: JSON.stringify(serviceData),
    });
  }

  async updateService(
    id: string,
    serviceData: Partial<Service>,
  ): Promise<ApiResponse<Service>> {
    return this.makeRequest<Service>(`/admin/services/${id}`, {
      method: "PATCH",
      body: JSON.stringify(serviceData),
    });
  }

  async deleteService(id: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/admin/services/${id}`, {
      method: "DELETE",
    });
  }

  // === 통계 API ===

  // 분석 데이터 조회
  async getAnalytics(period = "7d"): Promise<ApiResponse<any>> {
    return this.makeRequest(`/analytics?period=${period}`);
  }

  // === 시스템 API ===

  // 서버 상태 확인
  async checkHealth(): Promise<ApiResponse<any>> {
    return this.makeRequest("/health");
  }

  // 실시간 알림 설정
  setupWebSocket(): WebSocket | null {
    if (!this.token) return null;

    try {
      const wsUrl = this.baseUrl.replace("http", "ws") + "/ws";
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket 연결됨");
        // 인증 토큰 전송
        ws.send(JSON.stringify({ type: "auth", token: this.token }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("WebSocket 메시지:", data);

          // 실시간 업데이트 처리
          this.handleRealtimeUpdate(data);
        } catch (error) {
          console.error("WebSocket 메시지 파싱 오류:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket 오류:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket 연결 종료");
        // 재연결 로직 (필요시)
      };

      return ws;
    } catch (error) {
      console.error("WebSocket 설정 오류:", error);
      return null;
    }
  }

  // 실시간 업데이트 처리
  private handleRealtimeUpdate(data: any) {
    switch (data.type) {
      case "order_update":
        // 주문 상태 업데이트
        window.dispatchEvent(
          new CustomEvent("orderUpdate", { detail: data.payload }),
        );
        break;
      case "balance_update":
        // 잔액 업데이트
        window.dispatchEvent(
          new CustomEvent("balanceUpdate", { detail: data.payload }),
        );
        break;
      case "notification":
        // 일반 알림
        window.dispatchEvent(
          new CustomEvent("notification", { detail: data.payload }),
        );
        break;
      default:
        console.log("알 수 없는 실시간 업데이트:", data);
    }
  }
}

// 싱글톤 인스턴스 생성
export const backendApi = new BackendApiService();

// 환경 변수 설정 가이드
export const BACKEND_ENV_GUIDE = `
# .env.local 파일에 다음 환경 변수를 설정하세요:

# 백엔드 API URL
VITE_BACKEND_API_URL=http://localhost:3000

# 프로덕션 환경에서는:
# VITE_BACKEND_API_URL=https://your-backend-domain.railway.app
`;

export default backendApi;
