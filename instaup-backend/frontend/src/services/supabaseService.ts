// 🚀 Supabase 통합 서비스
// 실시간 알림, 인증, 파일 업로드 등을 담당

import {
  type RealtimeChannel,
  type SupabaseClient,
  createClient,
} from "@supabase/supabase-js";
import { useEffect, useState } from "react";

// Supabase 설정
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Supabase 클라이언트 생성
let supabase: SupabaseClient | null = null;

const initializeSupabase = () => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn(
      "Supabase 환경변수가 설정되지 않았습니다. 일부 기능이 제한됩니다.",
    );
    return null;
  }

  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }

  return supabase;
};

// 타입 정의
export interface NotificationData {
  id: string;
  userId: string;
  type:
    | "order_update"
    | "payment_success"
    | "payment_failed"
    | "system_message"
    | "promotion";
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

export interface RealtimeSubscription {
  channel: RealtimeChannel;
  unsubscribe: () => void;
}

class SupabaseService {
  private client: SupabaseClient | null = null;
  private subscriptions: Map<string, RealtimeSubscription> = new Map();

  constructor() {
    this.client = initializeSupabase();
  }

  // Supabase 클라이언트 가져오기
  getClient(): SupabaseClient | null {
    return this.client;
  }

  // 서비스 사용 가능 여부 확인
  isAvailable(): boolean {
    return this.client !== null;
  }

  // === 실시간 알림 시스템 ===

  // 실시간 알림 구독
  subscribeToNotifications(
    userId: string,
    callback: (notification: NotificationData) => void,
  ): RealtimeSubscription | null {
    if (!this.client) {
      console.warn("Supabase 클라이언트가 초기화되지 않았습니다.");
      return null;
    }

    const subscriptionKey = `notifications_${userId}`;

    // 기존 구독 해제
    this.unsubscribe(subscriptionKey);

    const channel = this.client
      .channel(`notifications:user_id=eq.${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("새 알림 수신:", payload);
          if (payload.new) {
            callback(payload.new as NotificationData);
          }
        },
      )
      .subscribe();

    const subscription: RealtimeSubscription = {
      channel,
      unsubscribe: () => {
        channel.unsubscribe();
        this.subscriptions.delete(subscriptionKey);
      },
    };

    this.subscriptions.set(subscriptionKey, subscription);
    return subscription;
  }

  // 주문 상태 실시간 구독
  subscribeToOrderUpdates(
    orderId: string,
    callback: (orderData: any) => void,
  ): RealtimeSubscription | null {
    if (!this.client) return null;

    const subscriptionKey = `order_${orderId}`;
    this.unsubscribe(subscriptionKey);

    const channel = this.client
      .channel(`orders:id=eq.${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          console.log("주문 상태 업데이트:", payload);
          if (payload.new) {
            callback(payload.new);
          }
        },
      )
      .subscribe();

    const subscription: RealtimeSubscription = {
      channel,
      unsubscribe: () => {
        channel.unsubscribe();
        this.subscriptions.delete(subscriptionKey);
      },
    };

    this.subscriptions.set(subscriptionKey, subscription);
    return subscription;
  }

  // 구독 해제
  unsubscribe(subscriptionKey: string): void {
    const subscription = this.subscriptions.get(subscriptionKey);
    if (subscription) {
      subscription.unsubscribe();
    }
  }

  // 모든 구독 해제
  unsubscribeAll(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();
  }

  // === 알림 데이터 관리 ===

  // 알림 목록 조회
  async getNotifications(
    userId: string,
    limit = 20,
  ): Promise<NotificationData[]> {
    if (!this.client) return [];

    try {
      const { data, error } = await this.client
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("알림 조회 실패:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("알림 조회 중 오류:", error);
      return [];
    }
  }

  // 알림 읽음 처리
  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    if (!this.client) return false;

    try {
      const { error } = await this.client
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) {
        console.error("알림 읽음 처리 실패:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("알림 읽음 처리 중 오류:", error);
      return false;
    }
  }

  // 모든 알림 읽음 처리
  async markAllNotificationsAsRead(userId: string): Promise<boolean> {
    if (!this.client) return false;

    try {
      const { error } = await this.client
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userId)
        .eq("read", false);

      if (error) {
        console.error("모든 알림 읽음 처리 실패:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("모든 알림 읽음 처리 중 오류:", error);
      return false;
    }
  }

  // === 파일 업로드 (프로필 이미지, 주문 증빙 등) ===

  // 파일 업로드
  async uploadFile(
    bucket: string,
    filePath: string,
    file: File,
  ): Promise<{ url: string | null; error: string | null }> {
    if (!this.client) {
      return {
        url: null,
        error: "Supabase 클라이언트가 초기화되지 않았습니다.",
      };
    }

    try {
      const { data, error } = await this.client.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("파일 업로드 실패:", error);
        return { url: null, error: error.message };
      }

      // 공개 URL 생성
      const { data: urlData } = this.client.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return { url: urlData.publicUrl, error: null };
    } catch (error) {
      console.error("파일 업로드 중 오류:", error);
      return {
        url: null,
        error:
          error instanceof Error
            ? error.message
            : "파일 업로드 중 오류가 발생했습니다.",
      };
    }
  }

  // 파일 삭제
  async deleteFile(bucket: string, filePath: string): Promise<boolean> {
    if (!this.client) return false;

    try {
      const { error } = await this.client.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        console.error("파일 삭제 실패:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("파일 삭제 중 오류:", error);
      return false;
    }
  }

  // === 분석 데이터 저장 ===

  // 사용자 활동 로그 저장
  async logUserActivity(
    userId: string,
    action: string,
    data?: any,
  ): Promise<boolean> {
    if (!this.client) return false;

    try {
      const { error } = await this.client.from("user_activity_logs").insert({
        user_id: userId,
        action,
        data,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("활동 로그 저장 실패:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("활동 로그 저장 중 오류:", error);
      return false;
    }
  }

  // === 연결 상태 관리 ===

  // 연결 상태 확인
  async checkConnection(): Promise<boolean> {
    if (!this.client) return false;

    try {
      const { data, error } = await this.client
        .from("notifications")
        .select("count")
        .limit(1);

      return !error;
    } catch (error) {
      console.error("Supabase 연결 확인 실패:", error);
      return false;
    }
  }
}

// 싱글톤 인스턴스
export const supabaseService = new SupabaseService();

// React Hook for notifications
export const useRealtimeNotifications = (userId: string | null) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId || !supabaseService.isAvailable()) return;

    let subscription: RealtimeSubscription | null = null;

    // 기존 알림 로드
    supabaseService.getNotifications(userId).then((data) => {
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    });

    // 실시간 구독
    subscription = supabaseService.subscribeToNotifications(
      userId,
      (newNotification) => {
        setNotifications((prev) => [newNotification, ...prev]);
        if (!newNotification.read) {
          setUnreadCount((prev) => prev + 1);
        }
      },
    );

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [userId]);

  const markAsRead = async (notificationId: string) => {
    const success =
      await supabaseService.markNotificationAsRead(notificationId);
    if (success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;

    const success = await supabaseService.markAllNotificationsAsRead(userId);
    if (success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
};

export default supabaseService;
