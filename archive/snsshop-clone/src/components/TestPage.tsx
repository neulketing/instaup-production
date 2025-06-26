import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import MainDashboard from './MainDashboard'

export default function TestPage() {
  const { user, isAuthenticated, login, register, logout } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [connectionStatus, setConnectionStatus] = useState('checking')

  // Check API connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('https://instaup-backend-production.up.railway.app/health', {
          method: 'GET'
        })
        setConnectionStatus(response.ok ? 'connected' : 'disconnected')
      } catch (error) {
        setConnectionStatus('disconnected')
      }
    }

    checkConnection()
  }, [])

  const handleLogin = async () => {
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return
    }

    setIsLoading(true)
    setError('')
    try {
      await login(email, password)
      setSuccess('로그인 성공!')
      setEmail('')
      setPassword('')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError('로그인 실패: ' + String(error))
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!email || !password || !nickname) {
      setError('모든 필드를 입력해주세요.')
      return
    }

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }

    setIsLoading(true)
    setError('')
    try {
      await register(email, password, nickname, referralCode)
      setSuccess(referralCode
        ? '회원가입 성공! 추천인 보너스와 함께 총 20,000원이 지급되었습니다!'
        : '회원가입 성공! 10,000원이 지급되었습니다!')
      setEmail('')
      setPassword('')
      setNickname('')
      setReferralCode('')
      setTimeout(() => setSuccess(''), 5000)
    } catch (error) {
      setError('회원가입 실패: ' + String(error))
    } finally {
      setIsLoading(false)
    }
  }

  // If authenticated, show the main dashboard
  if (isAuthenticated && user) {
    return <MainDashboard />
  }

  // Show login/register page for unauthenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">I</span>
              </div>
              <span className="text-xl font-bold text-gray-900">INSTAUP</span>
            </div>

            {/* Connection Status */}
            <div>
              {connectionStatus === 'checking' && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                  🔄 연결 확인 중...
                </div>
              )}
              {connectionStatus === 'connected' && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  ✅ 서버 연결됨
                </div>
              )}
              {connectionStatus === 'disconnected' && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                  ⚠️ 서버 연결 실패
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Marketing Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                SNS 성장의
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  새로운 시작
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                실제 한국인 팔로워로 인스타그램과 유튜브를 자연스럽게 성장시키세요.
                안전하고 빠른 SNS 마케팅 솔루션입니다.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: '🇰🇷', title: '100% 한국인', desc: '실제 한국인 계정만 사용' },
                { icon: '⚡', title: '즉시 시작', desc: '주문 후 1-3시간 내 시작' },
                { icon: '🔒', title: '안전 보장', desc: '계정 정지 위험 없음' },
                { icon: '💎', title: '프리미엄 품질', desc: '고품질 서비스 보장' }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="text-2xl mb-3">{feature.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
              <h3 className="text-xl font-semibold mb-6">실시간 통계</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">27,147,423</div>
                  <div className="text-blue-100 text-sm">총 주문 수</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">248,207</div>
                  <div className="text-blue-100 text-sm">총 회원 수</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">99.8%</div>
                  <div className="text-blue-100 text-sm">만족도</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isRegistering ? '🎉 무료 가입하기' : '🚀 로그인'}
              </h2>
              <p className="text-gray-600">
                {isRegistering
                  ? '가입하고 10,000원 무료 포인트 받기!'
                  : '계정에 로그인하여 서비스를 이용하세요'
                }
              </p>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                ❌ {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                ✅ {success}
              </div>
            )}

            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호
                </label>
                <input
                  type="password"
                  placeholder={isRegistering ? "6자 이상 입력" : "비밀번호"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              </div>

              {/* Registration Fields */}
              {isRegistering && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      닉네임
                    </label>
                    <input
                      type="text"
                      placeholder="사용할 닉네임"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      추천인 코드 (선택사항)
                    </label>
                    <input
                      type="text"
                      placeholder="INSTA123456"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      🎁 추천인 코드 입력 시 둘 다 10,000원 추가 보너스!
                    </p>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                onClick={isRegistering ? handleRegister : handleLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    처리중...
                  </div>
                ) : (
                  isRegistering ? '🎁 무료 가입하기' : '🚀 로그인하기'
                )}
              </button>

              {/* Toggle */}
              <button
                onClick={() => {
                  setIsRegistering(!isRegistering)
                  setError('')
                  setSuccess('')
                }}
                className="w-full text-blue-600 py-2 hover:underline font-medium"
                disabled={isLoading}
              >
                {isRegistering
                  ? '이미 계정이 있나요? 로그인'
                  : '계정이 없나요? 무료 가입'}
              </button>
            </div>

            {/* Registration Benefits */}
            {isRegistering && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-3">🎁 가입 혜택</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    즉시 10,000원 무료 포인트 지급
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    인스타그램 팔로워 100명 주문 가능
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    친구 추천 시 평생 커미션 수익
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    100% 실제 한국인 계정 보장
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
