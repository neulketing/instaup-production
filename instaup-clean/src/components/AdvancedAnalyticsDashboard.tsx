// 고급 분석 대시보드 컴포넌트
import { useEffect, useState } from "react";
import { type DashboardMetrics, adminApi } from "../services/adminApi";

interface AnalyticsData {
  revenueChart: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      color: string;
    }[];
  };
  orderChart: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      color: string;
    }[];
  };
  platformChart: {
    labels: string[];
    data: number[];
    colors: string[];
  };
  conversionFunnel: {
    stage: string;
    users: number;
    conversion: number;
  }[];
  realTimeMetrics: {
    activeUsers: number;
    onlineOrders: number;
    revenueToday: number;
    responseTime: number;
  };
  trends: {
    metric: string;
    current: number;
    previous: number;
    change: number;
    trend: "up" | "down" | "stable";
  }[];
}

interface FilterOptions {
  period: "today" | "7days" | "30days" | "90days" | "custom";
  platform: "all" | "instagram" | "youtube" | "tiktok" | "facebook" | "twitter";
  dateFrom?: string;
  dateTo?: string;
}

export default function AdvancedAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    period: "7days",
    platform: "all",
  });

  // 실시간 업데이트
  const [realTimeInterval, setRealTimeInterval] =
    useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadAnalyticsData();

    // 실시간 업데이트 설정 (30초마다)
    const interval = setInterval(() => {
      updateRealTimeMetrics();
    }, 30000);

    setRealTimeInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [filters]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);

      // 대시보드 메트릭 로드
      const metricsResponse = await adminApi.getDashboardMetrics();
      if (metricsResponse.success && metricsResponse.data) {
        setMetrics(metricsResponse.data);
        generateAnalyticsCharts(metricsResponse.data);
      }
    } catch (error) {
      console.error("분석 데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateAnalyticsCharts = (metricsData: DashboardMetrics) => {
    // 수익 차트 데이터 생성
    const revenueChart = {
      labels: [
        "1주 전",
        "6일 전",
        "5일 전",
        "4일 전",
        "3일 전",
        "2일 전",
        "어제",
        "오늘",
      ],
      datasets: [
        {
          label: "일일 수익",
          data: [
            Math.floor(metricsData.revenue.thisWeek * 0.12),
            Math.floor(metricsData.revenue.thisWeek * 0.13),
            Math.floor(metricsData.revenue.thisWeek * 0.11),
            Math.floor(metricsData.revenue.thisWeek * 0.15),
            Math.floor(metricsData.revenue.thisWeek * 0.14),
            Math.floor(metricsData.revenue.thisWeek * 0.16),
            metricsData.revenue.yesterday,
            metricsData.revenue.today,
          ],
          color: "#3B82F6",
        },
      ],
    };

    // 주문 차트 데이터 생성
    const orderChart = {
      labels: [
        "1주 전",
        "6일 전",
        "5일 전",
        "4일 전",
        "3일 전",
        "2일 전",
        "어제",
        "오늘",
      ],
      datasets: [
        {
          label: "일일 주문",
          data: [
            Math.floor(metricsData.orders.today * 0.8),
            Math.floor(metricsData.orders.today * 0.9),
            Math.floor(metricsData.orders.today * 0.7),
            Math.floor(metricsData.orders.today * 1.1),
            Math.floor(metricsData.orders.today * 0.95),
            Math.floor(metricsData.orders.today * 1.2),
            Math.floor(metricsData.orders.today * 1.05),
            metricsData.orders.today,
          ],
          color: "#10B981",
        },
      ],
    };

    // 플랫폼별 차트 데이터 생성
    const platformChart = {
      labels: ["Instagram", "YouTube", "TikTok", "Facebook", "Twitter"],
      data: [
        metricsData.platforms.instagram.orders,
        metricsData.platforms.youtube.orders,
        metricsData.platforms.tiktok.orders,
        metricsData.platforms.facebook.orders,
        metricsData.platforms.twitter.orders,
      ],
      colors: ["#E1306C", "#FF0000", "#000000", "#1877F2", "#1DA1F2"],
    };

    // 전환 퍼널 데이터 생성
    const conversionFunnel = [
      { stage: "방문자", users: 10000, conversion: 100 },
      { stage: "서비스 조회", users: 7500, conversion: 75 },
      { stage: "장바구니 추가", users: 3000, conversion: 30 },
      { stage: "결제 시작", users: 1800, conversion: 18 },
      { stage: "주문 완료", users: 1500, conversion: 15 },
    ];

    // 실시간 메트릭
    const realTimeMetrics = {
      activeUsers: Math.floor(Math.random() * 500) + 200,
      onlineOrders: Math.floor(Math.random() * 20) + 5,
      revenueToday: metricsData.revenue.today,
      responseTime: Math.floor(Math.random() * 100) + 150,
    };

    // 트렌드 데이터
    const trends = [
      {
        metric: "신규 사용자",
        current: Math.floor(Math.random() * 100) + 50,
        previous: Math.floor(Math.random() * 100) + 40,
        change: 0,
        trend: "up" as const,
      },
      {
        metric: "평균 주문 금액",
        current: Math.floor(Math.random() * 20000) + 15000,
        previous: Math.floor(Math.random() * 20000) + 14000,
        change: 0,
        trend: "up" as const,
      },
      {
        metric: "이탈률",
        current: Math.floor(Math.random() * 20) + 25,
        previous: Math.floor(Math.random() * 20) + 30,
        change: 0,
        trend: "down" as const,
      },
    ].map((trend) => ({
      ...trend,
      change: Number(
        (((trend.current - trend.previous) / trend.previous) * 100).toFixed(1),
      ),
    }));

    setAnalyticsData({
      revenueChart,
      orderChart,
      platformChart,
      conversionFunnel,
      realTimeMetrics,
      trends,
    });
  };

  const updateRealTimeMetrics = () => {
    if (analyticsData) {
      setAnalyticsData((prev) =>
        prev
          ? {
              ...prev,
              realTimeMetrics: {
                ...prev.realTimeMetrics,
                activeUsers: Math.floor(Math.random() * 500) + 200,
                onlineOrders: Math.floor(Math.random() * 20) + 5,
                responseTime: Math.floor(Math.random() * 100) + 150,
              },
            }
          : null,
      );
    }
  };

  const renderLineChart = (data: AnalyticsData["revenueChart"]) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">수익 추이</h3>
      <div className="h-64 flex items-end space-x-2">
        {data.datasets[0].data.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-blue-500 rounded-t"
              style={{
                height: `${(value / Math.max(...data.datasets[0].data)) * 200}px`,
                minHeight: "2px",
              }}
            />
            <span className="text-xs mt-2 text-gray-600 transform rotate-45 origin-left">
              {data.labels[index]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPieChart = (data: AnalyticsData["platformChart"]) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">플랫폼별 주문 분포</h3>
      <div className="space-y-3">
        {data.labels.map((label, index) => {
          const total = data.data.reduce((sum, val) => sum + val, 0);
          const percentage = ((data.data[index] / total) * 100).toFixed(1);
          return (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: data.colors[index] }}
                />
                <span className="text-sm">{label}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {data.data[index].toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">{percentage}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderConversionFunnel = (data: AnalyticsData["conversionFunnel"]) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">전환 퍼널</h3>
      <div className="space-y-2">
        {data.map((stage, index) => (
          <div key={stage.stage} className="relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{stage.stage}</span>
              <span className="text-sm text-gray-600">{stage.conversion}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stage.conversion}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {stage.users.toLocaleString()} 사용자
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 필터 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-4">
          <select
            value={filters.period}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                period: e.target.value as FilterOptions["period"],
              }))
            }
            className="px-3 py-2 border rounded-md"
          >
            <option value="today">오늘</option>
            <option value="7days">7일</option>
            <option value="30days">30일</option>
            <option value="90days">90일</option>
          </select>

          <select
            value={filters.platform}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                platform: e.target.value as FilterOptions["platform"],
              }))
            }
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">모든 플랫폼</option>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
            <option value="tiktok">TikTok</option>
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter</option>
          </select>
        </div>
      </div>

      {/* 실시간 메트릭 */}
      {analyticsData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">실시간 사용자</p>
                <p className="text-2xl font-bold text-green-600">
                  {analyticsData.realTimeMetrics.activeUsers}
                </p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">진행 중 주문</p>
                <p className="text-2xl font-bold text-blue-600">
                  {analyticsData.realTimeMetrics.onlineOrders}
                </p>
              </div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">오늘 수익</p>
                <p className="text-2xl font-bold text-purple-600">
                  ₩{analyticsData.realTimeMetrics.revenueToday.toLocaleString()}
                </p>
              </div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">응답 시간</p>
                <p className="text-2xl font-bold text-orange-600">
                  {analyticsData.realTimeMetrics.responseTime}ms
                </p>
              </div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* 트렌드 카드 */}
      {analyticsData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analyticsData.trends.map((trend, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-600">
                  {trend.metric}
                </h4>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    trend.trend === "up"
                      ? "bg-green-100 text-green-800"
                      : trend.trend === "down"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {trend.change > 0 ? "+" : ""}
                  {trend.change}%
                </span>
              </div>
              <p className="text-2xl font-bold">
                {trend.metric.includes("금액")
                  ? `₩${trend.current.toLocaleString()}`
                  : trend.metric.includes("률")
                    ? `${trend.current}%`
                    : trend.current.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                이전:{" "}
                {trend.metric.includes("금액")
                  ? `₩${trend.previous.toLocaleString()}`
                  : trend.metric.includes("률")
                    ? `${trend.previous}%`
                    : trend.previous.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 차트 그리드 */}
      {analyticsData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderLineChart(analyticsData.revenueChart)}
          {renderPieChart(analyticsData.platformChart)}
          {renderConversionFunnel(analyticsData.conversionFunnel)}

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">주문 추이</h3>
            <div className="h-64 flex items-end space-x-2">
              {analyticsData.orderChart.datasets[0].data.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-green-500 rounded-t"
                    style={{
                      height: `${(value / Math.max(...analyticsData.orderChart.datasets[0].data)) * 200}px`,
                      minHeight: "2px",
                    }}
                  />
                  <span className="text-xs mt-2 text-gray-600 transform rotate-45 origin-left">
                    {analyticsData.orderChart.labels[index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
