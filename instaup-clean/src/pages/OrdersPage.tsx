import React, { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import type { UserSession } from "../utils/auth";

type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

type OrderItem = {
  id: string;
  serviceId: string;
  serviceName: string;
  targetUrl: string;
  quantity: number;
  price: number;
  status: OrderStatus;
  progress: number;
  createdAt: string;
  completedAt?: string;
  description?: string;
};

interface OrdersPageProps {
  userSession: UserSession | null;
}

const mockOrders: OrderItem[] = [
  {
    id: "ORD-001",
    serviceId: "instagram-followers-kr",
    serviceName: "Instagram 한국인 팔로워",
    targetUrl: "https://instagram.com/example",
    quantity: 1000,
    price: 18000,
    status: "completed",
    progress: 100,
    createdAt: "2024-06-20T10:30:00Z",
    completedAt: "2024-06-20T11:45:00Z",
    description: "고품질 한국인 팔로워 1000명",
  },
  {
    id: "ORD-002",
    serviceId: "instagram-likes-kr",
    serviceName: "Instagram 좋아요",
    targetUrl: "https://instagram.com/p/example",
    quantity: 500,
    price: 9000,
    status: "processing",
    progress: 75,
    createdAt: "2024-06-20T14:20:00Z",
    description: "게시물 좋아요 500개",
  },
  {
    id: "ORD-003",
    serviceId: "youtube-subscribers",
    serviceName: "YouTube 구독자",
    targetUrl: "https://youtube.com/@example",
    quantity: 200,
    price: 15000,
    status: "pending",
    progress: 0,
    createdAt: "2024-06-20T16:10:00Z",
    description: "YouTube 채널 구독자 200명",
  },
];

async function fetchOrders(userId?: string): Promise<OrderItem[]> {
  // 실제 API 호출 시뮬레이션
  return new Promise((resolve) => {
    setTimeout(() => {
      // 사용자가 로그인한 경우만 주문 내역 반환
      if (userId) {
        resolve(mockOrders);
      } else {
        resolve([]);
      }
    }, 1000); // 1초 지연으로 로딩 시뮬레이션
  });
}

function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case "completed":
      return "text-green-600 bg-green-50";
    case "processing":
      return "text-blue-600 bg-blue-50";
    case "pending":
      return "text-yellow-600 bg-yellow-50";
    case "failed":
      return "text-red-600 bg-red-50";
    case "cancelled":
      return "text-gray-600 bg-gray-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
}

function getStatusText(status: OrderStatus): string {
  switch (status) {
    case "completed":
      return "완료";
    case "processing":
      return "처리중";
    case "pending":
      return "대기중";
    case "failed":
      return "실패";
    case "cancelled":
      return "취소됨";
    default:
      return "알 수 없음";
  }
}

function OrdersPage({ userSession }: OrdersPageProps) {
  const socket = useSocket();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      setError(null);
      const orderData = await fetchOrders(userSession?.userId);
      setOrders(orderData);
    } catch (err) {
      setError("주문 내역을 불러오는 중 오류가 발생했습니다.");
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
  };

  useEffect(() => {
    if (userSession) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [userSession]);

  useEffect(() => {
    if (!socket) return;

    const handler = (update: {
      orderId: string;
      status: OrderStatus;
      progress: number;
    }) => {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === update.orderId
            ? { ...order, status: update.status, progress: update.progress }
            : order,
        ),
      );
    };

    socket.on("order_update", handler);
    return () => {
      socket.off("order_update", handler);
    };
  }, [socket]);

  if (!userSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            로그인이 필요합니다
          </h2>
          <p className="text-gray-600">
            주문 내역을 확인하려면 먼저 로그인해주세요.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22426f] mx-auto mb-4"></div>
          <p className="text-gray-600">주문 내역을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            오류가 발생했습니다
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-2 bg-[#22426f] text-white rounded-lg hover:bg-[#1a365d] transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">주문 관리</h1>
            <p className="text-gray-600 mt-1">
              총 {orders.length}개의 주문이 있습니다
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <svg
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            <span>{refreshing ? "새로고침 중..." : "새로고침"}</span>
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              주문 내역이 없습니다
            </h3>
            <p className="text-gray-600">첫 주문을 시작해보세요!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      주문 #{order.id}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-[#22426f]">
                      {order.price.toLocaleString()}원
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("ko-KR")}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">서비스</div>
                    <div className="font-medium text-gray-900">
                      {order.serviceName}
                    </div>
                    {order.description && (
                      <div className="text-sm text-gray-500 mt-1">
                        {order.description}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-1">대상 URL</div>
                    <div className="font-medium text-gray-900 truncate">
                      {order.targetUrl}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      수량: {order.quantity.toLocaleString()}개
                    </div>
                  </div>
                </div>

                {/* 진행률 바 */}
                {order.status === "processing" && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>진행률</span>
                      <span>{order.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#22426f] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${order.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {order.completedAt && (
                  <div className="text-sm text-gray-500">
                    완료일:{" "}
                    {new Date(order.completedAt).toLocaleDateString("ko-KR")}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
