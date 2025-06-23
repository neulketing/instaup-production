import { useState } from 'react'
import apiService from '../services/api'

interface TopUpModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  currentBalance: number
  requiredAmount?: number
}

export default function TopUpModal({
  isOpen,
  onClose,
  onSuccess,
  currentBalance,
  requiredAmount
}: TopUpModalProps) {
  const [amount, setAmount] = useState(requiredAmount || 10000)
  const [isLoading, setIsLoading] = useState(false)

  const presetAmounts = [10000, 30000, 50000, 100000, 200000]

  const handleTopUp = async () => {
    if (amount <= 0) {
      alert('올바른 금액을 입력해주세요.')
      return
    }

    setIsLoading(true)

    try {
      const data = await apiService.topUpBalance(amount)

      if (data.success) {
        alert(`${amount.toLocaleString()}원이 충전되었습니다!`)
        onSuccess()
        onClose()
      } else {
        alert(`충전 실패: ${data.error}`)
      }
    } catch (error) {
      console.error('TopUp error:', error)
      alert('충전 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">잔액 충전</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>

          {/* Current Balance */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <div className="text-sm text-gray-600 mb-1">현재 잔액</div>
            <div className="text-2xl font-bold text-[#22426f]">
              {currentBalance.toLocaleString()}원
            </div>
            {requiredAmount && (
              <div className="text-sm text-red-600 mt-2">
                부족한 금액: {(requiredAmount - currentBalance).toLocaleString()}원
              </div>
            )}
          </div>

          {/* Preset Amounts */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              빠른 충전
            </label>
            <div className="grid grid-cols-3 gap-2">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset)}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                    amount === preset
                      ? 'bg-[#22426f] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {preset.toLocaleString()}원
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              직접 입력
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#22426f] focus:border-transparent"
              placeholder="충전할 금액을 입력하세요"
              min="1000"
              step="1000"
            />
          </div>

          {/* Total After TopUp */}
          <div className="bg-blue-50 rounded-2xl p-4 mb-6">
            <div className="text-sm text-gray-600 mb-1">충전 후 잔액</div>
            <div className="text-xl font-bold text-blue-600">
              {(currentBalance + amount).toLocaleString()}원
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleTopUp}
              disabled={isLoading || amount <= 0}
              className="flex-1 py-3 bg-[#22426f] text-white rounded-xl font-medium hover:bg-[#1a334f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '충전 중...' : `${amount.toLocaleString()}원 충전`}
            </button>
          </div>

          {/* Notice */}
          <div className="mt-4 p-3 bg-yellow-50 rounded-xl">
            <div className="text-xs text-yellow-700">
              💡 충전 후 미결제 주문이 자동으로 처리됩니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
