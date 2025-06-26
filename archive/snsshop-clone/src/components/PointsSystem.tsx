import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

interface PointsSystemProps {
  onClose: () => void
}

const chargeAmounts = [10000, 30000, 50000, 100000, 300000, 500000]

export default function PointsSystem({ onClose }: PointsSystemProps) {
  const { user } = useAuth()
  const [selectedAmount, setSelectedAmount] = useState(50000)
  const [customAmount, setCustomAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCharge = async () => {
    if (!user) return

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    const amount = customAmount ? Number.parseInt(customAmount) : selectedAmount
    const bonus = amount >= 100000 ? Math.floor(amount * 0.1) : 0 // 10% bonus for 100k+

    // updateBalance(amount + bonus) // Temporarily disabled

    setIsProcessing(false)
    alert(`충전이 완료되었습니다!\n충전금액: ${amount.toLocaleString()}원${bonus > 0 ? `\n보너스: ${bonus.toLocaleString()}원` : ''}`)
    onClose()
  }

  const getChargeAmount = () => {
    return customAmount ? Number.parseInt(customAmount) || 0 : selectedAmount
  }

  const getBonus = () => {
    const amount = getChargeAmount()
    return amount >= 100000 ? Math.floor(amount * 0.1) : 0
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">적립금 충전</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl w-12 h-12 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>

          {/* Current Balance */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-8">
            <h3 className="text-lg font-semibold mb-2">현재 보유 적립금</h3>
            <p className="text-3xl font-bold">{user?.balance.toLocaleString()}원</p>
          </div>

          {/* Amount Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">충전 금액 선택</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {chargeAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount)
                    setCustomAmount('')
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    selectedAmount === amount && !customAmount
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-lg font-semibold">
                    {amount.toLocaleString()}원
                  </div>
                  {amount >= 100000 && (
                    <div className="text-sm text-green-600 font-medium">
                      +{Math.floor(amount * 0.1).toLocaleString()}원 보너스
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                직접 입력 (최소 1,000원)
              </label>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value)
                  setSelectedAmount(0)
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="충전할 금액을 입력하세요"
                min="1000"
                step="1000"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">결제 방법</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'card', name: '신용카드', icon: '💳' },
                { id: 'bank', name: '계좌이체', icon: '🏦' },
                { id: 'kakao', name: '카카오페이', icon: '💛' }
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center space-x-3 ${
                    paymentMethod === method.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <span className="font-medium">{method.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Charge Summary */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">충전 요약</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>충전 금액:</span>
                <span className="font-semibold">{getChargeAmount().toLocaleString()}원</span>
              </div>
              {getBonus() > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>보너스 (10%):</span>
                  <span className="font-semibold">+{getBonus().toLocaleString()}원</span>
                </div>
              )}
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-bold">
                <span>총 지급 금액:</span>
                <span className="text-purple-600">
                  {(getChargeAmount() + getBonus()).toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>충전 후 잔액:</span>
                <span>
                  {((user?.balance || 0) + getChargeAmount() + getBonus()).toLocaleString()}원
                </span>
              </div>
            </div>
          </div>

          {/* Charge Button */}
          <button
            onClick={handleCharge}
            disabled={isProcessing || getChargeAmount() < 1000}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>결제 처리 중...</span>
              </div>
            ) : (
              `${(getChargeAmount() + getBonus()).toLocaleString()}원 충전하기`
            )}
          </button>

          {/* Notice */}
          <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
            <h4 className="font-semibold text-blue-900 mb-2">충전 안내사항</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 10만원 이상 충전 시 10% 보너스 적립금이 추가로 지급됩니다</li>
              <li>• 적립금은 모든 서비스 이용에 사용할 수 있습니다</li>
              <li>• 충전된 적립금은 환불이 불가능합니다</li>
              <li>• 결제 완료 후 즉시 적립금이 반영됩니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
