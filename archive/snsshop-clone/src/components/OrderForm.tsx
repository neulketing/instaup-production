import { useState, useEffect } from 'react'
import TopUpModal from './TopUpModal'
import apiService from '../services/api'

interface Service {
  id: string
  name: string
  platform: string
  price: number
  minQuantity: number
  maxQuantity: number
  description: string
}

// Services will be loaded from API

interface OrderFormProps {
  onClose: () => void
  userBalance?: number
  onBalanceUpdate?: () => void
  preselectedService?: {
    id: string
    name: string
    platform: string
    price: number
    minQuantity: number
    maxQuantity: number
    description: string
  } | null
}

export default function OrderForm({ onClose, userBalance = 0, onBalanceUpdate, preselectedService }: OrderFormProps) {
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [quantity, setQuantity] = useState(100)
  const [targetUrl, setTargetUrl] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [requiredAmount, setRequiredAmount] = useState(0)
  const [servicesLoading, setServicesLoading] = useState(true)
  const [servicesError, setServicesError] = useState('')

  // Load services from API
  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await apiService.getServices()
        if (response.success) {
          setServices(response.data)
        }
      } catch (error) {
        console.error('Failed to load services:', error)
        // Fallback to demo services if API fails
        setServices([
          {
            id: 'ig_followers',
            name: '인스타그램 팔로워 (데모)',
            platform: 'Instagram',
            price: 100,
            minQuantity: 100,
            maxQuantity: 10000,
            description: '실제 한국인 계정에서 팔로우합니다 (데모 모드)'
          },
          {
            id: 'ig_likes',
            name: '인스타그램 좋아요 (데모)',
            platform: 'Instagram',
            price: 50,
            minQuantity: 50,
            maxQuantity: 5000,
            description: '게시물에 자연스러운 좋아요를 추가합니다 (데모 모드)'
          }
        ])
        setServicesError('서버 연결 실패 - 데모 모드로 실행 중입니다.')
      } finally {
        setServicesLoading(false)
      }
    }

    loadServices()
  }, [])

  // Preselect service if provided
  useEffect(() => {
    if (preselectedService) {
      setSelectedService(preselectedService as Service)
      setQuantity(preselectedService.minQuantity)
      setCurrentStep(2) // Skip to step 2 (quantity selection)
    }
  }, [preselectedService])

  const totalPrice = selectedService ? (quantity / selectedService.minQuantity) * selectedService.price : 0

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!selectedService || !targetUrl.trim()) {
      alert('모든 필드를 입력해주세요.')
      return
    }

    const token = localStorage.getItem('auth_token')
    if (!token) {
      alert('로그인이 필요합니다.')
      return
    }

    setIsLoading(true)

    try {
      const data = await apiService.createOrder(selectedService.id, quantity, targetUrl)

      if (data.success) {
        if (data.hasEnoughBalance) {
          alert('주문이 성공적으로 접수되었습니다!')
          onBalanceUpdate?.()
          onClose()
        } else {
          // 잔액 부족 - 충전 모달 표시
          setRequiredAmount(data.finalPrice)
          setShowTopUpModal(true)
        }
      } else {
        alert(`주문 실패: ${data.error}`)
      }
    } catch (error) {
      console.error('Order error:', error)
      // Demo mode fallback
      if (servicesError.includes('데모 모드')) {
        alert(`데모 주문이 접수되었습니다!\n서비스: ${selectedService.name}\n수량: ${quantity}\n예상 금액: ${totalPrice.toLocaleString()}원\n\n실제 서비스는 서버 연결 후 이용 가능합니다.`)
        onClose()
      } else {
        alert('주문 중 오류가 발생했습니다.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleTopUpSuccess = () => {
    // 충전 성공 후 대시보드 업데이트
    onBalanceUpdate?.()
    // 잠시 후 주문 다시 시도 (충전 시 미결 주문이 자동 처리됨)
    setTimeout(() => {
      alert('충전이 완료되어 주문이 처리되었습니다!')
      onClose()
    }, 1000)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">주문하기</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-3xl w-12 h-12 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-colors ${
                      step <= currentStep
                        ? 'bg-[#22426f] text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-16 h-1 mx-4 transition-colors ${
                        step < currentStep ? 'bg-[#22426f]' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            {currentStep === 1 && (
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-center">서비스를 선택하세요</h3>
                {servicesLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22426f]"></div>
                  </div>
                ) : servicesError ? (
                  <div className="text-center py-12">
                    <div className="text-red-500 mb-4">{servicesError}</div>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-[#22426f] text-white rounded-xl"
                    >
                      다시 시도
                    </button>
                  </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 ${
                        selectedService?.id === service.id
                          ? 'border-[#22426f] bg-[#22426f]/5'
                          : 'border-gray-200 hover:border-[#22426f]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-semibold">{service.name}</h4>
                        <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                          {service.platform}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[#22426f]">
                          {service.price.toLocaleString()}원
                        </span>
                        <span className="text-sm text-gray-500">
                          최소 {service.minQuantity}개
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>
            )}

            {currentStep === 2 && selectedService && (
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-center">수량과 링크를 입력하세요</h3>
                <div className="max-w-2xl mx-auto space-y-6">
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">
                      {selectedService.platform} 링크
                    </label>
                    <input
                      type="url"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#22426f] focus:border-transparent text-lg"
                      placeholder={
                        selectedService.platform === 'Instagram'
                          ? 'https://instagram.com/username'
                          : 'https://youtube.com/watch?v=...'
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">
                      수량: {quantity.toLocaleString()}개
                    </label>
                    <input
                      type="range"
                      min={selectedService.minQuantity}
                      max={selectedService.maxQuantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>{selectedService.minQuantity.toLocaleString()}</span>
                      <span>{selectedService.maxQuantity.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex justify-between items-center text-lg">
                      <span>총 금액:</span>
                      <span className="text-2xl font-bold text-[#22426f]">
                        {totalPrice.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && selectedService && (
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-center">주문 확인</h3>
                <div className="max-w-2xl mx-auto">
                  <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium">서비스:</span>
                      <span>{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">플랫폼:</span>
                      <span>{selectedService.platform}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">수량:</span>
                      <span>{quantity.toLocaleString()}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">링크:</span>
                      <span className="text-blue-600 break-all">{targetUrl}</span>
                    </div>
                    <hr className="my-4" />
                    <div className="flex justify-between text-xl font-bold">
                      <span>총 금액:</span>
                      <span className="text-[#22426f]">{totalPrice.toLocaleString()}원</span>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-blue-50 rounded-2xl">
                    <h4 className="font-semibold mb-2">주문 안내사항</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 주문 후 30분 이내에 작업이 시작됩니다</li>
                      <li>• 작업 완료까지 24-72시간 소요됩니다</li>
                      <li>• 100% 실제 한국인 계정으로 진행됩니다</li>
                      <li>• 작업 시작 전까지 전액 환불 가능합니다</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-2xl font-medium hover:bg-gray-300 transition-colors"
                >
                  이전
                </button>
              )}

              <div className="ml-auto">
                {currentStep < 3 ? (
                  <button
                    onClick={handleNext}
                    disabled={currentStep === 1 && !selectedService}
                    className="px-8 py-3 bg-[#22426f] text-white rounded-2xl font-medium hover:bg-[#1a334f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    다음
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!targetUrl.trim() || isLoading}
                    className="px-8 py-3 bg-green-600 text-white rounded-2xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? '주문 중...' : '주문하기'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background: #22426f;
            cursor: pointer;
            box-shadow: 0 0 2px 0 #555;
          }
          .slider::-moz-range-thumb {
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background: #22426f;
            cursor: pointer;
            border: none;
          }
        `}</style>
      </div>

      {/* TopUp Modal */}
      <TopUpModal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        onSuccess={handleTopUpSuccess}
        currentBalance={userBalance}
        requiredAmount={requiredAmount}
      />
    </>
  )
}
