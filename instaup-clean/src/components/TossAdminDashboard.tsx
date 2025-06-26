import type React from "react";
import { useEffect, useState } from "react";
import TossProductManagement from "./TossProductManagement";

// 토스 디자인 시스템 색상
const TossColors = {
  primary: "#3182F6",
  primaryHover: "#1B64DA",
  primaryLight: "#E8F3FF",
  secondary: "#F2F4F6",
  success: "#00C73C",
  warning: "#FFB800",
  error: "#F04452",
  text: {
    primary: "#191F28",
    secondary: "#6B7684",
    tertiary: "#8B95A1",
  },
  background: {
    primary: "#FFFFFF",
    secondary: "#F9FAFB",
  },
  border: "#E5E8EB",
};

// 대시보드 데이터 타입
interface DashboardMetrics {
  overview: {
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
    conversionRate: number;
    avgOrderValue: number;
  };
  platforms: {
    [key: string]: {
      orders: number;
      revenue: number;
      growth: number;
    };
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
  topServices: Array<{
    id: string;
    name: string;
    orders: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
    userId?: string;
    amount?: number;
    serviceId?: string;
  }>;
}

// API 서비스
class DashboardAPI {
  private static baseURL =
    import.meta.env.VITE_BACKEND_API_URL ||
    "https://instaup-production.up.railway.app";

  static async getDashboardMetrics(): Promise<{
    success: boolean;
    data: DashboardMetrics;
  }> {
    const response = await fetch(`${this.baseURL}/api/admin/dashboard`);
    return response.json();
  }

  static async getOrders(filters?: any) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${this.baseURL}/api/admin/orders?${params}`);
    return response.json();
  }

  static async updateOrderStatus(orderId: string, status: string) {
    const response = await fetch(
      `${this.baseURL}/api/admin/orders/${orderId}/status`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      },
    );
    return response.json();
  }
}

// 토스 스타일 카드 컴포넌트
const TossCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}> = ({ children, className = "", hoverable = false }) => {
  const hoverEffect = hoverable ? "hover:shadow-lg hover:-translate-y-1" : "";

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-[${TossColors.border}] transition-all duration-200 ${hoverEffect} ${className}`}
    >
      {children}
    </div>
  );
};

// 통계 카드 컴포넌트
const StatCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  color: string;
  prefix?: string;
  suffix?: string;
}> = ({ title, value, change, icon, color, prefix = "", suffix = "" }) => {
  const changeColor =
    change && change > 0
      ? "text-green-600"
      : change && change < 0
        ? "text-red-600"
        : "text-gray-500";
  const changeIcon =
    change && change > 0 ? "↗" : change && change < 0 ? "↘" : "";

  return (
    <TossCard hoverable className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[#6B7684] text-sm font-medium">{title}</div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
          style={{ backgroundColor: `${color}15` }}
        >
          {icon}
        </div>
      </div>

      <div className="mb-2">
        <span className="text-2xl font-bold text-[#191F28]">
          {prefix}
          {typeof value === "number" ? value.toLocaleString() : value}
          {suffix}
        </span>
      </div>

      {change !== undefined && (
        <div
          className={`text-sm font-medium ${changeColor} flex items-center gap-1`}
        >
          <span>{changeIcon}</span>
          <span>{Math.abs(change)}%</span>
          <span className="text-[#6B7684]">vs 어제</span>
        </div>
      )}
    </TossCard>
  );
};

// 플랫폼 통계 컴포넌트
const PlatformStats: React.FC<{ platforms: DashboardMetrics["platforms"] }> = ({
  platforms,
}) => {
  const platformInfo: {
    [key: string]: { name: string; icon: string; color: string };
  } = {
    instagram: { name: "인스타그램", icon: "📷", color: "#E4405F" },
    youtube: { name: "유튜브", icon: "🎥", color: "#FF0000" },
    tiktok: { name: "틱톡", icon: "🎵", color: "#000000" },
    facebook: { name: "페이스북", icon: "📘", color: "#1877F2" },
    twitter: { name: "트위터", icon: "🐦", color: "#1DA1F2" },
  };

  return (
    <TossCard className="p-6">
      <h3 className="text-lg font-bold text-[#191F28] mb-6">플랫폼별 성과</h3>

      <div className="space-y-4">
        {Object.entries(platforms).map(([platform, data]) => {
          const info = platformInfo[platform] || {
            name: platform,
            icon: "📱",
            color: TossColors.primary,
          };

          return (
            <div
              key={platform}
              className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${info.color}15` }}
                >
                  {info.icon}
                </div>
                <div>
                  <div className="font-semibold text-[#191F28]">
                    {info.name}
                  </div>
                  <div className="text-sm text-[#6B7684]">
                    {data.orders.toLocaleString()}건 주문
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-[#191F28] text-lg">
                  ₩{(data.revenue / 1000000).toFixed(1)}M
                </div>
                <div
                  className={`text-sm font-medium ${data.growth > 0 ? "text-green-600" : data.growth < 0 ? "text-red-600" : "text-gray-500"}`}
                >
                  {data.growth > 0 ? "+" : ""}
                  {data.growth}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </TossCard>
  );
};

// 최근 활동 컴포넌트
const RecentActivity: React.FC<{
  activities: DashboardMetrics["recentActivity"];
}> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order":
        return "🛒";
      case "payment":
        return "💳";
      case "service":
        return "⚙️";
      case "user":
        return "👤";
      default:
        return "📢";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "order":
        return TossColors.primary;
      case "payment":
        return TossColors.success;
      case "service":
        return TossColors.warning;
      case "user":
        return TossColors.secondary;
      default:
        return TossColors.text.secondary;
    }
  };

  return (
    <TossCard className="p-6">
      <h3 className="text-lg font-bold text-[#191F28] mb-6">최근 활동</h3>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 hover:bg-[#F9FAFB] rounded-xl transition-colors"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
              style={{
                backgroundColor: `${getActivityColor(activity.type)}15`,
              }}
            >
              {getActivityIcon(activity.type)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#191F28] leading-relaxed">
                {activity.description}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[#6B7684]">
                  {new Date(activity.timestamp).toLocaleString("ko-KR")}
                </span>
                {activity.amount && (
                  <span className="text-xs bg-[#E8F3FF] text-[#3182F6] px-2 py-1 rounded-md font-medium">
                    ₩{activity.amount.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </TossCard>
  );
};

// 인기 서비스 컴포넌트
const TopServices: React.FC<{ services: DashboardMetrics["topServices"] }> = ({
  services,
}) => {
  return (
    <TossCard className="p-6">
      <h3 className="text-lg font-bold text-[#191F28] mb-6">인기 서비스</h3>

      <div className="space-y-4">
        {services.map((service, index) => (
          <div
            key={service.id}
            className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  index === 0
                    ? "bg-yellow-500"
                    : index === 1
                      ? "bg-gray-400"
                      : index === 2
                        ? "bg-orange-500"
                        : "bg-[#3182F6]"
                }`}
              >
                {index + 1}
              </div>
              <div>
                <div className="font-semibold text-[#191F28] text-sm">
                  {service.name}
                </div>
                <div className="text-xs text-[#6B7684]">
                  {service.orders.toLocaleString()}건 주문
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold text-[#191F28]">
                ₩{(service.revenue / 1000000).toFixed(1)}M
              </div>
            </div>
          </div>
        ))}
      </div>
    </TossCard>
  );
};

// 주문 관리 컴포넌트
const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    platform: "all",
    search: "",
  });

  useEffect(() => {
    loadOrders();
  }, [filters]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await DashboardAPI.getOrders(filters);
      if (response.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("주문 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const response = await DashboardAPI.updateOrderStatus(orderId, newStatus);
      if (response.success) {
        loadOrders();
      }
    } catch (error) {
      console.error("주문 상태 업데이트 실패:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: "대기 중",
      processing: "처리 중",
      completed: "완료",
      failed: "실패",
      cancelled: "취소",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* 필터 */}
      <TossCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#191F28] mb-2">
              상태
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent"
            >
              <option value="all">전체</option>
              <option value="pending">대기 중</option>
              <option value="processing">처리 중</option>
              <option value="completed">완료</option>
              <option value="failed">실패</option>
              <option value="cancelled">취소</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#191F28] mb-2">
              플랫폼
            </label>
            <select
              value={filters.platform}
              onChange={(e) =>
                setFilters({ ...filters, platform: e.target.value })
              }
              className="w-full px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent"
            >
              <option value="all">전체</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="facebook">Facebook</option>
              <option value="twitter">Twitter</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#191F28] mb-2">
              검색
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              placeholder="주문 ID, 사용자 ID 검색"
              className="w-full px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent"
            />
          </div>
        </div>
      </TossCard>

      {/* 주문 목록 */}
      <TossCard>
        <div className="p-6 border-b border-[#E5E8EB]">
          <h3 className="text-lg font-bold text-[#191F28]">주문 목록</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-6 h-6 border-4 border-[#3182F6] border-t-transparent rounded-full"></div>
            <span className="ml-3 text-[#6B7684]">로딩 중...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-bold text-[#191F28] mb-2">
              주문이 없습니다
            </h3>
            <p className="text-[#6B7684]">현재 조건에 맞는 주문이 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F9FAFB]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#191F28]">
                    주문 ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#191F28]">
                    서비스
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#191F28]">
                    플랫폼
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#191F28]">
                    수량
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#191F28]">
                    금액
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#191F28]">
                    상태
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#191F28]">
                    생성일
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#191F28]">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E8EB]">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[#F9FAFB] transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[#191F28]">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#191F28]">
                      {order.serviceName}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#191F28]">
                      {order.platform}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#191F28]">
                      {order.quantity.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#191F28]">
                      ₩{order.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6B7684]">
                      {new Date(order.createdAt).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusUpdate(order.id, e.target.value)
                        }
                        className="text-xs border border-[#E5E8EB] rounded-lg px-2 py-1 focus:ring-2 focus:ring-[#3182F6] focus:border-transparent"
                      >
                        <option value="pending">대기 중</option>
                        <option value="processing">처리 중</option>
                        <option value="completed">완료</option>
                        <option value="failed">실패</option>
                        <option value="cancelled">취소</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TossCard>
    </div>
  );
};

// 플랫폼 데이터 타입 추가
interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
  isActive: boolean;
  isVisible: boolean;
  sortOrder: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// 플랫폼 API 서비스 추가
class PlatformAPI {
  private static baseURL =
    import.meta.env.VITE_BACKEND_API_URL ||
    "https://instaup-production.up.railway.app";

  static async getPlatforms() {
    const response = await fetch(`${this.baseURL}/api/admin/platforms`);
    return response.json();
  }

  static async createPlatform(platform: Partial<Platform>) {
    const response = await fetch(`${this.baseURL}/api/admin/platforms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(platform),
    });
    return response.json();
  }

  static async updatePlatform(id: string, platform: Partial<Platform>) {
    const response = await fetch(`${this.baseURL}/api/admin/platforms/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(platform),
    });
    return response.json();
  }

  static async deletePlatform(id: string) {
    const response = await fetch(`${this.baseURL}/api/admin/platforms/${id}`, {
      method: "DELETE",
    });
    return response.json();
  }
}

// 플랫폼 관리 컴포넌트 추가
const PlatformManagement: React.FC = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [formData, setFormData] = useState<Partial<Platform>>({});

  useEffect(() => {
    loadPlatforms();
  }, []);

  const loadPlatforms = async () => {
    try {
      setLoading(true);
      const response = await PlatformAPI.getPlatforms();
      if (response.success) {
        setPlatforms(response.data);
      }
    } catch (error) {
      console.error("플랫폼 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (platform: Platform) => {
    setEditingPlatform(platform);
    setFormData(platform);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingPlatform(null);
    setFormData({
      name: "",
      icon: "📱",
      color: "#3182F6",
      isActive: true,
      isVisible: true,
      sortOrder: platforms.length + 1,
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description) {
      alert("플랫폼명과 설명을 입력해주세요.");
      return;
    }

    try {
      let response;
      if (editingPlatform) {
        response = await PlatformAPI.updatePlatform(
          editingPlatform.id,
          formData,
        );
      } else {
        response = await PlatformAPI.createPlatform({
          ...formData,
          id:
            formData.name?.toLowerCase().replace(/\s+/g, "_") ||
            `platform_${Date.now()}`,
        });
      }

      if (response.success) {
        setIsModalOpen(false);
        setEditingPlatform(null);
        setFormData({});
        loadPlatforms();
      }
    } catch (error) {
      console.error("플랫폼 저장 실패:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("정말 이 플랫폼을 삭제하시겠습니까?")) {
      try {
        const response = await PlatformAPI.deletePlatform(id);
        if (response.success) {
          loadPlatforms();
        }
      } catch (error) {
        console.error("플랫폼 삭제 실패:", error);
      }
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await PlatformAPI.updatePlatform(id, { isActive });
      if (response.success) {
        loadPlatforms();
      }
    } catch (error) {
      console.error("플랫폼 상태 변경 실패:", error);
    }
  };

  const handleToggleVisible = async (id: string, isVisible: boolean) => {
    try {
      const response = await PlatformAPI.updatePlatform(id, { isVisible });
      if (response.success) {
        loadPlatforms();
      }
    } catch (error) {
      console.error("플랫폼 표시 상태 변경 실패:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#191F28] mb-2">
            🏗️ 플랫폼 관리
          </h2>
          <p className="text-[#6B7684]">
            서비스 플랫폼을 관리하고 고객에게 노출될 서비스를 설정하세요
          </p>
        </div>
        <TossButton variant="primary" onClick={handleAddNew} icon="+">
          새 플랫폼 추가
        </TossButton>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <TossCard className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#191F28] mb-1">
              {platforms.length}
            </div>
            <div className="text-[#6B7684] text-sm">전체 플랫폼</div>
          </div>
        </TossCard>
        <TossCard className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#00C73C] mb-1">
              {platforms.filter((p) => p.isActive).length}
            </div>
            <div className="text-[#6B7684] text-sm">활성 플랫폼</div>
          </div>
        </TossCard>
        <TossCard className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#3182F6] mb-1">
              {platforms.filter((p) => p.isVisible).length}
            </div>
            <div className="text-[#6B7684] text-sm">공개 플랫폼</div>
          </div>
        </TossCard>
        <TossCard className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#FFB800] mb-1">
              {platforms.filter((p) => !p.isActive).length}
            </div>
            <div className="text-[#6B7684] text-sm">비활성 플랫폼</div>
          </div>
        </TossCard>
      </div>

      {/* 플랫폼 목록 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-6 h-6 border-4 border-[#3182F6] border-t-transparent rounded-full"></div>
          <span className="ml-3 text-[#6B7684]">로딩 중...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((platform) => (
              <TossCard key={platform.id} hoverable className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${platform.color}15` }}
                    >
                      {platform.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#191F28] text-lg">
                        {platform.name}
                      </h3>
                      <p className="text-[#6B7684] text-sm">
                        {platform.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {/* 활성화 토글 */}
                    <button
                      onClick={() =>
                        handleToggleActive(platform.id, !platform.isActive)
                      }
                      className={`w-12 h-6 rounded-full transition-all duration-200 relative ${
                        platform.isActive ? "bg-[#00C73C]" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${
                          platform.isActive ? "left-6" : "left-0.5"
                        }`}
                      />
                    </button>
                    <span className="text-xs text-center text-[#6B7684]">
                      {platform.isActive ? "활성" : "비활성"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* 표시 상태 */}
                  <div className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-xl">
                    <span className="text-sm font-medium text-[#191F28]">
                      고객에게 표시
                    </span>
                    <button
                      onClick={() =>
                        handleToggleVisible(platform.id, !platform.isVisible)
                      }
                      className={`w-10 h-5 rounded-full transition-all duration-200 relative ${
                        platform.isVisible ? "bg-[#3182F6]" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${
                          platform.isVisible ? "left-5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  {/* 정렬 순서 */}
                  <div className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-xl">
                    <span className="text-sm font-medium text-[#191F28]">
                      정렬 순서
                    </span>
                    <span className="text-sm font-bold text-[#191F28]">
                      {platform.sortOrder}
                    </span>
                  </div>

                  {/* 상태 배지 */}
                  <div className="flex gap-2">
                    {platform.isActive && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-md">
                        활성
                      </span>
                    )}
                    {platform.isVisible && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md">
                        공개
                      </span>
                    )}
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex gap-2 pt-3">
                    <TossButton
                      variant="primary"
                      size="small"
                      onClick={() => handleEdit(platform)}
                      icon="✏️"
                    >
                      수정
                    </TossButton>
                    <TossButton
                      variant="error"
                      size="small"
                      onClick={() => handleDelete(platform.id)}
                      icon="🗑️"
                    >
                      삭제
                    </TossButton>
                  </div>
                </div>
              </TossCard>
            ))}
        </div>
      )}

      {/* 편집 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#E5E8EB]">
              <h3 className="text-xl font-bold text-[#191F28]">
                {editingPlatform ? "플랫폼 수정" : "새 플랫폼 추가"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#191F28] mb-2">
                  플랫폼명
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent"
                  placeholder="예: 인스타그램"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#191F28] mb-2">
                  아이콘 (이모지)
                </label>
                <input
                  type="text"
                  value={formData.icon || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent"
                  placeholder="📷"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#191F28] mb-2">
                  브랜드 색상
                </label>
                <input
                  type="color"
                  value={formData.color || "#3182F6"}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="w-full h-12 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#191F28] mb-2">
                  설명
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent resize-none"
                  placeholder="플랫폼 설명을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#191F28] mb-2">
                  정렬 순서
                </label>
                <input
                  type="number"
                  value={formData.sortOrder || 1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sortOrder: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-[#E5E8EB] rounded-xl focus:ring-2 focus:ring-[#3182F6] focus:border-transparent"
                  min="1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive || false}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-5 h-5 text-[#3182F6] border-2 border-gray-300 rounded focus:ring-[#3182F6]"
                  />
                  <span className="text-sm font-medium text-[#191F28]">
                    활성화
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVisible || false}
                    onChange={(e) =>
                      setFormData({ ...formData, isVisible: e.target.checked })
                    }
                    className="w-5 h-5 text-[#3182F6] border-2 border-gray-300 rounded focus:ring-[#3182F6]"
                  />
                  <span className="text-sm font-medium text-[#191F28]">
                    고객에게 표시
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-[#E5E8EB]">
              <TossButton
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                취소
              </TossButton>
              <TossButton variant="primary" onClick={handleSave}>
                저장
              </TossButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 메인 대시보드 컴포넌트 수정
export default function TossAdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "platforms" | "products" | "orders"
  >("dashboard");
  const [dashboardData, setDashboardData] = useState<DashboardMetrics | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === "dashboard") {
      loadDashboardData();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await DashboardAPI.getDashboardMetrics();
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("대시보드 데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "dashboard", name: "대시보드", icon: "📊" },
    { id: "platforms", name: "플랫폼 관리", icon: "🏗️" },
    { id: "products", name: "상품 관리", icon: "📦" },
    { id: "orders", name: "주문 관리", icon: "🛒" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* 헤더 */}
      <div className="bg-white border-b border-[#E5E8EB] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#3182F6] to-[#1B64DA] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#191F28]">
                  InstaUp 관리자
                </h1>
                <p className="text-sm text-[#6B7684]">
                  토스 스타일 관리 대시보드
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
              <span className="text-sm text-[#6B7684]">실시간 연동 중</span>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b border-[#E5E8EB]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-[#3182F6] text-[#3182F6]"
                    : "border-transparent text-[#6B7684] hover:text-[#191F28]"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "dashboard" && (
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-[#3182F6] border-t-transparent rounded-full"></div>
                <span className="ml-3 text-[#6B7684]">대시보드 로딩 중...</span>
              </div>
            ) : dashboardData ? (
              <div className="space-y-8">
                {/* 통계 카드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="총 사용자"
                    value={dashboardData.overview.totalUsers}
                    icon="👥"
                    color="#3182F6"
                    change={5.2}
                  />
                  <StatCard
                    title="총 주문"
                    value={dashboardData.overview.totalOrders}
                    icon="📦"
                    color="#00C73C"
                    change={12.8}
                  />
                  <StatCard
                    title="총 매출"
                    value={`${(dashboardData.overview.totalRevenue / 1000000).toFixed(1)}M`}
                    icon="💰"
                    color="#FFB800"
                    prefix="₩"
                    change={7.3}
                  />
                  <StatCard
                    title="전환율"
                    value={dashboardData.overview.conversionRate}
                    icon="🎯"
                    color="#F04452"
                    suffix="%"
                    change={-1.2}
                  />
                </div>

                {/* 그래프 및 세부 정보 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <PlatformStats platforms={dashboardData.platforms} />
                  <TopServices services={dashboardData.topServices} />
                </div>

                {/* 최근 활동 */}
                <RecentActivity activities={dashboardData.recentActivity} />
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-[#191F28] mb-2">
                  데이터를 불러올 수 없습니다
                </h3>
                <p className="text-[#6B7684] mb-6">
                  백엔드 연결을 확인해주세요.
                </p>
                <button
                  onClick={loadDashboardData}
                  className="px-6 py-3 bg-[#3182F6] text-white rounded-xl font-medium hover:bg-[#1B64DA] transition-colors"
                >
                  다시 시도
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "platforms" && <PlatformManagement />}
        {activeTab === "products" && <TossProductManagement />}
        {activeTab === "orders" && <OrderManagement />}
      </div>
    </div>
  );
}
