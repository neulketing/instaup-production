import { useState, useEffect } from 'react'
import { useAdmin, type ServiceConfig } from '../contexts/AdminContext'
import { useAuth } from '../hooks/useAuth'

interface PlatformOrderFormProps {
  onClose: () => void
  selectedPlatform: string
  onLoginRequired?: () => void
}

const platformInfo = {
  '인스타그램': {
    name: 'Instagram',
    icon: 'https://ext.same-assets.com/3036106235/3453187750.svg',
    color: 'bg-gradient-to-r from-purple-600 to-pink-600',
    description: '세계 최대 사진 공유 SNS',
    urlPlaceholder: 'https://instagram.com/username',
    urlExample: '계정 URL 또는 게시물 URL을 입력하세요'
  },
  '유튜브': {
    name: 'YouTube',
    icon: 'https://ext.same-assets.com/3036106235/918703132.svg',
    color: 'bg-red-600',
    description: '세계 최대 동영상 플랫폼',
    urlPlaceholder: 'https://youtube.com/watch?v=...',
    urlExample: '동영상 URL 또는 채널 URL을 입력하세요'
  },
  '틱톡': {
    name: 'TikTok',
    icon: 'https://ext.same-assets.com/3036106235/3392181185.svg',
    color: 'bg-black',
    description: '숏폼 동영상 플랫폼',
    urlPlaceholder: 'https://tiktok.com/@username',
    urlExample: '프로필 URL 또는 동영상 URL을 입력하세요'
  },
  '페이스북': {
    name: 'Facebook',
    icon: 'https://ext.same-assets.com/3036106235/1032565564.svg',
    color: 'bg-blue-600',
    description: '소셜 네트워킹 서비스',
    urlPlaceholder: 'https://facebook.com/page',
    urlExample: '페이지 URL 또는 게시물 URL을 입력하세요'
  },
  'X (트위터)': {
    name: 'X',
    icon: 'https://ext.same-assets.com/3036106235/578974085.svg',
    color: 'bg-gray-900',
    description: '실시간 소셜 미디어',
    urlPlaceholder: 'https://x.com/username',
    urlExample: '프로필 URL 또는 포스트 URL을 입력하세요'
  },
  '스레드': {
    name: 'Threads',
    icon: 'https://ext.same-assets.com/3036106235/1028841693.svg',
    color: 'bg-gray-800',
    description: '메타의 텍스트 기반 SNS',
    urlPlaceholder: 'https://threads.net/@username',
    urlExample: '프로필 URL 또는 스레드 URL을 입력하세요'
  },
  '네이버': {
    name: 'Naver',
    icon: 'https://ext.same-assets.com/3036106235/3806946608.svg',
    color: 'bg-green-500',
    description: '한국 대표 포털 사이트',
    urlPlaceholder: 'https://blog.naver.com/...',
    urlExample: '블로그 URL 또는 카페 URL을 입력하세요'
  },
  '카카오': {
    name: 'Kakao',
    icon: 'https://ext.same-assets.com/3036106235/4075293063.svg',
    color: 'bg-yellow-400',
    description: '카카오 플랫폼 서비스',
    urlPlaceholder: 'https://story.kakao.com/...',
    urlExample: '스토리 URL 또는 채널 URL을 입력하세요'
  }
}

export default function PlatformOrderForm({ onClose, selectedPlatform, onLoginRequired }: PlatformOrderFormProps) {
  const { serviceConfigs } = useAdmin()
  const { user } = useAuth()
  const [selectedService, setSelectedService] = useState<ServiceConfig | null>(null)
  const [quantity, setQuantity] = useState(100)
  const [targetUrl, setTargetUrl] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const platform = platformInfo[selectedPlatform as keyof typeof platformInfo]

  // Filter services for the selected platform
  const platformServices = serviceConfigs.filter(
    service => service.platform === platform?.name && service.isActive
  )

  useEffect(() => {
    if (platformServices.length > 0 && !selectedService) {
      setSelectedService(platformServices[0])
      setQuantity(platformServices[0].minQuantity)
    }
  }, [platformServices, selectedService])

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

  const totalPrice = selectedService ?
    Math.ceil((quantity / selectedService.minQuantity) * getActualPrice(selectedService, quantity)) : 0

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

  const handleSubmit = () => {
    alert(`${selectedPlatform} 주문이 접수되었습니다!\n서비스: ${selectedService?.name}\n수량: ${quantity.toLocaleString()}\n총액: ${totalPrice.toLocaleString()}원`)
    onClose()
  }

  if (!platform) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-8">
          {/* Platform Header - Mobile Optimized */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center ${platform.color}`}>
                <img src={platform.icon} alt={platform.name} className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{selectedPlatform} 주문하기</h2>
                <p className="text-sm md:text-base text-gray-600 hidden sm:block">{platform.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl w-10 h-10 md:w-12 md:h-12 rounded-2xl hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>

          {/* Progress Steps - Mobile Optimized */}
          <div className="flex items-center justify-center mb-6 md:mb-8">
            {[
              { num: 1, label: '서비스' },
              { num: 2, label: '정보입력' },
              { num: 3, label: '확인' }
            ].map((step, index) => (
              <div key={step.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center font-medium transition-all duration-300 ${
                      step.num <= currentStep
                        ? 'bg-blue-600 text-white shadow-lg scale-110'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step.num <= currentStep && currentStep > step.num ? '✓' : step.num}
                  </div>
                  <span className={`text-xs mt-1 hidden sm:block transition-colors ${
                    step.num <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < 2 && (
                  <div
                    className={`w-8 md:w-16 h-1 mx-2 md:mx-4 transition-all duration-300 ${
                      step.num < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-xl font-semibold mb-6 text-center">{selectedPlatform} 서비스를 선택하세요</h3>

              {platformServices.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🚧</div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {selectedPlatform} 서비스 준비 중
                  </h4>
                  <p className="text-gray-600">
                    곧 더 많은 서비스를 제공할 예정입니다
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {platformServices.map((service) => {
                    const actualPrice = getActualPrice(service, service.minQuantity)
                    const hasDiscount = service.discountRate > 0 ||
                      (service.bulkDiscounts && service.bulkDiscounts.length > 0)

                    return (
                      <div
                        key={service.id}
                        onClick={() => {
                          setSelectedService(service)
                          setQuantity(service.minQuantity)
                        }}
                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                          selectedService?.id === service.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-200'
                        }`}
                      >
                        {/* Service badges */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex space-x-2">
                            {service.isPopular && (
                              <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                                인기
                              </span>
                            )}
                            {service.isNew && (
                              <span className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                                NEW
                              </span>
                            )}
                            {hasDiscount && (
                              <span className="bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                                할인
                              </span>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            service.qualityLevel === 'ultimate' ? 'bg-purple-100 text-purple-700' :
                            service.qualityLevel === 'premium' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {service.qualityLevel.toUpperCase()}
                          </span>
                        </div>

                        <h4 className="text-lg font-semibold mb-2">{service.name}</h4>
                        <p className="text-gray-600 text-sm mb-4">{service.description}</p>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">가격</span>
                            <div className="text-right">
                              {service.discountRate > 0 ? (
                                <div>
                                  <span className="text-lg font-bold text-blue-600">
                                    {actualPrice.toLocaleString()}원
                                  </span>
                                  <span className="text-sm text-gray-400 line-through ml-2">
                                    {service.price.toLocaleString()}원
                                  </span>
                                </div>
                              ) : (
                                <span className="text-lg font-bold text-blue-600">
                                  {actualPrice.toLocaleString()}원
                                </span>
                              )}
                              <div className="text-xs text-gray-500">
                                {service.minQuantity.toLocaleString()}개 기준
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">처리시간</span>
                            <span className="text-blue-600 font-medium">{service.estimatedTime}</span>
                          </div>

                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">수량 범위</span>
                            <span className="text-gray-700">
                              {service.minQuantity.toLocaleString()} ~ {service.maxQuantity.toLocaleString()}개
                            </span>
                          </div>
                        </div>

                        {/* Bulk discounts preview */}
                        {service.bulkDiscounts && service.bulkDiscounts.length > 0 && (
                          <div className="mt-4 p-3 bg-green-50 rounded-xl">
                            <div className="text-xs font-medium text-green-800 mb-2">💰 대량 할인</div>
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
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && selectedService && (
            <div>
              <h3 className="text-xl font-semibold mb-6 text-center">주문 정보를 입력하세요</h3>
              <div className="max-w-2xl mx-auto space-y-6">
                {/* URL Input */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    {selectedPlatform} 링크
                  </label>
                  <input
                    type="url"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    placeholder={platform.urlPlaceholder}
                  />
                  <p className="text-sm text-gray-500 mt-2">{platform.urlExample}</p>
                </div>

                {/* Quantity Input */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-lg font-medium text-gray-700">
                      수량: {quantity.toLocaleString()}개
                    </label>
                  </div>

                  <input
                    type="range"
                    min={selectedService.minQuantity}
                    max={selectedService.maxQuantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right,
                        rgb(37, 99, 235) 0%,
                        rgb(37, 99, 235) ${((quantity - selectedService.minQuantity) / (selectedService.maxQuantity - selectedService.minQuantity)) * 100}%,
                        rgb(229, 231, 235) ${((quantity - selectedService.minQuantity) / (selectedService.maxQuantity - selectedService.minQuantity)) * 100}%,
                        rgb(229, 231, 235) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>{selectedService.minQuantity.toLocaleString()}</span>
                    <span>{selectedService.maxQuantity.toLocaleString()}</span>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium">총 금액:</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-blue-600">
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
              <h3 className="text-xl font-semibold mb-6 text-center">주문 확인</h3>
              <div className="max-w-2xl mx-auto">
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">플랫폼:</span>
                    <span>{selectedPlatform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">서비스:</span>
                    <span>{selectedService.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">수량:</span>
                    <span>{quantity.toLocaleString()}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">링크:</span>
                    <span className="text-blue-600 break-all text-sm max-w-xs">{targetUrl}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-xl font-bold">
                    <span>총 금액:</span>
                    <span className="text-blue-600">{totalPrice.toLocaleString()}원</span>
                  </div>
                </div>

                <div className="mt-6 p-6 bg-blue-50 rounded-2xl">
                  <h4 className="font-semibold mb-3 text-blue-900">{selectedPlatform} 주문 안내</h4>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li>• 주문 후 30분 이내에 작업이 시작됩니다</li>
                    <li>• {selectedService.estimatedTime} 내에 완료됩니다</li>
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
                    (currentStep === 2 && (!targetUrl.trim() || quantity < (selectedService?.minQuantity || 0)))
                  }
                  className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!targetUrl.trim()}
                  className="px-8 py-3 bg-green-600 text-white rounded-2xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  주문하기
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
