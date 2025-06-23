// 세션 관리 및 인증 유틸리티 (백엔드 API 연동)
import {
  type LoginRequest,
  type RegisterRequest,
  type User,
  backendApi,
} from "../services/backendApi";

export interface UserSession {
  id: string;
  userId: string;
  email: string;
  username: string;
  nickname: string;
  name?: string;
  balance: number;
  referralCode?: string;
  isLoggedIn: boolean;
  loginTime: string;
  lastActivity: string;
  isAdmin: boolean;
}

class AuthManager {
  private static instance: AuthManager;
  private readonly SESSION_KEY = "snsshop_session";
  private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24시간

  private constructor() {}

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  // 로그인 처리 (백엔드 API 연동)
  async login(userData: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }): Promise<UserSession> {
    try {
      const response = await backendApi.login({
        email: userData.email,
        password: userData.password,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || "로그인에 실패했습니다.");
      }

      const { user } = response.data;

      const session: UserSession = {
        id: user.id,
        userId: user.id,
        email: user.email,
        username: user.nickname || user.email.split("@")[0],
        nickname: user.nickname,
        name: user.nickname || user.email.split("@")[0],
        balance: user.balance,
        referralCode: user.referralCode || this.generateReferralCode(),
        isLoggedIn: true,
        loginTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        isAdmin: user.email === "neulketing@gmail.com", // 백엔드에서 관리자 확인
      };

      this.saveSession(session, userData.rememberMe);
      return session;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "로그인 처리 중 오류가 발생했습니다.";
      throw new Error(message);
    }
  }

  // 회원가입 처리 (백엔드 API 연동)
  async signup(userData: {
    email: string;
    password: string;
    confirmPassword: string;
    referralCode?: string;
  }): Promise<UserSession> {
    try {
      // 클라이언트 측 유효성 검사
      if (userData.password !== userData.confirmPassword) {
        throw new Error("비밀번호가 일치하지 않습니다.");
      }

      if (userData.password.length < 6) {
        throw new Error("비밀번호는 6자 이상이어야 합니다.");
      }

      const response = await backendApi.register({
        email: userData.email,
        nickname: userData.email.split("@")[0],
        password: userData.password,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || "회원가입에 실패했습니다.");
      }

      const { user } = response.data;

      const session: UserSession = {
        id: user.id,
        userId: user.id,
        email: user.email,
        username: user.nickname || user.email.split("@")[0],
        nickname: user.nickname,
        name: user.nickname || user.email.split("@")[0],
        balance: user.balance, // 백엔드에서 이미 처리된 보너스 금액
        referralCode: user.referralCode || this.generateReferralCode(),
        isLoggedIn: true,
        loginTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        isAdmin: user.email === "neulketing@gmail.com", // 백엔드에서 관리자 확인
      };

      this.saveSession(session);
      return session;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "회원가입 처리 중 오류가 발생했습니다.";
      throw new Error(message);
    }
  }

  // 로그아웃 처리 (백엔드 API 연동)
  async logout(): Promise<void> {
    try {
      // 백엔드에 로그아웃 요청
      await backendApi.logout();
    } catch (error) {
      console.error("로그아웃 API 호출 실패:", error);
    } finally {
      // 로컬 세션 정리
      localStorage.removeItem(this.SESSION_KEY);
      sessionStorage.removeItem(this.SESSION_KEY);

      // 세션 스토리지 완전 정리
      localStorage.removeItem("snsshop_user_preferences");
      sessionStorage.removeItem("snsshop_temp_data");

      // 백엔드 API 토큰 제거
      backendApi.clearToken();

      // 페이지 새로고침으로 상태 완전 초기화
      window.location.reload();
    }
  }

  // 현재 세션 가져오기
  getCurrentSession(): UserSession | null {
    const sessionData =
      localStorage.getItem(this.SESSION_KEY) ||
      sessionStorage.getItem(this.SESSION_KEY);

    if (!sessionData) return null;

    try {
      const session: UserSession = JSON.parse(sessionData);

      // 세션 만료 체크
      if (this.isSessionExpired(session)) {
        this.logout();
        return null;
      }

      // 마지막 활동 시간 업데이트
      session.lastActivity = new Date().toISOString();
      this.saveSession(session);

      return session;
    } catch (error) {
      console.error("세션 파싱 오류:", error);
      this.logout();
      return null;
    }
  }

  // 세션 저장
  private saveSession(session: UserSession, persistent = false): void {
    const sessionData = JSON.stringify(session);

    if (persistent) {
      localStorage.setItem(this.SESSION_KEY, sessionData);
    } else {
      sessionStorage.setItem(this.SESSION_KEY, sessionData);
    }
  }

  // 세션 만료 체크
  private isSessionExpired(session: UserSession): boolean {
    const now = new Date().getTime();
    const lastActivity = new Date(session.lastActivity).getTime();
    return now - lastActivity > this.SESSION_TIMEOUT;
  }

  // 잔액 업데이트 (로컬 세션만 업데이트, 백엔드 연동은 별도 API 호출)
  updateBalance(newBalance: number): void {
    const session = this.getCurrentSession();
    if (session) {
      session.balance = newBalance;
      session.lastActivity = new Date().toISOString();
      this.saveSession(session);
    }
  }

  // 백엔드에서 최신 잔액 가져오기
  async refreshBalance(): Promise<number | null> {
    try {
      const response = await backendApi.getBalance();
      if (response.success && response.data) {
        const newBalance = response.data.balance;
        this.updateBalance(newBalance);
        return newBalance;
      }
      return null;
    } catch (error) {
      console.error("잔액 조회 실패:", error);
      return null;
    }
  }

  // 추천인 코드 생성
  private generateReferralCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "SNS";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // 비밀번호 재설정 (시뮬레이션)
  resetPassword(email: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`비밀번호 재설정 이메일이 ${email}로 전송되었습니다.`);
        resolve(true);
      }, 1000);
    });
  }

  // 세션 유효성 검사
  isValidSession(): boolean {
    const session = this.getCurrentSession();
    return session?.isLoggedIn ?? false;
  }
}

export const authManager = AuthManager.getInstance();

// 인증 상태 감시 훅
export const useAuthState = () => {
  const checkAuth = () => {
    return authManager.getCurrentSession();
  };

  const login = async (credentials: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }) => {
    return authManager.login(credentials);
  };

  const signup = async (userData: {
    email: string;
    password: string;
    confirmPassword: string;
    referralCode?: string;
  }) => {
    return authManager.signup(userData);
  };

  const logout = () => {
    authManager.logout();
  };

  const updateBalance = (balance: number) => {
    authManager.updateBalance(balance);
  };

  return {
    checkAuth,
    login,
    signup,
    logout,
    updateBalance,
    isValidSession: authManager.isValidSession(),
  };
};
