import { useEffect, useState } from "react";
import { analytics } from "../services/analytics";

interface DashboardMetrics {
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    growth: number;
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    successRate: number;
  };
  users: {
    total: number;
    active: number;
    newToday: number;
    retention: number;
  };
  platforms: {
    instagram: number;
    youtube: number;
    tiktok: number;
    facebook: number;
    twitter: number;
  };
  payments: {
    card: number;
    kakaopay: number;
    naverpay: number;
    tosspay: number;
    bank: number;
    phone: number;
  };
}

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminDashboard({
  isOpen,
  onClose,
}: AdminDashboardProps) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<
    "today" | "week" | "month" | "year"
  >("today");
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "users" | "revenue" | "analytics"
  >("overview");

  // 실시간 데이터 시뮬레이션
  useEffect(() => {
    if (isOpen) {
      fetchDashboardData();
      const interval = setInterval(fetchDashboardData, 30000); // 30초마다 업데이트
      return () => clearInterval(interval);
    }
  }, [isOpen, timeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);

    // 실제 환경에서는 API 호출
    // const response = await fetch('/api/admin/dashboard')
    // const data = await response.json()

    // 시뮬레이션 데이터
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setMetrics({
      revenue: {
        today: Math.floor(Math.random() * 5000000) + 1000000, // 100만~600만원
        thisWeek: Math.floor(Math.random() * 20000000) + 5000000,
        thisMonth: Math.floor(Math.random() * 80000000) + 20000000,
        growth: Math.floor(Math.random() * 30) + 5, // 5~35% 성장률
      },
      orders: {
        total: Math.floor(Math.random() * 10000) + 5000,
        pending: Math.floor(Math.random() * 50) + 10,
        processing: Math.floor(Math.random() * 100) + 20,
        completed: Math.floor(Math.random() * 9000) + 4000,
        successRate: 95 + Math.random() * 4, // 95~99%
      },
      users: {
        total: Math.floor(Math.random() * 50000) + 10000,
        active: Math.floor(Math.random() * 5000) + 1000,
        newToday: Math.floor(Math.random() * 100) + 20,
        retention: 75 + Math.random() * 20, // 75~95%
      },
      platforms: {
        instagram: 65 + Math.random() * 20, // 65~85%
        youtube: 15 + Math.random() * 10, // 15~25%
        tiktok: 8 + Math.random() * 7, // 8~15%
        facebook: 3 + Math.random() * 5, // 3~8%
        twitter: 2 + Math.random() * 3, // 2~5%
      },
      payments: {
        card: 40 + Math.random() * 20, // 40~60%
        kakaopay: 20 + Math.random() * 15, // 20~35%
        naverpay: 10 + Math.random() * 10, // 10~20%
        tosspay: 8 + Math.random() * 7, // 8~15%
        bank: 5 + Math.random() * 5, // 5~10%
        phone: 2 + Math.random() * 3, // 2~5%
      },
    });

    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="fixed right-0 top-0 h-full w-full max-w-7xl bg-white shadow-lg overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#22426f] to-[#1e3b61] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">📊</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  관리자 대시보드
                </h1>
                <p className="text-sm text-gray-600">
                  실시간 비즈니스 분석 및 운영 현황
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* 시간 범위 선택 */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22426f]"
              >
                <option value="today">오늘</option>
                <option value="week">이번 주</option>
                <option value="month">이번 달</option>
                <option value="year">올해</option>
              </select>

              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <span className="text-gray-600">✕</span>
              </button>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex items-center gap-1 mt-6">
            {[
              { id: "overview", label: "📈 개요", icon: "📈" },
              { id: "orders", label: "🛒 주문", icon: "🛒" },
              { id: "users", label: "👥 사용자", icon: "👥" },
              { id: "revenue", label: "💰 수익", icon: "💰" },
              { id: "analytics", label: "📊 분석", icon: "📊" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#22426f] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 대시보드 내용 */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="loading-spinner w-8 h-8 mr-3"></div>
              <span className="text-gray-600">데이터를 로딩 중...</span>
            </div>
          ) : metrics ? (
            <>
              {/* 개요 탭 */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* 주요 KPI 카드 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-600">
                            오늘 매출
                          </p>
                          <p className="text-2xl font-bold text-blue-900">
                            {formatCurrency(metrics.revenue.today)}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xl">💰</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center">
                        <span className="text-green-600 text-sm font-medium">
                          +{formatPercent(metrics.revenue.growth)}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">
                          vs 어제
                        </span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-600">
                            완료된 주문
                          </p>
                          <p className="text-2xl font-bold text-green-900">
                            {metrics.orders.completed.toLocaleString()}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xl">✅</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center">
                        <span className="text-green-600 text-sm font-medium">
                          {formatPercent(metrics.orders.successRate)}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">
                          성공률
                        </span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-600">
                            활성 사용자
                          </p>
                          <p className="text-2xl font-bold text-purple-900">
                            {metrics.users.active.toLocaleString()}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xl">👥</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center">
                        <span className="text-purple-600 text-sm font-medium">
                          +{metrics.users.newToday}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">
                          신규 오늘
                        </span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-orange-600">
                            진행 중 주문
                          </p>
                          <p className="text-2xl font-bold text-orange-900">
                            {metrics.orders.processing}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xl">🔄</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center">
                        <span className="text-orange-600 text-sm font-medium">
                          {metrics.orders.pending}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">
                          대기 중
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 플랫폼별 주문 분포 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg border p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        📱 플랫폼별 주문 분포
                      </h3>
                      <div className="space-y-4">
                        {Object.entries(metrics.platforms).map(
                          ([platform, percentage]) => (
                            <div
                              key={platform}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-[#22426f] to-blue-500"></span>
                                <span className="font-medium capitalize">
                                  {platform}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-2 bg-gray-200 rounded-full">
                                  <div
                                    className="h-2 bg-gradient-to-r from-[#22426f] to-blue-500 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium w-12 text-right">
                                  {formatPercent(percentage)}
                                </span>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        💳 결제 수단별 분포
                      </h3>
                      <div className="space-y-4">
                        {Object.entries(metrics.payments).map(
                          ([method, percentage]) => (
                            <div
                              key={method}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></span>
                                <span className="font-medium capitalize">
                                  {method}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-2 bg-gray-200 rounded-full">
                                  <div
                                    className="h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium w-12 text-right">
                                  {formatPercent(percentage)}
                                </span>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 실시간 알림 및 이벤트 */}
              {activeTab === "analytics" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      🔔 실시간 활동
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          time: "방금 전",
                          event: "신규 주문",
                          detail: "Instagram 팔로워 1,000개 주문",
                          type: "order",
                        },
                        {
                          time: "2분 전",
                          event: "결제 완료",
                          detail: "카카오페이 50,000원 충전",
                          type: "payment",
                        },
                        {
                          time: "5분 전",
                          event: "회원가입",
                          detail: "신규 사용자 가입",
                          type: "user",
                        },
                        {
                          time: "8분 전",
                          event: "주문 완료",
                          detail: "YouTube 구독자 500개 완료",
                          type: "complete",
                        },
                        {
                          time: "10분 전",
                          event: "리필 요청",
                          detail: "Instagram 팔로워 리필 신청",
                          type: "refill",
                        },
                      ].map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              activity.type === "order"
                                ? "bg-blue-500"
                                : activity.type === "payment"
                                  ? "bg-green-500"
                                  : activity.type === "user"
                                    ? "bg-purple-500"
                                    : activity.type === "complete"
                                      ? "bg-emerald-500"
                                      : "bg-orange-500"
                            }`}
                          ></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">
                                {activity.event}
                              </span>
                              <span className="text-xs text-gray-500">
                                {activity.time}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {activity.detail}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI 추천 및 인사이트 */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      🤖 AI 인사이트 및 추천
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">🎯</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              마케팅 최적화 제안
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Instagram 팔로워 서비스의 수요가 65% 증가했습니다.
                              프로모션을 통해 추가 매출을 확보할 수 있습니다.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">📈</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              수익 증대 기회
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              YouTube 서비스 단가를 10% 인상하면 월 300만원 추가
                              수익이 예상됩니다.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">⚠️</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              주의 필요
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              TikTok 서비스의 완료율이 85%로 하락했습니다.
                              제공업체 점검이 필요합니다.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📊</div>
              <p className="text-gray-600">데이터를 불러올 수 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 실시간 업데이트 표시 */}
      <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
        🟢 실시간 업데이트 중
      </div>
    </div>
  );
}
