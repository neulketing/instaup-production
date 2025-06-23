// 🧪 API 연동 테스트 서비스
// Railway 백엔드와의 연결을 테스트하기 위한 유틸리티

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_API_URL ||
  "https://instaup-production.up.railway.app";

export interface TestResult {
  endpoint: string;
  status: "success" | "error" | "loading";
  responseTime?: number;
  data?: any;
  error?: string;
}

class APITestService {
  private async testEndpoint(
    endpoint: string,
    method: "GET" | "POST" = "GET",
    body?: any,
  ): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const url = `${API_BASE_URL}${endpoint}`;
      console.log(`🔍 Testing: ${method} ${url}`);

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
        status: response.ok ? "success" : "error",
        responseTime,
        data,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;

      // CORS 에러인 경우 특별 처리
      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        console.warn("🚨 CORS 에러 발생 - Railway 재배포 필요");
        return {
          endpoint,
          status: "error",
          responseTime,
          error: "CORS 에러: Railway에서 새로운 CORS 설정 배포 대기 중",
        };
      }

      return {
        endpoint,
        status: "error",
        responseTime,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // 백엔드 헬스체크
  async testHealth(): Promise<TestResult> {
    return this.testEndpoint("/health");
  }

  // 백엔드 루트 엔드포인트
  async testRoot(): Promise<TestResult> {
    return this.testEndpoint("/");
  }

  // 버전 정보
  async testVersion(): Promise<TestResult> {
    return this.testEndpoint("/version");
  }

  // API 라우트들 테스트
  async testAuthEndpoints(): Promise<TestResult[]> {
    const results: TestResult[] = [];

    // GET /api/auth (일반적으로 auth 정보나 상태 확인)
    results.push(await this.testEndpoint("/api/auth"));

    return results;
  }

  // 서비스 엔드포인트 테스트
  async testServiceEndpoints(): Promise<TestResult[]> {
    const results: TestResult[] = [];

    // GET /api/services (서비스 목록)
    results.push(await this.testEndpoint("/api/services"));

    return results;
  }

  // 전체 API 상태 테스트
  async runFullTest(): Promise<{
    baseUrl: string;
    totalTests: number;
    successCount: number;
    results: TestResult[];
    corsStatus: string;
  }> {
    console.log("🚀 Starting full API test...");

    const results: TestResult[] = [];

    // 기본 엔드포인트들 테스트 (CORS 영향 받지 않는 것들)
    results.push(await this.testRoot());
    results.push(await this.testVersion());
    results.push(await this.testHealth());

    // API 엔드포인트들 테스트 (CORS 영향 받을 수 있음)
    const authResults = await this.testAuthEndpoints();
    const serviceResults = await this.testServiceEndpoints();

    results.push(...authResults, ...serviceResults);

    const successCount = results.filter((r) => r.status === "success").length;
    const corsErrors = results.filter((r) => r.error?.includes("CORS")).length;

    let corsStatus = "OK";
    if (corsErrors > 0) {
      corsStatus = `CORS 에러 ${corsErrors}개 - Railway 재배포 필요`;
    }

    console.log("📊 Test Results:", {
      baseUrl: API_BASE_URL,
      totalTests: results.length,
      successCount,
      corsStatus,
      results,
    });

    return {
      baseUrl: API_BASE_URL,
      totalTests: results.length,
      successCount,
      results,
      corsStatus,
    };
  }

  // 브라우저 콘솔에서 사용할 수 있도록 전역 노출
  exposeToGlobal() {
    (window as typeof window & { testAPI: unknown }).testAPI = {
      health: () => this.testHealth(),
      root: () => this.testRoot(),
      version: () => this.testVersion(),
      auth: () => this.testAuthEndpoints(),
      services: () => this.testServiceEndpoints(),
      full: () => this.runFullTest(),
      custom: (
        endpoint: string,
        method: "GET" | "POST" = "GET",
        body?: Record<string, unknown>,
      ) => this.testEndpoint(endpoint, method, body),
    };

    console.log("🔧 API Test utilities exposed to window.testAPI");
    console.log("📋 사용법:");
    console.log("  window.testAPI.health() - 헬스체크 테스트");
    console.log("  window.testAPI.full() - 전체 테스트 실행");
    console.log("  window.testAPI.root() - 루트 엔드포인트 테스트");
    console.log("  window.testAPI.version() - 버전 정보 테스트");
    console.log(
      '  window.testAPI.custom("/custom") - 커스텀 엔드포인트 테스트',
    );
  }
}

// 싱글톤 인스턴스
export const apiTestService = new APITestService();

// 브라우저에서 바로 사용할 수 있도록 자동 노출
if (typeof window !== "undefined") {
  apiTestService.exposeToGlobal();
}
