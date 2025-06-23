import type { UserSession } from "../utils/auth";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onAuth: (mode: "signin" | "signup") => void;
  onRechargeClick?: () => void;
  onOrderHistoryClick?: () => void;
  onLogout?: () => void;
  userSession?: UserSession | null;
}

export default function MobileMenu({
  isOpen,
  onClose,
  isLoggedIn,
  onAuth,
  onRechargeClick,
  onOrderHistoryClick,
  onLogout,
  userSession,
}: MobileMenuProps) {
  if (!isOpen) return null;

  const handleMenuClick = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* 메뉴 패널 */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <img
                src="https://ext.same-assets.com/3036106235/1111560219.svg"
                alt="SNS샵 로고"
                className="h-6 w-auto"
              />
              <h2 className="text-lg font-bold text-[#22426f]">메뉴</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <span className="text-gray-600">✕</span>
            </button>
          </div>

          {/* 사용자 정보 (로그인 시) */}
          {isLoggedIn && userSession && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#22426f] text-white rounded-full flex items-center justify-center font-bold">
                  {userSession.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {userSession.name}님
                  </div>
                  <div className="text-sm text-gray-600">
                    {userSession.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-blue-200">
                <span className="text-sm text-gray-600">현재 잔액</span>
                <span className="font-bold text-[#22426f]">
                  {userSession.balance.toLocaleString()}원
                </span>
              </div>
              {userSession.referralCode && (
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">추천인 코드</span>
                  <span className="text-xs font-mono bg-white px-2 py-1 rounded">
                    {userSession.referralCode}
                  </span>
                </div>
              )}
            </div>
          )}

          <nav className="space-y-2">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
              className="block py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-[#22426f] rounded-lg font-medium transition-colors"
            >
              📋 주문하기
            </a>
            <a
              href="/guide"
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
              className="block py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-[#22426f] rounded-lg font-medium transition-colors"
            >
              📖 상품안내 및 주문방법
            </a>
            <a
              href="/faq"
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
              className="block py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-[#22426f] rounded-lg font-medium transition-colors"
            >
              ❓ 자주 묻는 질문
            </a>

            <div className="border-t pt-4 mt-4">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <button
                    onClick={() => handleMenuClick(() => onRechargeClick?.())}
                    className="w-full text-left py-3 px-4 text-[#22426f] hover:bg-blue-50 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    💰 충전하기
                  </button>
                  <button
                    onClick={() =>
                      handleMenuClick(() => onOrderHistoryClick?.())
                    }
                    className="w-full text-left py-3 px-4 text-[#22426f] hover:bg-blue-50 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    📊 주문 내역
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                    }}
                    className="w-full text-left py-3 px-4 text-[#22426f] hover:bg-blue-50 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    ⚙️ 계정 설정
                  </button>

                  {/* 고객센터 */}
                  <div className="border-t pt-2 mt-2">
                    <button
                      onClick={() =>
                        window.open("https://open.kakao.com/sns", "_blank")
                      }
                      className="w-full text-left py-3 px-4 text-green-600 hover:bg-green-50 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      💬 카카오톡 상담
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onClose();
                      }}
                      className="w-full text-left py-3 px-4 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      📞 1:1 문의
                    </button>
                  </div>

                  {/* 로그아웃 */}
                  <div className="border-t pt-2 mt-2">
                    <button
                      onClick={() => handleMenuClick(() => onLogout?.())}
                      className="w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      🚪 로그아웃
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => handleMenuClick(() => onAuth("signin"))}
                    className="w-full py-3 px-4 text-[#22426f] hover:bg-blue-50 rounded-lg font-medium text-left transition-colors flex items-center gap-2"
                  >
                    🔑 로그인
                  </button>
                  <button
                    onClick={() => handleMenuClick(() => onAuth("signup"))}
                    className="w-full py-3 px-4 bg-[#22426f] text-white rounded-lg font-medium hover:bg-[#1e3b61] transition-colors flex items-center gap-2"
                  >
                    ✨ 회원가입
                  </button>

                  {/* 고객센터 */}
                  <div className="border-t pt-2 mt-2">
                    <button
                      onClick={() =>
                        window.open("https://open.kakao.com/sns", "_blank")
                      }
                      className="w-full text-left py-3 px-4 text-green-600 hover:bg-green-50 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      💬 카카오톡 상담
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* 앱 정보 */}
          <div className="mt-8 pt-4 border-t">
            <div className="text-center text-xs text-gray-500">
              <div className="mb-2">
                <img
                  src="https://ext.same-assets.com/3036106235/1111560219.svg"
                  alt="SNS샵"
                  className="h-6 w-auto mx-auto mb-1"
                />
                <div className="font-medium">
                  SNS샵 - 실제 한국인 SNS 마케팅
                </div>
              </div>
              <div className="space-y-1">
                <div>Version 2.1.0</div>
                <div>© 2024 SNS샵. All rights reserved.</div>
                <div>
                  <a href="/terms" className="hover:text-[#22426f]">
                    이용약관
                  </a>
                  {" · "}
                  <a href="/privacy" className="hover:text-[#22426f]">
                    개인정보처리방침
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
