import { useEffect, useState } from "react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastNotificationProps {
  messages: ToastMessage[];
  onRemove: (id: string) => void;
}

export default function ToastNotification({
  messages,
  onRemove,
}: ToastNotificationProps) {
  const getToastIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "📢";
    }
  };

  const getToastColors = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-sm">
      {messages.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
          getToastIcon={getToastIcon}
          getToastColors={getToastColors}
        />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
  getToastIcon: (type: string) => string;
  getToastColors: (type: string) => string;
}

function ToastItem({
  toast,
  onRemove,
  getToastIcon,
  getToastColors,
}: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // 애니메이션을 위한 약간의 지연
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    // 자동 제거 타이머
    const duration = toast.duration || 5000;
    const autoRemoveTimer = setTimeout(() => {
      handleRemove();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(autoRemoveTimer);
    };
  }, []);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300); // 애니메이션 시간과 맞춤
  };

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out ${
        isVisible && !isLeaving
          ? "translate-x-0 opacity-100 scale-100"
          : "translate-x-full opacity-0 scale-95"
      }`}
    >
      <div
        className={`p-4 rounded-lg border shadow-lg ${getToastColors(toast.type)} relative overflow-hidden`}
      >
        {/* 진행률 바 */}
        <div className="absolute bottom-0 left-0 h-1 bg-current opacity-30 animate-shrink-width"></div>

        <div className="flex items-start gap-3">
          <div className="text-xl flex-shrink-0 mt-0.5">
            {getToastIcon(toast.type)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm mb-1">{toast.title}</div>
            <div className="text-sm opacity-90 leading-relaxed">
              {toast.message}
            </div>

            {toast.action && (
              <button
                onClick={toast.action.onClick}
                className="mt-2 text-sm font-medium underline hover:no-underline opacity-80 hover:opacity-100 transition-opacity"
              >
                {toast.action.label}
              </button>
            )}
          </div>

          <button
            onClick={handleRemove}
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
          >
            <span className="text-sm">✕</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// 토스트 관리 훅
export function useToast() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast: ToastMessage = { ...toast, id };

    setMessages((prev) => [...prev, newToast]);

    return id;
  };

  const removeToast = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  const success = (
    title: string,
    message: string,
    options?: Partial<ToastMessage>,
  ) => {
    return addToast({ type: "success", title, message, ...options });
  };

  const error = (
    title: string,
    message: string,
    options?: Partial<ToastMessage>,
  ) => {
    return addToast({ type: "error", title, message, ...options });
  };

  const warning = (
    title: string,
    message: string,
    options?: Partial<ToastMessage>,
  ) => {
    return addToast({ type: "warning", title, message, ...options });
  };

  const info = (
    title: string,
    message: string,
    options?: Partial<ToastMessage>,
  ) => {
    return addToast({ type: "info", title, message, ...options });
  };

  return {
    messages,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}
