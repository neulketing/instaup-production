// 🧪 API 연동 테스트 패널 컴포넌트
import { useEffect, useState } from "react";
import { backendApi } from "../services/backendApi";

interface TestResult {
  endpoint: string;
  method: string;
  status: "success" | "error" | "loading";
  responseTime?: number;
  data?: any;
  error?: string;
}

const APITestPanel = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [autoTest, setAutoTest] = useState(true);

  // API 엔드포인트 테스트 함수
  const testEndpoint = async (
    endpoint: string,
    method: "GET" | "POST" = "GET",
    body?: any,
  ): Promise<TestResult> => {
    const startTime = Date.now();

    try {
      const baseUrl =
        import.meta.env.VITE_BACKEND_API_URL ||
        "https://instaup-production.up.railway.app";
      const url = `${baseUrl}${endpoint}`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
        mode: "cors",
      });

      const responseTime = Date.now() - startTime;
      const data = await response
        .json()
        .catch(async () => ({ text: await response.text() }));

      return {
        endpoint,
        method,
        status: response.ok ? "success" : "error",
        responseTime,
        data,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        endpoint,
        method,
        status: "error",
        responseTime,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  };

  // 전체 API 테스트 실행
  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    const tests = [
      { endpoint: "/health", method: "GET" as const },
      { endpoint: "/api/test", method: "GET" as const },
      { endpoint: "/api/services", method: "GET" as const },
      {
        endpoint: "/api/auth/register",
        method: "POST" as const,
        body: {
          email: "test@example.com",
          password: "test123",
          nickname: "tester",
        },
      },
    ];

    const results: TestResult[] = [];

    for (const test of tests) {
      const result = await testEndpoint(test.endpoint, test.method, test.body);
      results.push(result);
      setTestResults([...results]);
      await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5초 간격
    }

    setIsRunning(false);
  };

  // 개별 테스트 실행
  const runSingleTest = async (
    endpoint: string,
    method: "GET" | "POST" = "GET",
  ) => {
    const result = await testEndpoint(endpoint, method);
    setTestResults((prev) => {
      const filtered = prev.filter(
        (r) => !(r.endpoint === endpoint && r.method === method),
      );
      return [...filtered, result];
    });
  };

  // 컴포넌트 마운트 시 자동 테스트
  useEffect(() => {
    if (autoTest) {
      runAllTests();
    }
  }, [autoTest]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-50";
      case "error":
        return "text-red-600 bg-red-50";
      case "loading":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          🧪 API 연동 테스트
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setAutoTest(!autoTest)}
            className={`px-3 py-1 text-sm rounded-md ${autoTest ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
          >
            자동 테스트
          </button>
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? "테스트 중..." : "전체 테스트"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {testResults.map((result, index) => (
          <div
            key={`${result.endpoint}-${result.method}-${index}`}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(result.status)}`}
                >
                  {result.status.toUpperCase()}
                </span>
                <span className="font-mono text-sm text-gray-600">
                  {result.method}
                </span>
                <span className="font-mono text-sm">{result.endpoint}</span>
              </div>
              {result.responseTime && (
                <span className="text-xs text-gray-500">
                  {result.responseTime}ms
                </span>
              )}
            </div>

            {result.data && (
              <div className="mt-2">
                <div className="text-xs text-gray-600 mb-1">응답 데이터:</div>
                <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}

            {result.error && (
              <div className="mt-2">
                <div className="text-xs text-red-600 mb-1">오류:</div>
                <div className="bg-red-50 p-2 rounded text-xs text-red-700">
                  {result.error}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {testResults.length === 0 && !isRunning && (
        <div className="text-center py-8 text-gray-500">
          테스트 결과가 없습니다. "전체 테스트" 버튼을 클릭하여 시작하세요.
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          <div>
            <strong>Backend URL:</strong>{" "}
            {import.meta.env.VITE_BACKEND_API_URL ||
              "https://instaup-production.up.railway.app"}
          </div>
          <div>
            <strong>Environment:</strong> {import.meta.env.MODE}
          </div>
        </div>
      </div>

      {/* 수동 테스트 버튼들 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-700 mb-2">수동 테스트:</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => runSingleTest("/health")}
            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
          >
            Health Check
          </button>
          <button
            onClick={() => runSingleTest("/api/test")}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            API Test
          </button>
          <button
            onClick={() => runSingleTest("/api/services")}
            className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
          >
            Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default APITestPanel;
