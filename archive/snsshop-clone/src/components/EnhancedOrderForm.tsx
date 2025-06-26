import { useState } from 'react'
import { useAdmin, type ServiceConfig } from '../contexts/AdminContext'
import { useAuth } from '../hooks/useAuth'
import { useOrders } from '../contexts/OrderContext'

interface EnhancedOrderFormProps {
  onClose: () => void
  onLoginRequired?: () => void
  onInsufficientFunds?: () => void
}

export default function EnhancedOrderForm({ onClose, onLoginRequired, onInsufficientFunds }: EnhancedOrderFormProps) {
  const { serviceConfigs } = useAdmin()
  const { user } = useAuth()
  const { createOrder } = useOrders()

  // 로그인 체크 - 로그인하지 않으면 주문 불가
  if (!user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl w-full max-w-md p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h2>
          <p className="text-gray-600 mb-6">주문하려면 먼저 로그인해주세요.</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
            >
              닫기
            </button>
            <button
              onClick={() => {
                onClose()
                onLoginRequired?.()
              }}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    )
  }
  const [selectedService, setSelectedService] = useState<ServiceConfig | null>(null)
  const [quantity, setQuantity] = useState(100)
  const [directQuantity, setDirectQuantity] = useState('')
  const [targetUrl, setTargetUrl] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [useDirectInput, setUseDirectInput] = useState(false)
  const [pointsToUse, setPointsToUse] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  // Filter only active services
  const activeServices = serviceConfigs.filter(service => service.isActive)

  const getActualPrice = (service: ServiceConfig, quantity: number) => {
    let basePrice = service.price

    // Apply base discount
    if (service.discountRate > 0) {
      basePrice = Math.floor(basePrice * (1 - service.discountRate / 100))
    }

    // Apply bulk discount if applicable
    if (service.bulkDiscounts && service.bulkDiscounts.length > 0) {
      const applicableDiscount = service.bulkDiscounts
        .filter(discount => quantity >= discount.minQuantity)
        .sort((a, b) => b.discountPercent - a.discountPercent)[0]

      if (applicableDiscount) {
        basePrice = Math.floor(basePrice * (1 - applicableDiscount.discountPercent / 100))
      }
    }

    return basePrice
  }

  const getCurrentQuantity = () => {
    if (useDirectInput && directQuantity) {
      return Number.parseInt(directQuantity) || 0
    }
    return quantity
  }

  const originalPrice = selectedService ?
    Math.ceil((getCurrentQuantity() / selectedService.minQuantity) * selectedService.price) : 0

  const discountAmount = selectedService ? originalPrice - Math.ceil((getCurrentQuantity() / selectedService.minQuantity) * getActualPrice(selectedService, getCurrentQuantity())) : 0

  const totalPrice = originalPrice - discountAmount
  const finalPrice = Math.max(0, totalPrice - pointsToUse)

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
    if (!selectedService || !user) return

    setIsProcessing(true)

    try {
      await createOrder({
        platform: selectedService.platform,
        service: selectedService.name,
        quantity: getCurrentQuantity(),
        originalPrice,
        discountAmount,
        finalPrice,
        pointsUsed: pointsToUse,
        targetUrl,
        status: 'pending'
      })

      alert(`주문이 성공적으로 접수되었습니다!\n\n서비스: ${selectedService.name}\n수량: ${getCurrentQuantity().toLocaleString()}개\n총액: ${finalPrice.toLocaleString()}원\n\n주문 처리가 자동으로 시작됩니다.`)
      onClose()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류'

      if (errorMessage.includes('잔액이 부족합니다')) {
        // 잔액 부족 시 충전 모달 표시
        onInsufficientFunds?.()
        onClose()
      } else {
        alert(`주문 처리 중 오류가 발생했습니다: ${errorMessage}`)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleQuantityChange = (value: number) => {
    if (!selectedService) return

    const clampedValue = Math.max(
      selectedService.minQuantity,
      Math.min(selectedService.maxQuantity, value)
    )
    setQuantity(clampedValue)

    if (useDirectInput) {
      setDirectQuantity(clampedValue.toString())
    }
  }

  const handleDirectInputChange = (value: string) => {
    setDirectQuantity(value)
    const numValue = Number.parseInt(value) || 0
    if (numValue > 0) {
      setQuantity(Math.max(selectedService?.minQuantity || 0, Math.min(selectedService?.maxQuantity || 0, numValue)))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
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
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-4 transition-colors ${
                      step < currentStep ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-200'
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeServices.map((service) => {
                  const currentQuantity = getCurrentQuantity()
                  const actualPrice = getActualPrice(service, service.minQuantity)
                  const hasDiscount = service.discountRate > 0
                  const hasBulkDiscount = service.bulkDiscounts && service.bulkDiscounts.length > 0

                  return (
                    <div
                      key={service.id}
                      onClick={() => {
                        setSelectedService(service)
                        setQuantity(service.minQuantity)
                        setDirectQuantity(service.minQuantity.toString())
                      }}
                      className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all hover:scale-105 ${
                        selectedService?.id === service.id
                          ? 'border-purple-500 bg-purple-50 shadow-lg'
                          : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                      }`}
                    >
                      {/* Badges */}
                      <div className="absolute top-4 right-4 flex flex-col space-y-1">
                        {service.isPopular && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            인기
                          </span>
                        )}
                        {service.isNew && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            NEW
                          </span>
                        )}
                        {hasDiscount && (
                          <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            -{service.discountRate}%
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-semibold">{service.name}</h4>
                        <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                          {service.platform}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4">{service.description}</p>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            {hasDiscount ? (
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-bold text-purple-600">
                                  {actualPrice.toLocaleString()}원
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                  {service.price.toLocaleString()}원
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-purple-600">
                                {actualPrice.toLocaleString()}원
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              {service.minQuantity.toLocaleString()}개 기준
                            </span>
                            <span className="text-xs text-blue-600 font-medium">
                              {service.estimatedTime} 처리
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-gray-500">
                              {service.minQuantity.toLocaleString()} ~ {service.maxQuantity.toLocaleString()}개
                            </span>
                            <div className={`text-xs font-medium px-2 py-1 rounded mt-1 ${
                              service.qualityLevel === 'ultimate' ? 'bg-purple-100 text-purple-700' :
                              service.qualityLevel === 'premium' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {service.qualityLevel.toUpperCase()}
                            </div>
                          </div>
                        </div>

                        {hasBulkDiscount && (
                          <div className="bg-green-50 rounded-xl p-3">
                            <div className="text-xs font-semibold text-green-800 mb-1">💰 대량 할인</div>
                            <div className="flex flex-wrap gap-1">
                              {service.bulkDiscounts.slice(0, 3).map((discount, idx) => (
                                <span key={`${discount.minQuantity}-${discount.discountPercent}`} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                  {discount.minQuantity.toLocaleString()}+ → {discount.discountPercent}%
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {currentStep === 2 && selectedService && (
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-center">수량과 링크를 입력하세요</h3>
              <div className="max-w-3xl mx-auto space-y-8">
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    {selectedService.platform} 링크
                  </label>
                  <input
                    type="url"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                    placeholder={
                      selectedService.platform === 'Instagram'
                        ? 'https://instagram.com/username'
                        : selectedService.platform === 'YouTube'
                        ? 'https://youtube.com/watch?v=...'
                        : 'SNS 링크를 입력하세요'
                    }
                  />
                </div>

                {/* Enhanced Quantity Input */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-lg font-medium text-gray-700">
                      수량: {getCurrentQuantity().toLocaleString()}개
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={!useDirectInput}
                          onChange={() => setUseDirectInput(false)}
                          className="mr-2"
                        />
                        <span className="text-sm">슬라이더</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={useDirectInput}
                          onChange={() => setUseDirectInput(true)}
                          className="mr-2"
                        />
                        <span className="text-sm">직접입력</span>
                      </label>
                    </div>
                  </div>

                  {!useDirectInput ? (
                    /* Slider Input */
                    <div>
                      <input
                        type="range"
                        min={selectedService.minQuantity}
                        max={selectedService.maxQuantity}
                        value={quantity}
                        onChange={(e) => handleQuantityChange(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right,
                            rgb(147, 51, 234) 0%,
                            rgb(147, 51, 234) ${((quantity - selectedService.minQuantity) / (selectedService.maxQuantity - selectedService.minQuantity)) * 100}%,
                            rgb(229, 231, 235) ${((quantity - selectedService.minQuantity) / (selectedService.maxQuantity - selectedService.minQuantity)) * 100}%,
                            rgb(229, 231, 235) 100%)`
                        }}
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>{selectedService.minQuantity.toLocaleString()}</span>
                        <span>{selectedService.maxQuantity.toLocaleString()}</span>
                      </div>
                    </div>
                  ) : (
                    /* Direct Input */
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <input
                          type="number"
                          value={directQuantity}
                          onChange={(e) => handleDirectInputChange(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg text-center"
                          placeholder="수량을 입력하세요"
                          min={selectedService.minQuantity}
                          max={selectedService.maxQuantity}
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleDirectInputChange(String(getCurrentQuantity() + selectedService.minQuantity))}
                          className="bg-purple-100 text-purple-600 px-3 py-1 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                        >
                          +{selectedService.minQuantity.toLocaleString()}
                        </button>
                        <button
                          onClick={() => handleDirectInputChange(String(Math.max(selectedService.minQuantity, getCurrentQuantity() - selectedService.minQuantity)))}
                          className="bg-purple-100 text-purple-600 px-3 py-1 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                        >
                          -{selectedService.minQuantity.toLocaleString()}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 text-sm text-gray-500 bg-gray-50 rounded-2xl p-4">
                    <div className="flex justify-between">
                      <span>최소 수량:</span>
                      <span>{selectedService.minQuantity.toLocaleString()}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span>최대 수량:</span>
                      <span>{selectedService.maxQuantity.toLocaleString()}개</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-6 border border-purple-200">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium">총 금액:</span>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-purple-600">
                        {totalPrice.toLocaleString()}원
                      </span>
                      {selectedService.discountRate > 0 && (
                        <div className="text-sm text-green-600">
                          {selectedService.discountRate}% 할인 적용됨
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && selectedService && (
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-center">주문 확인</h3>
              <div className="max-w-2xl mx-auto">
                <div className="bg-gray-50 rounded-3xl p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">서비스:</span>
                    <span className="font-semibold">{selectedService.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">플랫폼:</span>
                    <span>{selectedService.platform}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">수량:</span>
                    <span className="font-semibold">{getCurrentQuantity().toLocaleString()}개</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">링크:</span>
                    <span className="text-blue-600 break-all text-sm max-w-xs">{targetUrl}</span>
                  </div>
                  {selectedService.discountRate > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                      <span className="font-medium">기본 할인:</span>
                      <span className="font-semibold">{selectedService.discountRate}% 할인</span>
                    </div>
                  )}
                  {selectedService.bulkDiscounts && selectedService.bulkDiscounts.length > 0 && (() => {
                    const currentQuantity = getCurrentQuantity()
                    const applicableDiscount = selectedService.bulkDiscounts
                      .filter(discount => currentQuantity >= discount.minQuantity)
                      .sort((a, b) => b.discountPercent - a.discountPercent)[0]

                    if (applicableDiscount) {
                      return (
                        <div className="flex justify-between items-center text-blue-600">
                          <span className="font-medium">대량 할인:</span>
                          <span className="font-semibold">추가 {applicableDiscount.discountPercent}% 할인</span>
                        </div>
                      )
                    }
                    return null
                  })()}
                  <hr className="my-4" />

                  {/* 포인트 사용 섹션 */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">원가:</span>
                      <span>{originalPrice.toLocaleString()}원</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between items-center text-green-600">
                        <span className="font-medium">할인:</span>
                        <span>-{discountAmount.toLocaleString()}원</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">소계:</span>
                      <span>{totalPrice.toLocaleString()}원</span>
                    </div>

                    {user && user.balance > 0 && (
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-blue-900">포인트 사용:</span>
                          <span className="text-sm text-blue-600">보유: {user.balance.toLocaleString()}원</span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={pointsToUse}
                            onChange={(e) => {
                              const value = Math.max(0, Math.min(user.balance, Math.min(totalPrice, Number.parseInt(e.target.value) || 0)))
                              setPointsToUse(value)
                            }}
                            placeholder="0"
                            className="flex-1 p-2 border border-blue-200 rounded-lg text-sm"
                          />
                          <button
                            onClick={() => setPointsToUse(Math.min(user.balance, totalPrice))}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                          >
                            전액
                          </button>
                        </div>
                        {pointsToUse > 0 && (
                          <div className="flex justify-between items-center mt-2 text-blue-600">
                            <span className="text-sm">포인트 사용:</span>
                            <span className="text-sm font-medium">-{pointsToUse.toLocaleString()}원</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <hr className="my-4" />
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>최종 결제 금액:</span>
                    <span className="text-purple-600">{finalPrice.toLocaleString()}원</span>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-blue-50 rounded-3xl">
                  <h4 className="font-semibold mb-3 text-blue-900">주문 안내사항</h4>
                  <ul className="text-sm text-blue-700 space-y-2">
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
                  disabled={
                    (currentStep === 1 && !selectedService) ||
                    (currentStep === 2 && (!targetUrl.trim() || getCurrentQuantity() < (selectedService?.minQuantity || 0)))
                  }
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-medium hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!targetUrl.trim() || isProcessing || (user?.balance || 0) < finalPrice}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-medium hover:from-green-700 hover:to-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? '처리 중...' :
                   (user?.balance || 0) < finalPrice ? '잔액 부족' :
                   '주문하기'}
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
          background: linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153));
          cursor: pointer;
          box-shadow: 0 0 8px rgba(147, 51, 234, 0.3);
          border: 2px solid white;
        }
        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153));
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 0 8px rgba(147, 51, 234, 0.3);
        }
      `}</style>
    </div>
  )
}
