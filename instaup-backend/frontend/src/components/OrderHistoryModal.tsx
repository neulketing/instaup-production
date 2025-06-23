import { useEffect, useState } from "react";
import { orderService } from "../services/orderService";
import { type OrderFilter, type OrderItem, OrderStatus } from "../types/orders";
import type { UserSession } from "../utils/auth";
import {
  exportFilteredOrders,
  exportOrderStatsToExcel,
  exportOrdersToExcel,
} from "../utils/excelExport";

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  userSession: UserSession | null;
}

export default function OrderHistoryModal({
  isOpen,
  onClose,
  isLoggedIn,
  userSession,
}: OrderHistoryModalProps) {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<OrderStatus | "all">(
    "all",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (isOpen && isLoggedIn && userSession) {
      loadOrders();

      // 실시간 업데이트 구독
      const unsubscribe = orderService.subscribe((updatedOrders) => {
        if (autoRefresh) {
          const userOrders = updatedOrders.filter(
            (order) => order.userId === userSession.id,
          );
          setOrders(userOrders);
        }
      });

      return unsubscribe;
    }
  }, [isOpen, isLoggedIn, userSession, autoRefresh]);

  const loadOrders = async () => {
    if (!userSession) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // 로딩 시뮬레이션

      const filter: OrderFilter = {
        ...(selectedFilter !== "all" && {
          status: selectedFilter as OrderStatus,
        }),
        ...(searchTerm && { search: searchTerm }),
      };

      const allOrders = orderService.getOrders(filter);
      const userOrders = allOrders.filter(
        (order) => order.userId === userSession.id,
      );
      setOrders(userOrders);
    } catch (error) {
      console.error("주문 내역 로딩 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefill = async (orderId: string) => {
    try {
      const refillOrder = orderService.requestRefill(orderId);
      if (refillOrder) {
        alert(
          "🎉 리필 요청이 완료되었습니다!\n\n무료로 감소된 수량을 보충해드립니다.\n주문 내역에서 진행 상황을 확인하세요.",
        );
        loadOrders();
      } else {
        alert(
          "❌ 리필 요청을 할 수 없습니다.\n\n• 리필 보장 기간이 지났거나\n• 감소된 수량이 없습니다.",
        );
      }
    } catch (error) {
      console.error("리필 요청 오류:", error);
      alert("리필 요청 중 오류가 발생했습니다.");
    }
  };

  const handleExportExcel = () => {
    if (orders.length === 0) {
      alert("내보낼 주문 데이터가 없습니다.");
      return;
    }

    const filterName =
      selectedFilter === "all"
        ? "전체"
        : getStatusText(selectedFilter as OrderStatus);
    exportFilteredOrders(filteredOrders, filterName);

    alert(`📊 ${filterName} 주문내역이 엑셀 파일로 다운로드되었습니다!`);
  };

  const handleExportStats = () => {
    if (!orderStats || !userSession) {
      alert("통계 데이터가 없습니다.");
      return;
    }

    exportOrderStatsToExcel(orderStats, orders);
    alert("📈 주문 통계가 엑셀 파일로 다운로드되었습니다!");
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return "text-green-600 bg-green-50 border-green-200";
      case OrderStatus.IN_PROGRESS:
        return "text-blue-600 bg-blue-50 border-blue-200";
      case OrderStatus.PROCESSING:
        return "text-purple-600 bg-purple-50 border-purple-200";
      case OrderStatus.PENDING:
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case OrderStatus.CANCELLED:
        return "text-red-600 bg-red-50 border-red-200";
      case OrderStatus.REFUNDED:
        return "text-gray-600 bg-gray-50 border-gray-200";
      case OrderStatus.PAUSED:
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return "완료";
      case OrderStatus.IN_PROGRESS:
        return "진행중";
      case OrderStatus.PROCESSING:
        return "처리중";
      case OrderStatus.PENDING:
        return "대기중";
      case OrderStatus.CANCELLED:
        return "취소됨";
      case OrderStatus.REFUNDED:
        return "환불됨";
      case OrderStatus.PAUSED:
        return "일시정지";
      default:
        return "알 수 없음";
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return "✅";
      case OrderStatus.IN_PROGRESS:
        return "⚡";
      case OrderStatus.PROCESSING:
        return "🔄";
      case OrderStatus.PENDING:
        return "⏳";
      case OrderStatus.CANCELLED:
        return "❌";
      case OrderStatus.REFUNDED:
        return "💰";
      case OrderStatus.PAUSED:
        return "⏸️";
      default:
        return "❓";
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return "📷";
      case "youtube":
        return "📹";
      case "tiktok":
        return "🎵";
      case "facebook":
        return "👥";
      default:
        return "📱";
    }
  };

  const filteredOrders =
    selectedFilter === "all"
      ? orders
      : orders.filter((order) => order.status === selectedFilter);

  const orderStats = userSession
    ? orderService.getOrderStats(userSession.id)
    : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="fixed right-0 top-0 h-full w-full max-w-6xl bg-white shadow-lg overflow-y-auto">
        {/* SNS샵 스타일 헤더 */}
        <div className="sticky top-0 bg-[#22426f] text-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="https://ext.same-assets.com/3036106235/246958056.svg"
                alt="SNS샵"
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold">주문 내역 관리</h1>
                <p className="text-sm opacity-90">
                  실시간 주문 현황 및 진행률을 확인하세요
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  autoRefresh
                    ? "bg-green-500 text-white"
                    : "bg-white bg-opacity-20 text-white"
                }`}
              >
                {autoRefresh ? "🟢 실시간" : "⏸️ 수동"}
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* 주문 통계 요약 */}
          {orderStats && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {orderStats.totalOrders}
                </div>
                <div className="text-sm text-blue-800">총 주문</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {orderStats.processingOrders}
                </div>
                <div className="text-sm text-yellow-800">진행중</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {orderStats.completedOrders}
                </div>
                <div className="text-sm text-green-800">완료</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(orderStats.completionRate)}%
                </div>
                <div className="text-sm text-purple-800">완료율</div>
              </div>
            </div>
          )}

          {/* 검색 및 필터 */}
          <div className="mb-6 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="주문번호, 서비스명, URL로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#22426f] focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <button
                onClick={loadOrders}
                className="px-6 py-2 bg-[#22426f] text-white rounded-lg hover:bg-[#1e3b61] transition-colors flex items-center gap-2"
              >
                🔍 검색
              </button>
              <button
                onClick={handleExportExcel}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                title="현재 필터된 주문내역을 엑셀로 내보내기"
              >
                📊 엑셀
              </button>
              <button
                onClick={handleExportStats}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                title="주문 통계를 엑셀로 내보내기"
              >
                📈 통계
              </button>
            </div>

            <div className="flex gap-2 flex-wrap">
              {[
                { key: "all", label: "전체", count: orders.length },
                {
                  key: OrderStatus.PENDING,
                  label: "대기중",
                  count: orders.filter((o) => o.status === OrderStatus.PENDING)
                    .length,
                },
                {
                  key: OrderStatus.PROCESSING,
                  label: "처리중",
                  count: orders.filter(
                    (o) => o.status === OrderStatus.PROCESSING,
                  ).length,
                },
                {
                  key: OrderStatus.IN_PROGRESS,
                  label: "진행중",
                  count: orders.filter(
                    (o) => o.status === OrderStatus.IN_PROGRESS,
                  ).length,
                },
                {
                  key: OrderStatus.COMPLETED,
                  label: "완료",
                  count: orders.filter(
                    (o) => o.status === OrderStatus.COMPLETED,
                  ).length,
                },
                {
                  key: OrderStatus.CANCELLED,
                  label: "취소됨",
                  count: orders.filter(
                    (o) => o.status === OrderStatus.CANCELLED,
                  ).length,
                },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === filter.key
                      ? "bg-[#22426f] text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>

          {/* 주문 목록 */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="loading-spinner w-8 h-8"></div>
              <span className="ml-3 text-gray-600">
                주문 내역을 불러오는 중...
              </span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {selectedFilter === "all"
                  ? "주문 내역이 없습니다"
                  : `${getStatusText(selectedFilter as OrderStatus)} 주문이 없습니다`}
              </h3>
              <p className="text-gray-600">첫 주문을 시작해보세요!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-lg transition-all hover:border-[#22426f]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">
                          {getPlatformIcon(order.platform)}
                        </span>
                        <h3 className="font-bold text-lg text-gray-900">
                          {order.serviceName}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(order.status)}`}
                        >
                          {getStatusIcon(order.status)}{" "}
                          {getStatusText(order.status)}
                        </span>
                        {order.isRefillRequest && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-bold">
                            🔄 리필
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">주문번호:</span>{" "}
                          {order.id}
                        </div>
                        <div>
                          <span className="font-medium">품질등급:</span>
                          <span
                            className={`ml-1 font-bold ${
                              order.quality === "vip"
                                ? "text-purple-600"
                                : order.quality === "premium"
                                  ? "text-blue-600"
                                  : "text-green-600"
                            }`}
                          >
                            {order.quality.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">주문일시:</span>{" "}
                          {new Date(order.createdAt).toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">예상완료:</span>{" "}
                          {order.estimatedCompletionTime}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-600 break-all">
                          <span className="font-medium">대상 URL:</span>{" "}
                          {order.targetUrl}
                        </p>
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <div className="text-2xl font-bold text-[#22426f] mb-1">
                        {order.finalPrice.toLocaleString()}원
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        {order.quantity.toLocaleString()}개 주문
                      </div>
                      {order.discountRate > 0 && (
                        <div className="text-xs text-red-600 font-bold">
                          {order.discountRate}% 할인 적용
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 진행률 표시 */}
                  {[OrderStatus.PROCESSING, OrderStatus.IN_PROGRESS].includes(
                    order.status,
                  ) && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 font-medium">
                          진행률
                        </span>
                        <div className="text-right">
                          <span className="font-bold text-[#22426f]">
                            {order.progressPercentage}%
                          </span>
                          <span className="text-gray-500 ml-2">
                            ({order.completedQuantity.toLocaleString()}/
                            {order.quantity.toLocaleString()})
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#22426f] to-blue-500 h-3 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${order.progressPercentage}%` }}
                        ></div>
                      </div>

                      {/* 진행 메시지 */}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-blue-600 font-medium">
                          {orderService.getOrderProgress(order.id)[0]
                            ?.message || "진행중..."}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 완료된 주문의 경우 완료 정보 표시 */}
                  {order.status === OrderStatus.COMPLETED && (
                    <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-green-600 text-xl">🎉</span>
                        <span className="font-bold text-green-800">
                          주문 완료!
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-green-600 font-medium">
                            완료일시:
                          </span>
                          <span className="ml-2">
                            {order.completedAt
                              ? new Date(order.completedAt).toLocaleString()
                              : "-"}
                          </span>
                        </div>
                        <div>
                          <span className="text-green-600 font-medium">
                            리필보장:
                          </span>
                          <span className="ml-2 font-bold">
                            {order.refillGuarantee}일
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 서비스 특징 */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {order.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
                        >
                          ✓ {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 액션 버튼들 */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      마지막 업데이트:{" "}
                      {new Date(order.updatedAt).toLocaleString()}
                    </div>
                    <div className="flex gap-2">
                      {order.status === OrderStatus.COMPLETED &&
                        !order.isRefillRequest && (
                          <button
                            onClick={() => handleRefill(order.id)}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors text-sm font-medium"
                          >
                            🔄 리필 요청
                          </button>
                        )}
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-4 py-2 bg-[#22426f] text-white rounded-lg hover:bg-[#1e3b61] transition-colors text-sm font-medium"
                      >
                        📊 상세보기
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 주문 상세 모달 */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">주문 상세 정보</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* 기본 정보 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold mb-3">📋 주문 정보</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium">주문번호:</span>{" "}
                        {selectedOrder.id}
                      </div>
                      <div>
                        <span className="font-medium">서비스:</span>{" "}
                        {selectedOrder.serviceName}
                      </div>
                      <div>
                        <span className="font-medium">플랫폼:</span>{" "}
                        {selectedOrder.platform}
                      </div>
                      <div>
                        <span className="font-medium">수량:</span>{" "}
                        {selectedOrder.quantity.toLocaleString()}개
                      </div>
                      <div>
                        <span className="font-medium">품질:</span>{" "}
                        {selectedOrder.quality.toUpperCase()}
                      </div>
                      <div>
                        <span className="font-medium">가격:</span>{" "}
                        {selectedOrder.finalPrice.toLocaleString()}원
                      </div>
                    </div>
                  </div>

                  {/* 진행 이력 */}
                  <div>
                    <h3 className="font-bold mb-3">📈 진행 이력</h3>
                    <div className="space-y-3">
                      {orderService
                        .getOrderProgress(selectedOrder.id)
                        .map((progress, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 bg-white border rounded-lg p-3"
                          >
                            <div className="text-xl">
                              {getStatusIcon(progress.status)}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">
                                {progress.message}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(progress.timestamp).toLocaleString()}
                              </div>
                              {progress.remainingTime && (
                                <div className="text-xs text-blue-600 font-medium">
                                  {progress.remainingTime}
                                </div>
                              )}
                            </div>
                            <div className="text-sm font-bold text-[#22426f]">
                              {progress.progressPercentage}%
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
