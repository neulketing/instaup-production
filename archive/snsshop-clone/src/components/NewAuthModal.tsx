import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

interface NewAuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'signup'
  onSwitchMode: () => void
}

export default function NewAuthModal({ isOpen, onClose, mode, onSwitchMode }: NewAuthModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { login, register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, password, nickname)
      }

      // Success
      setEmail('')
      setPassword('')
      setNickname('')
      onClose()
    } catch (err: any) {
      const errorMessage = err.message || '오류가 발생했습니다.'
      setError(errorMessage)

      // 자동으로 에러 메시지 클리어 (5초 후)
      setTimeout(() => {
        setError('')
      }, 5000)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'login' ? '로그인' : '회원가입'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#22426f] focus:border-transparent"
                placeholder="example@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#22426f] focus:border-transparent"
                placeholder="영문, 숫자 포함 6자 이상"
                required
                minLength={6}
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  닉네임
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#22426f] focus:border-transparent"
                  placeholder="사용할 닉네임"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#22426f] text-white rounded-xl font-medium hover:bg-[#1a334f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '처리 중...' : (mode === 'login' ? '로그인' : '회원가입')}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <button
              onClick={onSwitchMode}
              className="text-[#22426f] hover:underline text-sm"
            >
              {mode === 'login'
                ? '계정이 없나요? 회원가입'
                : '이미 계정이 있나요? 로그인'
              }
            </button>
          </div>

          {/* Welcome Bonus Notice */}
          {mode === 'signup' && (
            <div className="mt-4 p-3 bg-green-50 rounded-xl">
              <div className="text-xs text-green-700 text-center">
                🎉 회원가입 시 10,000원 적립금 지급!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
