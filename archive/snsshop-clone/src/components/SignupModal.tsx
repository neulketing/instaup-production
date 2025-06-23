import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

interface SignupModalProps {
  onClose: () => void
  onLoginClick: () => void
}

export default function SignupModal({ onClose, onLoginClick }: SignupModalProps) {
  const { register, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password || !confirmPassword || !nickname) {
      setError('모든 필드를 입력해주세요.')
      return
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }

    if (!agreeTerms || !agreePrivacy) {
      setError('필수 약관에 동의해주세요.')
      return
    }

    const success = await register(email, password, nickname)
    if (success) {
      onClose()
    } else {
      setError('이미 존재하는 이메일입니다.')
    }
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">회원가입</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="이메일을 입력하세요"
                disabled={isLoading}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="6자 이상 입력하세요"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 확인
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="비밀번호를 다시 입력하세요"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                닉네임
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="닉네임을 입력하세요"
                disabled={isLoading}
              />
            </div>

            {/* Terms */}
            <div className="space-y-3 py-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 rounded border-gray-300"
                  disabled={isLoading}
                />
                <span className="ml-3 text-sm text-gray-700">
                  <span className="text-red-500">[필수]</span> 이용약관에 동의합니다
                  <button type="button" className="text-blue-600 hover:text-blue-800 ml-1">보기</button>
                </span>
              </label>

              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  className="mt-1 rounded border-gray-300"
                  disabled={isLoading}
                />
                <span className="ml-3 text-sm text-gray-700">
                  <span className="text-red-500">[필수]</span> 개인정보 처리방침에 동의합니다
                  <button type="button" className="text-blue-600 hover:text-blue-800 ml-1">보기</button>
                </span>
              </label>

              <label className="flex items-start">
                <input type="checkbox" className="mt-1 rounded border-gray-300" disabled={isLoading} />
                <span className="ml-3 text-sm text-gray-700">
                  <span className="text-gray-500">[선택]</span> 마케팅 정보 수신에 동의합니다
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-2xl font-medium hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>가입 중...</span>
                </div>
              ) : (
                '회원가입'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-4 text-sm text-gray-500">또는</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          {/* Social Signup */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <img
                src="https://ext.same-assets.com/3036106235/4075293063.svg"
                alt="카카오"
                className="w-5 h-5 mr-3"
              />
              <span className="text-gray-700">카카오로 가입</span>
            </button>

            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <img
                src="https://ext.same-assets.com/3036106235/3806946608.svg"
                alt="네이버"
                className="w-5 h-5 mr-3"
              />
              <span className="text-gray-700">네이버로 가입</span>
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              이미 계정이 있으신가요?{' '}
              <button
                onClick={onLoginClick}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                로그인하기
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
