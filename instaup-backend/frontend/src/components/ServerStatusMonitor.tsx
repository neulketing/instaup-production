import { useEffect, useState } from "react";
import { backendApi } from "../services/backendApi";

interface ServerStatus {
  status: "healthy" | "unhealthy" | "checking";
  message: string;
  timestamp?: string;
  responseTime?: number;
}

export default function ServerStatusMonitor() {
  const [serverStatus, setServerStatus] = useState<ServerStatus>({
    status: "checking",
    message: "서버 상태 확인 중...",
  });

  const checkServerHealth = async () => {
    const startTime = Date.now();

    try {
      setServerStatus({
        status: "checking",
        message: "서버 상태 확인 중...",
      });

      const response = await backendApi.checkHealth();
      const responseTime = Date.now() - startTime;

      if (response.success) {
        setServerStatus({
          status: "healthy",
          message: "서버가 정상적으로 작동 중입니다",
          timestamp: new Date().toLocaleTimeString(),
          responseTime,
        });
      } else {
        setServerStatus({
          status: "unhealthy",
          message: response.error || "서버 상태를 확인할 수 없습니다",
          timestamp: new Date().toLocaleTimeString(),
          responseTime,
        });
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      setServerStatus({
        status: "unhealthy",
        message: error instanceof Error ? error.message : "서버 연결 실패",
        timestamp: new Date().toLocaleTimeString(),
        responseTime,
      });
    }
  };

  useEffect(() => {
    // 페이지 로드 시 즉시 확인
    checkServerHealth();

    // 30초마다 서버 상태 확인
    const interval = setInterval(checkServerHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (serverStatus.status) {
      case "healthy":
        return "🟢";
      case "unhealthy":
        return "🔴";
      case "checking":
        return "🟡";
      default:
        return "⚪";
    }
  };

  const getStatusColor = () => {
    switch (serverStatus.status) {
      case "healthy":
        return "text-green-600 bg-green-50 border-green-200";
      case "unhealthy":
        return "text-red-600 bg-red-50 border-red-200";
      case "checking":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="fixed top-16 right-4 z-50">
      <div
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${getStatusColor()}`}
      >
        <span className="text-base">{getStatusIcon()}</span>
        <div className="flex flex-col">
          <span>{serverStatus.message}</span>
          {serverStatus.timestamp && (
            <span className="text-xs opacity-75">
              마지막 확인: {serverStatus.timestamp}
              {serverStatus.responseTime && ` (${serverStatus.responseTime}ms)`}
            </span>
          )}
        </div>
        <button
          onClick={checkServerHealth}
          className="ml-2 px-2 py-1 text-xs rounded hover:bg-white hover:bg-opacity-50 transition-colors"
          title="수동으로 서버 상태 확인"
        >
          새로고침
        </button>
      </div>
    </div>
  );
}
