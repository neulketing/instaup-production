import React from 'react'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

interface AddFundsProps {
  onClose: () => void
  onSuccess?: () => void
}

export default function AddFunds({ onClose, onSuccess }: AddFundsProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddFunds = async () => {
    setIsLoading(true)
    // Simplified version - redirect to top-up modal
    alert('충전 기능은 주문 관리 (베타)에서 사용할 수 있습니다.')
    onClose()
    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">잔액 충전</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              새로운 충전 시스템은 "주문 관리 (베타)"에서 사용할 수 있습니다.
            </p>

            <button
              onClick={handleAddFunds}
              disabled={isLoading}
              className="w-full py-3 bg-[#22426f] text-white rounded-xl font-medium hover:bg-[#1a334f] transition-colors disabled:opacity-50"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
