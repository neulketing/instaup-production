export enum OrderStatus {
  PENDING = "pending", // 대기중
  PROCESSING = "processing", // 처리중
  IN_PROGRESS = "in_progress", // 진행중
  COMPLETED = "completed", // 완료
  PARTIALLY_COMPLETED = "partially_completed", // 부분완료
  CANCELLED = "cancelled", // 취소됨
  REFUNDED = "refunded", // 환불됨
  PAUSED = "paused", // 일시정지
}

export interface OrderItem {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  platform: string;
  targetUrl: string;
  quantity: number;
  completedQuantity: number;
  unitPrice: number;
  totalPrice: number;
  discountRate: number;
  finalPrice: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  estimatedCompletionTime: string;
  progressPercentage: number;
  notes?: string;
  refillGuarantee: number; // 리필 보장 일수
  quality: "standard" | "premium" | "vip";
  features: string[];
  errorMessage?: string;
  isRefillRequest?: boolean;
  parentOrderId?: string; // 리필 요청인 경우 원본 주문 ID
}

export interface OrderProgress {
  orderId: string;
  timestamp: string;
  status: OrderStatus;
  completedQuantity: number;
  progressPercentage: number;
  message: string;
  remainingTime?: string;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  totalSpent: number;
  totalReceived: number;
  completionRate: number;
  averageCompletionTime: number;
}

export interface OrderFilter {
  status?: OrderStatus;
  platform?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}
