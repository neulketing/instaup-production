// 🔔 실시간 알림 컴포넌트
// Supabase를 사용한 실시간 알림 시스템

import { useEffect, useState } from "react";
import {
  type NotificationData,
  supabaseService,
  useRealtimeNotifications,
} from "../services/supabaseService";

interface RealtimeNotificationsProps {
  userId: string | null;
  isVisible: boolean;
  onClose: () => void;
}

const RealtimeNotifications = ({
  userId,
  isVisible,
  onClose,
}: RealtimeNotificationsProps) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useRealtimeNotifications(userId);
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(false);

  // Supabase 사용 가능 여부 확인
  useEffect(() => {
    setIsSupabaseAvailable(supabaseService.isAvailable());
  }, []);

  // 알림 타입별 아이콘
  const getNotificationIcon = (type: NotificationData["type"]) => {
    switch (type) {
      case "order_update":
        return "📦";
      case "payment_success":
        return "💳";
      case "payment_failed":
        return "❌";
      case "system_message":
        return "📢";
      case "promotion":
        return "🎁";
      default:
        return "🔔";
    }
  };

  // 알림 타입별 스타일
  const getNotificationStyle = (type: NotificationData["type"]) => {
    switch (type) {
      case "order_update":
        return "border-l-blue-500 bg-blue-50";
      case "payment_success":
        return "border-l-green-500 bg-green-50";
      case "payment_failed":
        return "border-l-red-500 bg-red-50";
      case "system_message":
        return "border-l-yellow-500 bg-yellow-50";
      case "promotion":
        return "border-l-purple-500 bg-purple-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

  // 시간 포맷팅
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;

    return date.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* 알림 패널 */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">알림</h2>
              {unreadCount > 0 && (
                <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  모두 읽음
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Supabase 상태 표시 */}
          {!isSupabaseAvailable && (
            <div className="p-4 bg-yellow-50 border-b border-yellow-200">
              <div className="flex items-center gap-2 text-yellow-800">
                <span className="text-sm">⚠️</span>
                <span className="text-sm">
                  실시간 알림을 위해 Supabase 설정이 필요합니다.
                </span>
              </div>
            </div>
          )}

          {/* 알림 목록 */}
          <div className="flex-1 overflow-y-auto">
            {!isSupabaseAvailable ? (
              /* Supabase 미설정 시 데모 알림 */
              <div className="p-4 space-y-3">
                <div className="text-sm text-gray-600 mb-4">
                  📋 데모 알림 (Supabase 연결 후 실시간 알림이 활성화됩니다)
                </div>

                {/* 데모 알림들 */}
                <div className="border-l-4 border-l-green-500 bg-green-50 p-3 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">💳</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">결제 완료</div>
                      <div className="text-sm text-gray-600 mt-1">
                        인스타그램 팔로워 1,000명 주문이 결제되었습니다.
                      </div>
                      <div className="text-xs text-gray-500 mt-2">5분 전</div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-l-blue-500 bg-blue-50 p-3 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">📦</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        주문 진행 중
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        주문 #12345의 작업이 시작되었습니다. (진행률: 25%)
                      </div>
                      <div className="text-xs text-gray-500 mt-2">15분 전</div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-l-purple-500 bg-purple-50 p-3 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">🎁</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        특별 할인 이벤트
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        유튜브 구독자 서비스 30% 할인! 오늘 하루만!
                      </div>
                      <div className="text-xs text-gray-500 mt-2">1시간 전</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : notifications.length === 0 ? (
              /* 알림 없음 */
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <div className="text-4xl mb-4">🔔</div>
                <div className="text-lg font-medium mb-2">알림이 없습니다</div>
                <div className="text-sm text-center">
                  새로운 주문이나 중요한 업데이트가 있으면
                  <br />
                  여기에 실시간으로 표시됩니다.
                </div>
              </div>
            ) : (
              /* 실제 알림 목록 */
              <div className="p-4 space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border-l-4 p-3 rounded-r-lg cursor-pointer transition-opacity ${getNotificationStyle(
                      notification.type,
                    )} ${notification.read ? "opacity-60" : ""}`}
                    onClick={() =>
                      !notification.read && markAsRead(notification.id)
                    }
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {notification.title}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          {formatTime(notification.createdAt)}
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 푸터 */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-500 text-center">
              {isSupabaseAvailable
                ? "실시간 알림이 활성화되었습니다"
                : "Supabase 설정을 완료하면 실시간 알림을 받을 수 있습니다"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 알림 버튼 컴포넌트 (헤더에서 사용)
export const NotificationButton = ({
  userId,
  onClick,
}: {
  userId: string | null;
  onClick: () => void;
}) => {
  const { unreadCount } = useRealtimeNotifications(userId);

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-5-5v-5a3 3 0 00-6 0v5l-5 5h5m5 0v1a3 3 0 01-6 0v-1m6 0H9"
        />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default RealtimeNotifications;
