import { useEffect, useState } from "react";

interface ApiConnection {
  id: string;
  name: string;
  platform: string;
  status: "connected" | "disconnected" | "error" | "testing";
  apiKey: string;
  endpoint: string;
  lastChecked: string;
  responseTime: number;
  successRate: number;
  usageCount: number;
  usageLimit: number;
  provider: string;
  isActive: boolean;
  isPrimary: boolean;
}

interface ConnectionLog {
  id: string;
  connectionId: string;
  timestamp: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  responseTime?: number;
}

export default function ConnectionManagement() {
  const [connections, setConnections] = useState<ApiConnection[]>([]);
  const [logs, setLogs] = useState<ConnectionLog[]>([]);
  const [selectedConnection, setSelectedConnection] =
    useState<ApiConnection | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLogDetails, setShowLogDetails] = useState(false);
  const [testingConnection, setTestingConnection] = useState<string | null>(
    null,
  );
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 시뮬레이션 데이터 로드
  useEffect(() => {
    loadConnections();
    loadLogs();

    if (autoRefresh) {
      const interval = setInterval(() => {
        refreshConnectionStatus();
      }, 30000); // 30초마다 상태 확인

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadConnections = () => {
    // 시뮬레이션 데이터
    const mockConnections: ApiConnection[] = [
      {
        id: "conn-1",
        name: "Instagram API (Main)",
        platform: "Instagram",
        status: "connected",
        apiKey: "ig_api_key_***",
        endpoint: "https://api.instagram.com/v1",
        lastChecked: new Date().toISOString(),
        responseTime: 245,
        successRate: 98.5,
        usageCount: 8450,
        usageLimit: 10000,
        provider: "Meta Business",
        isActive: true,
        isPrimary: true,
      },
      {
        id: "conn-2",
        name: "Instagram API (Backup)",
        platform: "Instagram",
        status: "connected",
        apiKey: "ig_backup_***",
        endpoint: "https://backup.instagram-api.com/v1",
        lastChecked: new Date(Date.now() - 300000).toISOString(),
        responseTime: 380,
        successRate: 95.2,
        usageCount: 2340,
        usageLimit: 5000,
        provider: "Third Party",
        isActive: true,
        isPrimary: false,
      },
      {
        id: "conn-3",
        name: "YouTube API",
        platform: "YouTube",
        status: "connected",
        apiKey: "yt_api_key_***",
        endpoint: "https://www.googleapis.com/youtube/v3",
        lastChecked: new Date(Date.now() - 150000).toISOString(),
        responseTime: 180,
        successRate: 99.1,
        usageCount: 5670,
        usageLimit: 25000,
        provider: "Google",
        isActive: true,
        isPrimary: true,
      },
      {
        id: "conn-4",
        name: "TikTok API",
        platform: "TikTok",
        status: "error",
        apiKey: "tt_api_key_***",
        endpoint: "https://api.tiktok.com/v1",
        lastChecked: new Date(Date.now() - 600000).toISOString(),
        responseTime: 0,
        successRate: 0,
        usageCount: 0,
        usageLimit: 1000,
        provider: "TikTok Business",
        isActive: false,
        isPrimary: true,
      },
    ];

    setConnections(mockConnections);
  };

  const loadLogs = () => {
    // 시뮬레이션 로그 데이터
    const mockLogs: ConnectionLog[] = [
      {
        id: "log-1",
        connectionId: "conn-1",
        timestamp: new Date().toISOString(),
        type: "success",
        message: "API 연결 테스트 성공",
        responseTime: 245,
      },
      {
        id: "log-2",
        connectionId: "conn-4",
        timestamp: new Date(Date.now() - 600000).toISOString(),
        type: "error",
        message: "API 키 인증 실패 - 토큰이 만료되었습니다",
      },
      {
        id: "log-3",
        connectionId: "conn-3",
        timestamp: new Date(Date.now() - 900000).toISOString(),
        type: "warning",
        message: "API 사용량이 한도의 80%에 도달했습니다",
      },
      {
        id: "log-4",
        connectionId: "conn-2",
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        type: "info",
        message: "백업 API로 자동 전환됨",
      },
    ];

    setLogs(
      mockLogs.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      ),
    );
  };

  const refreshConnectionStatus = () => {
    setConnections((prev) =>
      prev.map((conn) => ({
        ...conn,
        lastChecked: new Date().toISOString(),
        responseTime:
          conn.status === "connected"
            ? Math.floor(Math.random() * 300) + 100
            : 0,
        successRate: conn.status === "connected" ? 95 + Math.random() * 5 : 0,
      })),
    );
  };

  const testConnection = async (connectionId: string) => {
    setTestingConnection(connectionId);

    // 시뮬레이션 테스트
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setConnections((prev) =>
      prev.map((conn) =>
        conn.id === connectionId
          ? {
              ...conn,
              status: Math.random() > 0.2 ? "connected" : "error",
              lastChecked: new Date().toISOString(),
              responseTime:
                Math.random() > 0.2 ? Math.floor(Math.random() * 300) + 100 : 0,
            }
          : conn,
      ),
    );

    // 로그 추가
    const newLog: ConnectionLog = {
      id: `log-${Date.now()}`,
      connectionId,
      timestamp: new Date().toISOString(),
      type: Math.random() > 0.2 ? "success" : "error",
      message:
        Math.random() > 0.2
          ? "연결 테스트 성공"
          : "연결 테스트 실패 - 서버 응답 없음",
      responseTime:
        Math.random() > 0.2 ? Math.floor(Math.random() * 300) + 100 : undefined,
    };

    setLogs((prev) => [newLog, ...prev]);
    setTestingConnection(null);
  };

  const toggleConnection = (connectionId: string) => {
    setConnections((prev) =>
      prev.map((conn) =>
        conn.id === connectionId ? { ...conn, isActive: !conn.isActive } : conn,
      ),
    );
  };

  const setPrimaryConnection = (connectionId: string, platform: string) => {
    setConnections((prev) =>
      prev.map((conn) =>
        conn.platform === platform
          ? { ...conn, isPrimary: conn.id === connectionId }
          : conn,
      ),
    );
  };

  const getStatusColor = (status: ApiConnection["status"]) => {
    switch (status) {
      case "connected":
        return "text-green-600 bg-green-100";
      case "disconnected":
        return "text-gray-600 bg-gray-100";
      case "error":
        return "text-red-600 bg-red-100";
      case "testing":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getLogTypeColor = (type: ConnectionLog["type"]) => {
    switch (type) {
      case "success":
        return "text-green-600 bg-green-100";
      case "error":
        return "text-red-600 bg-red-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "info":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🔗 연결 관리</h2>
          <p className="text-gray-600">
            외부 API 연결 상태를 모니터링하고 관리합니다
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-600">자동 새로고침</span>
          </label>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + 새 연결 추가
          </button>
        </div>
      </div>

      {/* 연결 상태 개요 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                {connections.filter((c) => c.status === "connected").length}
              </div>
              <div className="text-sm text-green-600">연결됨</div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm">✕</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-900">
                {connections.filter((c) => c.status === "error").length}
              </div>
              <div className="text-sm text-red-600">오류</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm">📊</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {Math.round(
                  connections.reduce((sum, c) => sum + c.successRate, 0) /
                    connections.length,
                )}
                %
              </div>
              <div className="text-sm text-blue-600">평균 성공률</div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm">⚡</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-900">
                {Math.round(
                  connections.reduce((sum, c) => sum + c.responseTime, 0) /
                    connections.length,
                )}
                ms
              </div>
              <div className="text-sm text-yellow-600">평균 응답시간</div>
            </div>
          </div>
        </div>
      </div>

      {/* 연결 목록 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">API 연결 목록</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  연결
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  성능
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사용량
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  마지막 확인
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {connections.map((connection) => (
                <tr key={connection.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        <span className="text-2xl">
                          {connection.platform === "Instagram"
                            ? "📷"
                            : connection.platform === "YouTube"
                              ? "🎥"
                              : connection.platform === "TikTok"
                                ? "🎵"
                                : "📱"}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {connection.name}
                          {connection.isPrimary && (
                            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              주
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {connection.provider}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(testingConnection === connection.id ? "testing" : connection.status)}`}
                    >
                      {testingConnection === connection.id
                        ? "테스트 중..."
                        : connection.status === "connected"
                          ? "연결됨"
                          : connection.status === "error"
                            ? "오류"
                            : "연결 끊김"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>응답시간: {connection.responseTime}ms</div>
                    <div>성공률: {connection.successRate.toFixed(1)}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(connection.usageCount / connection.usageLimit) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600">
                      {connection.usageCount.toLocaleString()} /{" "}
                      {connection.usageLimit.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(connection.lastChecked).toLocaleString("ko-KR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => testConnection(connection.id)}
                        disabled={testingConnection === connection.id}
                        className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                        title="연결 테스트"
                      >
                        🔍
                      </button>
                      <button
                        onClick={() => toggleConnection(connection.id)}
                        className={
                          connection.isActive
                            ? "text-red-600 hover:text-red-900"
                            : "text-green-600 hover:text-green-900"
                        }
                        title={connection.isActive ? "비활성화" : "활성화"}
                      >
                        {connection.isActive ? "⏸️" : "▶️"}
                      </button>
                      <button
                        onClick={() =>
                          setPrimaryConnection(
                            connection.id,
                            connection.platform,
                          )
                        }
                        disabled={connection.isPrimary}
                        className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                        title="주 연결로 설정"
                      >
                        ⭐
                      </button>
                      <button
                        onClick={() => setSelectedConnection(connection)}
                        className="text-gray-600 hover:text-gray-900"
                        title="설정"
                      >
                        ⚙️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 연결 로그 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">연결 로그</h3>
          <button
            onClick={() => setShowLogDetails(!showLogDetails)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showLogDetails ? "간단히 보기" : "상세히 보기"}
          </button>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {logs.slice(0, showLogDetails ? undefined : 5).map((log) => {
            const connection = connections.find(
              (c) => c.id === log.connectionId,
            );
            return (
              <div
                key={log.id}
                className="px-6 py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mr-3 ${getLogTypeColor(log.type)}`}
                    >
                      {log.type === "success"
                        ? "성공"
                        : log.type === "error"
                          ? "오류"
                          : log.type === "warning"
                            ? "경고"
                            : "정보"}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {connection?.name || "알 수 없는 연결"}
                      </div>
                      <div className="text-sm text-gray-600">{log.message}</div>
                      {log.responseTime && (
                        <div className="text-xs text-gray-500">
                          응답시간: {log.responseTime}ms
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleString("ko-KR")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
