import { useState } from 'react'

interface PaymentModalProps {
  onClose: () => void
  order: {
    id: string
    serviceName: string
    quantity: number
    totalPrice: number
  }
}

declare global {
  interface Window {
    PortOne?: unknown
    TossPayments?: (clientKey: string) => {
      requestPayment: (method: string, options: Record<string, unknown>) => Promise<void>
    }
  }
}

export default function PaymentModal({ onClose, order }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'KAKAOPAY' | 'TOSSPAY' | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleKakaoPay = async () => {
    setIsProcessing(true)
    try {
      // 실제 KakaoPay 결제 로직
      const { apiCall, API_CONFIG } = await import('../config/api')

      const result = await apiCall(API_CONFIG.ENDPOINTS.KAKAO_PAY_READY, {
        method: 'POST',
        body: JSON.stringify({
          orderId: order.id,
          amount: order.totalPrice,
          orderName: order.serviceName,
          quantity: order.quantity
        })
      })

      if (result.success && result.data?.approvalUrl) {
        // 카카오페이 결제 창으로 리다이렉트
        window.location.href = result.data.approvalUrl
      } else {
        throw new Error(result.message || '결제 요청 실패')
      }
    } catch (error) {
      console.error('KakaoPay error:', error)
      alert(`카카오페이 결제 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleTossPay = async () => {
    setIsProcessing(true)
    try {
      // TossPay SDK 로드 확인
      if (typeof window.PortOne === 'undefined') {
        const script = document.createElement('script')
        script.src = 'https://js.tosspayments.com/v1/payment'
        document.head.appendChild(script)
        await new Promise(resolve => {
          script.onload = () => resolve(undefined)
        })
      }

      // TossPay 결제 요청
      const clientKey = 'test_ck_docs_Ovk5rk1EwkEbP0W43n07xlzm' // 실제 환경에서는 env에서 가져오기
      const tossPayments = window.TossPayments?.(clientKey)

      await tossPayments?.requestPayment('카드', {
        amount: order.totalPrice,
        orderId: order.id,
        orderName: order.serviceName,
        customerName: '고객',
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      })
    } catch (error) {
      console.error('TossPay error:', error)
      alert('토스페이 결제 중 오류가 발생했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePayment = () => {
    if (selectedMethod === 'KAKAOPAY') {
      handleKakaoPay()
    } else if (selectedMethod === 'TOSSPAY') {
      handleTossPay()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          {/* Header - Toss Style */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">간편한 결제</h2>
              <p className="text-sm text-gray-500 mt-1">안전하고 빠른 결제 서비스</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl w-10 h-10 rounded-2xl hover:bg-gray-100 flex items-center justify-center transition-all"
            >
              ×
            </button>
          </div>

          {/* Order Summary - Toss Card Style */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 mb-6 md:mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-2xl flex items-center justify-center mr-3">
                <span className="text-white text-sm">📋</span>
              </div>
              <h3 className="font-semibold text-gray-900">주문 요약</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">서비스</span>
                <span className="text-gray-900 font-medium text-right max-w-48 truncate">{order.serviceName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">수량</span>
                <span className="text-gray-900 font-medium">{order.quantity.toLocaleString()}개</span>
              </div>
              <div className="border-t border-blue-200 pt-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">결제할 금액</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-blue-600">{order.totalPrice.toLocaleString()}</span>
                    <span className="text-blue-600 ml-1">원</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods - Toss Style */}
          <div className="mb-6 md:mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">결제 수단 선택</h3>
            <div className="space-y-3">
              {/* KakaoPay */}
              <div
                onClick={() => setSelectedMethod('KAKAOPAY')}
                className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                  selectedMethod === 'KAKAOPAY'
                    ? 'border-yellow-400 bg-yellow-50 shadow-lg shadow-yellow-100'
                    : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'
                }`}
              >
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center mr-4 shadow-md">
                    <span className="text-black font-bold text-base">Pay</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">카카오페이</h4>
                    <p className="text-sm text-gray-600">2억 명이 선택한 간편결제</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg">즉시결제</span>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 transition-all ${
                    selectedMethod === 'KAKAOPAY'
                      ? 'border-yellow-400 bg-yellow-400 shadow-md'
                      : 'border-gray-300'
                  }`}>
                    {selectedMethod === 'KAKAOPAY' && (
                      <div className="w-full h-full rounded-full bg-white scale-50" />
                    )}
                  </div>
                </div>
              </div>

              {/* TossPay */}
              <div
                onClick={() => setSelectedMethod('TOSSPAY')}
                className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                  selectedMethod === 'TOSSPAY'
                    ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mr-4 shadow-md">
                    <span className="text-white font-bold text-base">toss</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">토스페이</h4>
                    <p className="text-sm text-gray-600">금융의 모든 것, 토스에서</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">안전보장</span>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 transition-all ${
                    selectedMethod === 'TOSSPAY'
                      ? 'border-blue-500 bg-blue-500 shadow-md'
                      : 'border-gray-300'
                  }`}>
                    {selectedMethod === 'TOSSPAY' && (
                      <div className="w-full h-full rounded-full bg-white scale-50" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Button - Toss Style */}
          <button
            onClick={handlePayment}
            disabled={!selectedMethod || isProcessing}
            className={`w-full py-4 md:py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
              !selectedMethod || isProcessing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : selectedMethod === 'KAKAOPAY'
                ? 'bg-yellow-400 hover:bg-yellow-500 text-black shadow-lg hover:shadow-xl hover:scale-[1.02]'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                결제 처리 중...
              </div>
            ) : selectedMethod ? (
              <div className="flex items-center justify-center">
                <span className="mr-2">
                  {selectedMethod === 'KAKAOPAY' ? '💰' : '💳'}
                </span>
                {order.totalPrice.toLocaleString()}원 결제하기
              </div>
            ) : (
              '결제 수단을 선택해주세요'
            )}
          </button>

          {/* Security Notice - Enhanced */}
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl">
            <div className="flex items-center justify-center text-green-700">
              <div className="w-6 h-6 mr-3 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🔒</span>
              </div>
              <div className="text-center">
                <div className="font-medium text-green-800">안전한 결제 보장</div>
                <div className="text-sm text-green-600">256비트 SSL 암호화로 보호됩니다</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
