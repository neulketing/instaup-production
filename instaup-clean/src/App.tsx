import { Suspense, lazy, useEffect, useState } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import AIRecommendationPanel from "./components/AIRecommendationPanel";
import CustomerSupportChat from "./components/CustomerSupportChat";
// Core Components (직접 import)
import OrderProcess from "./components/OrderProcess";
import ServerStatusMonitor from "./components/ServerStatusMonitor";
import ToastNotification, { useToast } from "./components/ToastNotification";

// Modal Components (lazy loading)
const AuthModal = lazy(() => import("./components/AuthModal"));
const StepOrderModal = lazy(() => import("./components/StepOrderModal"));
const RechargeModal = lazy(() => import("./components/RechargeModal"));
const OrderHistoryModal = lazy(() => import("./components/OrderHistoryModal"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const APITestPanel = lazy(() => import("./components/APITestPanel"));
const RealtimeNotifications = lazy(
  () => import("./components/RealtimeNotifications"),
);

// Pages (lazy loading)
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const AddFundsPage = lazy(() => import("./pages/AddFundsPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const GuidePage = lazy(() => import("./pages/GuidePage"));

// API 테스트 서비스 (개발용)
import "./services/testApi";

import { orderService } from "./services/orderService";
import { ServiceCategory, type ServiceItem } from "./types/services";
import { type UserSession, authManager } from "./utils/auth";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showOrderHistoryModal, setShowOrderHistoryModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showCustomerChat, setShowCustomerChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    null,
  );
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // 토스트 알림 시스템
  const toast = useToast();

  // 홈페이지인지 확인
  const isHomePage = location.pathname === "/";

  // 컴포넌트 마운트 시 세션 복원
  useEffect(() => {
    const session = authManager.getCurrentSession();
    if (session) {
      setUserSession(session);
    }
  }, []);

  // 세션 상태 변경 감지 (잔액 업데이트 등)
  useEffect(() => {
    const interval = setInterval(() => {
      const currentSession = authManager.getCurrentSession();
      if (currentSession && userSession) {
        // 세션이 변경되었으면 상태 업데이트
        if (
          currentSession.balance !== userSession.balance ||
          currentSession.lastActivity !== userSession.lastActivity
        ) {
          setUserSession(currentSession);
        }
      } else if (!currentSession && userSession) {
        // 세션이 만료되었으면 로그아웃 처리
        setUserSession(null);
      }
    }, 1000); // 1초마다 체크

    return () => clearInterval(interval);
  }, [userSession]);

  const handleAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setAuthError(null);
    setShowAuthModal(true);
  };

  const handleAuthSubmit = async (authData: {
    username: string;
    password: string;
    email?: string;
    rememberMe?: boolean;
    confirmPassword?: string;
    referralCode?: string;
  }) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      let session: UserSession;

      if (authMode === "signin") {
        session = await authManager.login({
          email: authData.email,
          password: authData.password,
          rememberMe: authData.rememberMe,
        });
      } else {
        session = await authManager.signup({
          email: authData.email,
          password: authData.password,
          confirmPassword: authData.confirmPassword,
          referralCode: authData.referralCode,
        });
      }

      setUserSession(session);
      setShowAuthModal(false);

      // 토스트 알림으로 변경
      toast.success(
        authMode === "signin" ? "로그인 성공!" : "회원가입 완료!",
        authMode === "signin"
          ? `환영합니다, ${session.name}님! 현재 잔액: ${session.balance.toLocaleString()}원`
          : `환영합니다, ${session.name}님! 가입 축하 잔액: ${session.balance.toLocaleString()}원`,
        { duration: 6000 },
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "인증 처리 중 오류가 발생했습니다.";
      setAuthError(errorMessage);
      toast.error("인증 실패", errorMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm("정말로 로그아웃하시겠습니까?")) {
      await authManager.logout();
      setUserSession(null);
      // 페이지 새로고침은 authManager.logout()에서 처리됨
    }
  };

  const handleServiceSelect = (service: ServiceItem | string) => {
    if (typeof service === "string") {
      // AI 추천에서 서비스 ID로 호출된 경우
      const mockService: ServiceItem = {
        id: service,
        platform: "instagram",
        name: `AI 추천 서비스: ${service}`,
        description: "AI가 추천한 서비스입니다.",
        price: 180,
        minOrder: 10,
        maxOrder: 10000,
        deliveryTime: "1-5분",
        quality: "premium",
        features: ["즉시 시작", "무료 리필"],
        category: ServiceCategory.FOLLOWERS,
        isPopular: true,
      };
      setSelectedService(mockService);
    } else {
      setSelectedService(service);
    }
    setShowOrderModal(true);
  };

  // OrderProcess 컴포넌트용 주문 처리 함수
  const handleOrderProcessOrder = (orderData: {
    service: ServiceItem;
    targetUrl: string;
    quantity: number;
    totalAmount: number;
  }) => {
    if (!userSession) return;

    console.log("주문 데이터:", orderData);

    // 잔액 확인
    if (userSession.balance < orderData.totalAmount) {
      toast.error(
        "잔액 부족",
        `잔액이 부족합니다. 현재 잔액: ${userSession.balance.toLocaleString()}원`,
        { duration: 5000 },
      );
      setShowRechargeModal(true);
      return;
    }

    // 주문 처리
    const processOrder = async () => {
      try {
        const result = await orderService.createOrder(
          orderData.service.id,
          orderData.quantity,
          orderData.targetUrl,
        );

        if (result.success) {
          // 잔액 업데이트
          const newBalance = userSession.balance - orderData.totalAmount;
          authManager.updateBalance(newBalance);
          setUserSession({ ...userSession, balance: newBalance });

          toast.success(
            "주문 완료!",
            `주문이 성공적으로 처리되었습니다. 주문번호: ${result.orderId}`,
            { duration: 8000 },
          );

          // 주문 완료 후 주문 내역 페이지로 이동하는 옵션 제공
          setTimeout(() => {
            if (confirm("주문 내역을 확인하시겠습니까?")) {
              navigate("/orders");
            }
          }, 1000);
        } else {
          toast.error(
            "주문 실패",
            result.message || "주문 처리 중 오류가 발생했습니다.",
          );
        }
      } catch (error: unknown) {
        console.error("Order processing error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "주문 처리 중 오류가 발생했습니다.";
        toast.error("주문 실패", errorMessage);
      }
    };

    processOrder();
  };

  // 기존 StepOrderModal용 주문 처리 함수 (하위 호환)
  const handleOrder = (orderData: {
    targetUrl: string;
    quantity: number;
    totalAmount?: number;
  }) => {
    if (!userSession) return;

    console.log("주문 데이터:", orderData);

    // 잔액 확인
    const totalAmount =
      orderData.totalAmount ||
      (selectedService ? selectedService.price * orderData.quantity : 0);
    if (userSession.balance < totalAmount) {
      toast.error(
        "잔액 부족",
        `잔액이 부족합니다. 현재 잔액: ${userSession.balance.toLocaleString()}원`,
        { duration: 5000 },
      );
      setShowOrderModal(false);
      setShowRechargeModal(true);
      return;
    }

    // 주문 처리
    const processOrder = async () => {
      try {
        const result = await orderService.createOrder(
          selectedService.id,
          orderData.quantity,
          orderData.targetUrl,
        );

        if (result.success) {
          // 잔액 업데이트
          const newBalance = userSession.balance - totalAmount;
          authManager.updateBalance(newBalance);
          setUserSession({ ...userSession, balance: newBalance });

          setShowOrderModal(false);
          toast.success(
            "주문 완료!",
            `주문이 성공적으로 처리되었습니다. 주문번호: ${result.orderId}`,
            { duration: 8000 },
          );

          // 주문 완료 후 주문 내역 페이지로 이동하는 옵션 제공
          setTimeout(() => {
            if (confirm("주문 내역을 확인하시겠습니까?")) {
              navigate("/orders");
            }
          }, 1000);
        } else {
          toast.error(
            "주문 실패",
            result.message || "주문 처리 중 오류가 발생했습니다.",
          );
        }
      } catch (error: unknown) {
        console.error("Order processing error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "주문 처리 중 오류가 발생했습니다.";
        toast.error("주문 실패", errorMessage);
      }
    };

    processOrder();
  };

  const handleRechargeComplete = (amount: number) => {
    if (userSession) {
      const newBalance = userSession.balance + amount;
      authManager.updateBalance(newBalance);
      setUserSession({ ...userSession, balance: newBalance });

      toast.success(
        "충전 완료!",
        `${amount.toLocaleString()}원이 충전되었습니다. 현재 잔액: ${newBalance.toLocaleString()}원`,
        { duration: 5000 },
      );

      // 충전 후 재주문 가능 UX 흐름: 주문 모달로 복귀
      setShowRechargeModal(false);
      setTimeout(() => {
        if (selectedService) {
          if (confirm("충전이 완료되었습니다. 주문을 계속하시겠습니까?")) {
            setShowOrderModal(true);
          }
        }
      }, 500);
    }
  };

  const handleShowRecharge = () => {
    if (!userSession) {
      handleAuth("signin");
      return;
    }
    navigate("/addfunds");
  };

  const handleShowOrders = () => {
    if (!userSession) {
      handleAuth("signin");
      return;
    }
    navigate("/orders");
  };

  const handleShowAccount = () => {
    if (!userSession) {
      handleAuth("signin");
      return;
    }
    navigate("/account");
  };

  const handleShowAdmin = () => {
    if (!userSession || !userSession.isAdmin) {
      toast.error("접근 권한 없음", "관리자 권한이 필요합니다.");
      return;
    }
    navigate("/admin");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 모바일 오버레이 */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* 좌측 고정 사이드바 - SNS샵 스타일 */}
      <aside
        className={`
        fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 flex flex-col transform transition-transform duration-300 ease-in-out
        md:translate-x-0
        ${showMobileMenu ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* 모바일 닫기 버튼 */}
        <div className="md:hidden p-4 border-b border-gray-200">
          <button
            onClick={() => setShowMobileMenu(false)}
            className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700"
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

        {/* 로고 영역 */}
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={() => {
              navigate("/");
              setShowMobileMenu(false);
            }}
            className="flex items-center space-x-3 w-full"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold text-gray-900">InstaUp</span>
              <span className="text-xs text-gray-500">프리미엄 SNS 마케팅</span>
            </div>
          </button>
        </div>

        {/* 메뉴 영역 */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <button
              onClick={() => {
                navigate("/");
                setShowMobileMenu(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === "/"
                  ? "bg-[#22426f] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-3a1 1 0 011-1h2a1 1 0 011 1v3a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="font-medium">주문하기</span>
            </button>

            {userSession && (
              <>
                <button
                  onClick={() => {
                    navigate("/orders");
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === "/orders"
                      ? "bg-[#22426f] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">주문 관리</span>
                </button>

                <button
                  onClick={() => {
                    navigate("/addfunds");
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === "/addfunds"
                      ? "bg-[#22426f] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path
                      fillRule="evenodd"
                      d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">충전하기</span>
                </button>
              </>
            )}

            <button
              onClick={() => {
                navigate("/guide");
                setShowMobileMenu(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === "/guide"
                  ? "bg-[#22426f] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">상품안내</span>
            </button>

            <button
              onClick={() => {
                navigate("/faq");
                setShowMobileMenu(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === "/faq"
                  ? "bg-[#22426f] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">자주 묻는 질문</span>
            </button>
          </div>
        </nav>

        {/* 사용자 정보/로그인 영역 */}
        <div className="p-4 border-t border-gray-200">
          {userSession ? (
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-900">
                  {userSession.name}
                </div>
                <div className="text-xs text-gray-500">{userSession.email}</div>
                <div className="text-sm font-bold text-[#22426f] mt-1">
                  잔액: {userSession.balance.toLocaleString()}원
                </div>
              </div>

              <button
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">로그아웃</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => {
                  handleAuth("signin");
                  setShowMobileMenu(false);
                }}
                className="w-full px-4 py-2 bg-[#22426f] text-white rounded-lg hover:bg-[#1a365d] transition-colors font-medium"
              >
                로그인
              </button>
              <button
                onClick={() => {
                  handleAuth("signup");
                  setShowMobileMenu(false);
                }}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                회원가입
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 md:ml-64">
        {/* 모바일 헤더 */}
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setShowMobileMenu(true)}
            className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-gray-700"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">I</span>
            </div>
            <span className="font-bold text-gray-900">InstaUp</span>
          </div>

          <div className="w-10"> {/* Spacer for centering */}</div>
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <div className="min-h-screen bg-gray-50">
                <OrderProcess
                  userSession={userSession}
                  onAuth={handleAuth}
                  onShowRecharge={handleShowRecharge}
                  onOrder={handleOrderProcessOrder}
                />
              </div>
            }
          />

          {/* 다른 페이지들 - Lazy Loading 적용 */}
          <Route
            path="/orders"
            element={
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-64">
                    <div className="loading-spinner" />
                  </div>
                }
              >
                <OrdersPage userSession={userSession} />
              </Suspense>
            }
          />
          <Route
            path="/addfunds"
            element={
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-64">
                    <div className="loading-spinner" />
                  </div>
                }
              >
                <AddFundsPage userSession={userSession} />
              </Suspense>
            }
          />
          <Route
            path="/account"
            element={
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-64">
                    <div className="loading-spinner" />
                  </div>
                }
              >
                <AccountPage userSession={userSession} />
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-64">
                    <div className="loading-spinner" />
                  </div>
                }
              >
                <AdminPage userSession={userSession} />
              </Suspense>
            }
          />
          <Route
            path="/faq"
            element={
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-64">
                    <div className="loading-spinner" />
                  </div>
                }
              >
                <FaqPage />
              </Suspense>
            }
          />
          <Route
            path="/guide"
            element={
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-64">
                    <div className="loading-spinner" />
                  </div>
                }
              >
                <GuidePage />
              </Suspense>
            }
          />
        </Routes>
      </div>

      {/* 토스트 알림 및 상태 모니터 */}
      <ToastNotification
        messages={toast.messages}
        onRemove={toast.removeToast}
      />
      <ServerStatusMonitor />

      {/* 모달들 - Lazy Loading 적용 */}
      {showAuthModal && (
        <Suspense fallback={<div className="modal-loading">Loading...</div>}>
          <AuthModal
            isOpen={showAuthModal}
            mode={authMode}
            onClose={() => setShowAuthModal(false)}
            onSubmit={handleAuthSubmit}
            onSwitchMode={setAuthMode}
            loading={authLoading}
            error={authError}
          />
        </Suspense>
      )}

      {showOrderModal && selectedService && (
        <Suspense fallback={<div className="modal-loading">Loading...</div>}>
          <StepOrderModal
            isOpen={showOrderModal}
            service={selectedService}
            userSession={userSession}
            onClose={() => setShowOrderModal(false)}
            onOrder={handleOrder}
            onAuthRequired={() => {
              setShowOrderModal(false);
              handleAuth("signin");
            }}
          />
        </Suspense>
      )}

      {showRechargeModal && (
        <Suspense fallback={<div className="modal-loading">Loading...</div>}>
          <RechargeModal
            isOpen={showRechargeModal}
            onClose={() => setShowRechargeModal(false)}
            currentBalance={userSession?.balance || 0}
            onRechargeComplete={handleRechargeComplete}
          />
        </Suspense>
      )}

      {showOrderHistoryModal && (
        <Suspense fallback={<div className="modal-loading">Loading...</div>}>
          <OrderHistoryModal
            isOpen={showOrderHistoryModal}
            onClose={() => setShowOrderHistoryModal(false)}
            userSession={userSession}
          />
        </Suspense>
      )}

      {showAdminDashboard && (
        <AdminDashboard
          isOpen={showAdminDashboard}
          onClose={() => setShowAdminDashboard(false)}
          userSession={userSession}
        />
      )}

      {/* 실시간 알림 */}
      <RealtimeNotifications
        userId={userSession?.userId || null}
        isVisible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* 고객 지원 채팅 */}
      {showCustomerChat && (
        <CustomerSupportChat
          isOpen={showCustomerChat}
          onClose={() => setShowCustomerChat(false)}
          userSession={userSession}
        />
      )}

      {/* 고객 지원 채팅 버튼 (홈페이지에만 표시) */}
      {isHomePage && (
        <button
          onClick={() => setShowCustomerChat(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors z-40 flex items-center justify-center"
          title="고객센터 문의"
        >
          💬
        </button>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
