"use client";

import { useEffect, useRef, useState } from "react";
import { type Socket, io } from "socket.io-client";

interface NotificationItem {
  id: string;
  type: "order" | "user" | "system" | "payment" | "error";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  data?: any;
}

interface AdminNotificationSystemProps {
  adminId: string;
  onNotificationClick?: (notification: NotificationItem) => void;
}

export default function AdminNotificationSystem({
  adminId,
  onNotificationClick,
}: AdminNotificationSystemProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 알림음 생성
  useEffect(() => {
    audioRef.current = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFAlGn+DyvmMcBDWI1/L",
    );
  }, []);

  // 소켓 연결 및 관리
  useEffect(() => {
    // 실제 환경에서는 백엔드 서버 URL 사용
    const SOCKET_SERVER = process.env.VITE_SOCKET_URL || "ws://localhost:8080";

    try {
      socketRef.current = io(SOCKET_SERVER, {
        query: { adminId, type: "admin" },
        transports: ["websocket", "polling"],
      });

      const socket = socketRef.current;

      socket.on("connect", () => {
        console.log("관리자 알림 시스템 연결됨");
        setIsConnected(true);

        // 관리자 채널 조인
        socket.emit("join-admin-room", adminId);
      });

      socket.on("disconnect", () => {
        console.log("관리자 알림 시스템 연결 해제됨");
        setIsConnected(false);
      });

      // 실시간 알림 수신
      socket.on("admin-notification", (notification: NotificationItem) => {
        console.log("새 알림 수신:", notification);
        handleNewNotification(notification);
      });

      // 시스템 상태 알림
      socket.on("system-alert", (alert: any) => {
        const systemNotification: NotificationItem = {
          id: `system-${Date.now()}`,
          type: "system",
          title: "시스템 알림",
          message: alert.message,
          timestamp: new Date().toISOString(),
          isRead: false,
          priority: alert.priority || "medium",
          data: alert,
        };
        handleNewNotification(systemNotification);
      });

      // 에러 처리
      socket.on("connect_error", (error) => {
        console.error("소켓 연결 오류:", error);
        setIsConnected(false);
      });
    } catch (error) {
      console.error("소켓 초기화 실패:", error);
      setIsConnected(false);

      // 연결 실패 시 더미 데이터로 시연
      simulateNotifications();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [adminId]);

  // 더미 알림 시뮬레이션 (소켓 연결 실패 시)
  const simulateNotifications = () => {
    const dummyNotifications: NotificationItem[] = [
      {
        id: "1",
        type: "order",
        title: "새 주문 접수",
        message: "김철수님이 Instagram 팔로워 1000명을 주문했습니다.",
        timestamp: new Date(Date.now() - 300000).toISOString(),
        isRead: false,
        priority: "high",
        data: { orderId: "ORD001", amount: 15000 },
      },
      {
        id: "2",
        type: "payment",
        title: "결제 완료",
        message: "15,000원 결제가 성공적으로 처리되었습니다.",
        timestamp: new Date(Date.now() - 600000).toISOString(),
        isRead: false,
        priority: "medium",
        data: { paymentId: "PAY001", amount: 15000 },
      },
      {
        id: "3",
        type: "user",
        title: "신규 회원 가입",
        message: "이영희님이 회원가입을 완료했습니다.",
        timestamp: new Date(Date.now() - 900000).toISOString(),
        isRead: true,
        priority: "low",
        data: { userId: "USR002" },
      },
      {
        id: "4",
        type: "system",
        title: "시스템 점검 알림",
        message: "오늘 밤 12시부터 1시간 동안 시스템 점검이 예정되어 있습니다.",
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        isRead: true,
        priority: "urgent",
        data: { maintenanceTime: "2024-01-20 00:00-01:00" },
      },
    ];

    setNotifications(dummyNotifications);
    setUnreadCount(dummyNotifications.filter((n) => !n.isRead).length);

    // 정기적으로 새 알림 생성 (데모용)
    const interval = setInterval(() => {
      const newNotification: NotificationItem = {
        id: `demo-${Date.now()}`,
        type: Math.random() > 0.5 ? "order" : "payment",
        title: Math.random() > 0.5 ? "새 주문 접수" : "결제 완료",
        message: `데모 알림 - ${new Date().toLocaleTimeString()}`,
        timestamp: new Date().toISOString(),
        isRead: false,
        priority: "medium",
        data: {},
      };
      handleNewNotification(newNotification);
    }, 30000); // 30초마다 새 알림

    return () => clearInterval(interval);
  };

  // 새 알림 처리
  const handleNewNotification = (notification: NotificationItem) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);

    // 알림음 재생
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch((e) => console.log("알림음 재생 실패:", e));
    }

    // 브라우저 푸시 알림 (권한이 있는 경우)
    if (Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/favicon.ico",
        tag: notification.id,
      });
    }

    // 긴급 알림의 경우 자동으로 패널 열기
    if (notification.priority === "urgent") {
      setIsOpen(true);
    }
  };

  // 알림 읽음 처리
  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  // 모든 알림 읽음 처리
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  // 알림 삭제
  const deleteNotification = (notificationId: string) => {
    const notification = notifications.find((n) => n.id === notificationId);
    if (notification && !notification.isRead) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  // 알림 클릭 처리
  const handleNotificationClick = (notification: NotificationItem) => {
    markAsRead(notification.id);
    onNotificationClick?.(notification);
  };

  // 알림 타입별 아이콘
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return "🛒";
      case "user":
        return "👤";
      case "system":
        return "⚙️";
      case "payment":
        return "💳";
      case "error":
        return "⚠️";
      default:
        return "📢";
    }
  };

  // 우선순위별 색상
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 bg-red-50 border-red-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "low":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // 브라우저 알림 권한 요청
  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div className="relative">
      {/* 알림 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-all ${
          isConnected
            ? "bg-green-100 hover:bg-green-200 text-green-700"
            : "bg-gray-100 hover:bg-gray-200 text-gray-600"
        }`}
        title={isConnected ? "실시간 알림 (연결됨)" : "알림 시스템 (오프라인)"}
      >
        <span className="text-xl">🔔</span>

        {/* 연결 상태 표시 */}
        <div
          className={`absolute -top-1 -left-1 w-3 h-3 rounded-full ${
            isConnected ? "bg-green-500" : "bg-gray-400"
          }`}
        />

        {/* 읽지 않은 알림 개수 */}
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-bold">
            {unreadCount > 99 ? "99+" : unreadCount}
          </div>
        )}
      </button>

      {/* 알림 패널 */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] overflow-hidden">
          {/* 헤더 */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔔</span>
                <h3 className="font-semibold text-gray-900">실시간 알림</h3>
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-1 rounded text-sm ${
                    soundEnabled ? "text-blue-600" : "text-gray-400"
                  }`}
                  title={soundEnabled ? "알림음 끄기" : "알림음 켜기"}
                >
                  {soundEnabled ? "🔊" : "🔇"}
                </button>
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800"
                  disabled={unreadCount === 0}
                >
                  모두 읽음
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* 알림 목록 */}
          <div className="max-h-[500px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <span className="text-4xl mb-4 block">📭</span>
                <p>새로운 알림이 없습니다</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.isRead ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg border ${getPriorityColor(notification.priority)}`}
                      >
                        <span className="text-lg">
                          {getNotificationIcon(notification.type)}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4
                            className={`font-medium text-sm ${
                              !notification.isRead
                                ? "text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(notification.timestamp).toLocaleString(
                              "ko-KR",
                            )}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="text-xs text-gray-400 hover:text-red-500"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 하단 */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-500 text-center">
              {isConnected ? (
                <span className="text-green-600">🟢 실시간 연결 중</span>
              ) : (
                <span className="text-gray-500">🔴 오프라인 모드</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
