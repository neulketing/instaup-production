import { useNavigate } from "react-router-dom";
import type { UserSession } from "../utils/auth";
import { NotificationButton } from "./RealtimeNotifications";

interface HeaderProps {
  userSession: UserSession | null;
  onAuth: (mode: "signin" | "signup") => void;
  onLogout: () => void;
  onShowRecharge: () => void;
  onShowOrders: () => void;
  onShowAccount: () => void;
  onShowAdmin: () => void;
  onShowNotifications: () => void;
  onToggleMobileMenu: () => void;
}

export default function Header({
  userSession,
  onAuth,
  onLogout,
  onShowRecharge,
  onShowOrders,
  onShowAccount,
  onShowAdmin,
  onShowNotifications,
  onToggleMobileMenu,
}: HeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-full mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 좌측 - 충전하기/계정설정 (로그인 시) */}
          <div className="flex items-center space-x-4">
            {userSession ? (
              <div className="hidden md:flex items-center space-x-4">
                <button
                  onClick={onShowRecharge}
                  className="text-[#22426f] hover:bg-blue-50 px-3 py-2 rounded transition-colors font-medium"
                >
                  충전하기
                </button>
                <button
                  onClick={onShowAccount}
                  className="text-[#22426f] hover:bg-blue-50 px-3 py-2 rounded transition-colors font-medium"
                >
                  계정설정
                </button>
              </div>
            ) : (
              <div className="w-20"></div>
            )}
          </div>

          {/* 중앙 - SNS샵 로고 */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="https://ext.same-assets.com/3036106235/246958056.svg"
              alt="INSTAUP"
              className="h-10 w-auto"
            />
          </div>

          {/* 우측 - 네비게이션 */}
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => navigate("/")}
                className="text-gray-700 hover:text-[#22426f] font-medium transition-colors"
              >
                주문하기
              </button>
              <button
                onClick={() => navigate("/guide")}
                className="text-gray-700 hover:text-[#22426f] font-medium transition-colors"
              >
                상품안내 및 주문방법
              </button>
              <button
                onClick={() => navigate("/faq")}
                className="text-gray-700 hover:text-[#22426f] font-medium transition-colors"
              >
                자주 묻는 질문
              </button>
            </nav>

            {!userSession && (
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={() => onAuth("signin")}
                  className="text-[#22426f] hover:bg-blue-50 px-4 py-2 rounded font-medium transition-colors"
                >
                  로그인
                </button>
                <button
                  onClick={() => onAuth("signup")}
                  className="bg-[#22426f] text-white px-4 py-2 rounded font-medium hover:bg-[#1e3b61] transition-colors"
                >
                  회원가입
                </button>
              </div>
            )}

            {userSession && (
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  잔액:{" "}
                  <span className="font-bold text-[#22426f]">
                    {userSession.balance?.toLocaleString() || "0"}원
                  </span>
                </div>

                {/* 실시간 알림 버튼 */}
                <NotificationButton
                  userId={userSession.userId}
                  onClick={onShowNotifications}
                />

                <button
                  onClick={onShowOrders}
                  className="text-[#22426f] hover:bg-blue-50 px-3 py-2 rounded transition-colors font-medium"
                >
                  주문내역
                </button>
                {userSession.isAdmin && (
                  <button
                    onClick={onShowAdmin}
                    className="text-purple-600 hover:bg-purple-50 px-3 py-2 rounded transition-colors font-medium"
                  >
                    관리자
                  </button>
                )}
                <button
                  onClick={onLogout}
                  className="text-red-600 hover:bg-red-50 px-3 py-2 rounded transition-colors font-medium"
                >
                  로그아웃
                </button>
              </div>
            )}

            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className="w-full h-0.5 bg-gray-600 transition-all"></div>
                <div className="w-full h-0.5 bg-gray-600 transition-all"></div>
                <div className="w-full h-0.5 bg-gray-600 transition-all"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
