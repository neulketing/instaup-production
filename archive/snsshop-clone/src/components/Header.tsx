import { useAuth } from '../hooks/useAuth'
import Logo from './Logo'

interface HeaderProps {
  onLoginClick: () => void
  onSignupClick: () => void
  onDashboardClick: () => void
  onOrdersClick: () => void
}

export default function Header({ onLoginClick, onSignupClick, onDashboardClick, onOrdersClick }: HeaderProps) {
  const { user, logout, isAuthenticated } = useAuth()
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Clean Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-900 hover:text-blue-600 font-medium">
              주문하기
            </a>
            <a href="/guide" className="text-gray-600 hover:text-blue-600">
              상품안내
            </a>
            <a href="/faq" className="text-gray-600 hover:text-blue-600">
              FAQ
            </a>
            <button
              onClick={onOrdersClick}
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              주문 관리 (베타)
            </button>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              // Logged in user
              <>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.nickname}</p>
                    <p className="text-xs text-gray-500">{user.balance.toLocaleString()}원</p>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.nickname.charAt(0)}
                  </div>
                </div>
                <button
                  onClick={onDashboardClick}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-2xl font-medium transition-colors"
                >
                  대시보드
                </button>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-red-600 font-medium"
                >
                  로그아웃
                </button>
              </>
            ) : (
              // Not logged in
              <>
                <button
                  onClick={onLoginClick}
                  className="text-gray-600 hover:text-[#22426f] font-medium"
                >
                  로그인
                </button>
                <button
                  onClick={onSignupClick}
                  className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-lg font-medium"
                >
                  회원가입
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50">
          <a href="/" className="block px-3 py-2 text-gray-900 font-medium">
            주문하기
          </a>
          <a href="/guide" className="block px-3 py-2 text-gray-600">
            상품안내 및 주문방법
          </a>
          <a href="/faq" className="block px-3 py-2 text-gray-600">
            자주 묻는 질문
          </a>
        </div>
      </div>
    </header>
  )
}
