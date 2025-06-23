import { useState, useEffect } from 'react'
import { useAdmin, type ServiceConfig } from '../contexts/AdminContext'

interface NaverServiceFormProps {
  onClose: () => void
}

// 네이버 서비스 카테고리 정의
const naverServiceCategories = [
  {
    id: 'place',
    name: '네이버 플레이스 마케팅',
    icon: '🏪',
    description: '지역 비즈니스 노출 증대',
    color: 'bg-green-500',
    services: ['naver-place-pageview', 'naver-map-view']
  },
  {
    id: 'blog',
    name: '네이버 블로그 활성화',
    icon: '📝',
    description: '블로그 방문자 및 SEO 향상',
    color: 'bg-blue-500',
    services: ['naver-blog-visit']
  },
  {
    id: 'shopping',
    name: '네이버 쇼핑 마케팅',
    icon: '🛒',
    description: '상품 노출 및 클릭 증대',
    color: 'bg-orange-500',
    services: ['naver-shopping-click']
  },
  {
    id: 'knowledge',
    name: '네이버 지식인 마케팅',
    icon: '🧠',
    description: '전문성 및 신뢰도 구축',
    color: 'bg-purple-500',
    services: ['naver-jisik-recommend']
  },
  {
    id: 'community',
    name: '네이버 커뮤니티',
    icon: '👥',
    description: '카페 및 커뮤니티 활성화',
    color: 'bg-indigo-500',
    services: ['naver-cafe-member']
  },
  {
    id: 'news',
    name: '네이버 뉴스 마케팅',
    icon: '📰',
    description: '이슈 확산 및 화제성 증대',
    color: 'bg-red-500',
    services: ['naver-news-view']
  }
]

export default function NaverServiceForm({ onClose }: NaverServiceFormProps) {
  const { serviceConfigs } = useAdmin()
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedService, setSelectedService] = useState<ServiceConfig | null>(null)
  const [quantity, setQuantity] = useState(100)
  const [targetUrl, setTargetUrl] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [additionalInfo, setAdditionalInfo] = useState('')

  // 네이버 서비스만 필터링
  const naverServices = serviceConfigs.filter(
    service => service.platform === 'Naver' && service.isActive
  )

  // 선택된 카테고리의 서비스들 필터링
  const categoryServices = selectedCategory
    ? naverServices.filter(service => {
        const category = naverServiceCategories.find(cat => cat.id === selectedCategory)
        return category?.services.includes(service.id)
      })
    : []

  useEffect(() => {
    if (categoryServices.length > 0 && !selectedService) {
      setSelectedService(categoryServices[0])
      setQuantity(categoryServices[0].minQuantity)
    }
  }, [categoryServices, selectedService])

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
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    const orderData = {
      service: selectedService?.name,
      platform: 'Naver',
      quantity,
      totalPrice,
      targetUrl,
      additionalInfo,
      category: selectedCategory
    }

    console.log('네이버 서비스 주문:', orderData)
    alert(`네이버 서비스 주문이 접수되었습니다!\n\n서비스: ${selectedService?.name}\n수량: ${quantity.toLocaleString()}\n총액: ${totalPrice.toLocaleString()}원`)
    onClose()
  }

  const getUrlPlaceholder = (serviceId: string) => {
    switch (serviceId) {
      case 'naver-place-pageview':
      case 'naver-map-view':
        return 'https://m.place.naver.com/place/1234567890'
      case 'naver-blog-visit':
        return 'https://blog.naver.com/username/postid'
      case 'naver-shopping-click':
        return 'https://shopping.naver.com/product/1234567890'
      case 'naver-jisik-recommend':
        return 'https://kin.naver.com/qna/detail.naver?d1id=1&dirId=10203&docId=123456789'
      case 'naver-cafe-member':
        return 'https://cafe.naver.com/cafename'
      case 'naver-news-view':
        return 'https://news.naver.com/main/read.naver?mode=LS2D&mid=shm&sid1=123'
      default:
        return 'https://naver.com/...'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-500 rounded-2xl flex items-center justify-center">
                <img
                  src="https://ext.same-assets.com/3036106235/1521804435.svg"
                  alt="Naver"
                  className="w-6 h-6 md:w-8 md:h-8"
                />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">네이버 서비스 주문하기</h2>
                <p className="text-sm md:text-base text-gray-600 hidden sm:block">
                  한국 대표 포털 사이트 마케팅
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl w-10 h-10 md:w-12 md:h-12 rounded-2xl hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-6 md:mb-8">
            {[
              { num: 1, label: '카테고리' },
              { num: 2, label: '서비스' },
              { num: 3, label: '정보입력' },
              { num: 4, label: '확인' }
            ].map((step, index) => (
              <div key={step.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center font-medium transition-all duration-300 ${
                      step.num <= currentStep
                        ? 'bg-green-600 text-white shadow-lg scale-110'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step.num <= currentStep && currentStep > step.num ? '✓' : step.num}
                  </div>
                  <span className={`text-xs mt-1 hidden sm:block transition-colors ${
                    step.num <= currentStep ? 'text-green-600 font-medium' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < 3 && (
                  <div
                    className={`w-8 md:w-16 h-1 mx-2 md:mx-4 transition-all duration-300 ${
                      step.num < currentStep ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-xl font-semibold mb-6 text-center">새 서비스를 선택해주세요</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {naverServiceCategories.map((category) => {
                  const availableServices = naverServices.filter(service =>
                    category.services.includes(service.id)
                  )

                  if (availableServices.length === 0) return null

                  return (
                    <div
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        selectedCategory === category.id
                          ? 'border-green-500 bg-green-50 shadow-lg'
                          : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                      }`}
                    >
                      {/* Category Header */}
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 ${category.color} rounded-2xl flex items-center justify-center text-white text-xl mr-4`}>
                          {category.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{category.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                        </div>
                      </div>

                      {/* Available Services */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          제공 서비스 ({availableServices.length}개)
                        </div>
                        {availableServices.slice(0, 3).map((service) => (
                          <div key={service.id} className="flex items-center text-sm text-gray-600">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                            <span className="flex-1">{service.name}</span>
                            <span className="text-green-600 font-medium">
                              {service.price.toLocaleString()}원
                            </span>
                          </div>
                        ))}
                        {availableServices.length > 3 && (
                          <div className="text-xs text-gray-400">
                            +{availableServices.length - 3}개 서비스 더보기
                          </div>
                        )}
                      </div>

                      {/* New/Popular Badge */}
                      <div className="mt-4 flex gap-2">
                        {availableServices.some(s => s.isNew) && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                            NEW
                          </span>
                        )}
                        {availableServices.some(s => s.isPopular) && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                            인기
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {currentStep === 2 && selectedCategory && (
            <div>
              <h3 className="text-xl font-semibold mb-6 text-center">
                {naverServiceCategories.find(cat => cat.id === selectedCategory)?.name} 서비스 선택
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryServices.map((service) => {
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
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-200'
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
                                <span className="text-lg font-bold text-green-600">
                                  {actualPrice.toLocaleString()}원
                                </span>
                                <span className="text-sm text-gray-400 line-through ml-2">
                                  {service.price.toLocaleString()}원
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-green-600">
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
                          <span className="text-green-600 font-medium">{service.estimatedTime}</span>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">수량 범위</span>
                          <span className="text-gray-700">
                            {service.minQuantity.toLocaleString()} ~ {service.maxQuantity.toLocaleString()}개
                          </span>
                        </div>
                      </div>

                      {/* Features */}
                      {service.features && service.features.length > 0 && (
                        <div className="mt-4 p-3 bg-green-50 rounded-xl">
                          <div className="text-xs font-medium text-green-800 mb-2">✨ 주요 특징</div>
                          <div className="space-y-1">
                            {service.features.slice(0, 3).map((feature) => (
                              <div key={feature} className="text-xs text-green-700 flex items-center">
                                <span className="w-1 h-1 bg-green-500 rounded-full mr-2" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {currentStep === 3 && selectedService && (
            <div>
              <h3 className="text-xl font-semibold mb-6 text-center">구매하실 상품에 대한 설명입니다</h3>
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Service Info Display */}
                <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-3">선택된 서비스</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-green-700">서비스명</span>
                      <span className="font-medium text-green-900">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">카테고리</span>
                      <span className="font-medium text-green-900">{selectedService.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">예상 처리시간</span>
                      <span className="font-medium text-green-900">{selectedService.estimatedTime}</span>
                    </div>
                  </div>
                </div>

                {/* URL Input */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    해당 상품에 대한 설명입니다 *주문 후 취소나 변경이 불가능합니다*
                  </label>
                  <input
                    type="url"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                    placeholder={getUrlPlaceholder(selectedService.id)}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    정확한 {selectedService.category} URL을 입력해주세요
                  </p>
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
                        rgb(34, 197, 94) 0%,
                        rgb(34, 197, 94) ${((quantity - selectedService.minQuantity) / (selectedService.maxQuantity - selectedService.minQuantity)) * 100}%,
                        rgb(229, 231, 235) ${((quantity - selectedService.minQuantity) / (selectedService.maxQuantity - selectedService.minQuantity)) * 100}%,
                        rgb(229, 231, 235) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>{selectedService.minQuantity.toLocaleString()}</span>
                    <span>{selectedService.maxQuantity.toLocaleString()}</span>
                  </div>
                </div>

                {/* Additional Info */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    추가 요청사항 (선택사항)
                  </label>
                  <textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="특별한 요청사항이 있다면 입력해주세요..."
                  />
                </div>

                {/* Price Summary */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium">총 금액:</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-600">
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

          {currentStep === 4 && selectedService && (
            <div>
              <h3 className="text-xl font-semibold mb-6 text-center">주문 확인</h3>
              <div className="max-w-2xl mx-auto">
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">플랫폼:</span>
                    <span>네이버</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">카테고리:</span>
                    <span>{naverServiceCategories.find(cat => cat.id === selectedCategory)?.name}</span>
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
                    <span className="text-green-600 break-all text-sm max-w-xs">{targetUrl}</span>
                  </div>
                  {additionalInfo && (
                    <div className="flex justify-between">
                      <span className="font-medium">추가사항:</span>
                      <span className="text-gray-700 text-sm max-w-xs">{additionalInfo}</span>
                    </div>
                  )}
                  <hr />
                  <div className="flex justify-between text-xl font-bold">
                    <span>총 금액:</span>
                    <span className="text-green-600">{totalPrice.toLocaleString()}원</span>
                  </div>
                </div>

                <div className="mt-6 p-6 bg-green-50 rounded-2xl">
                  <h4 className="font-semibold mb-3 text-green-900">🎉 네이버 서비스 특별 이벤트</h4>
                  <div className="bg-white rounded-xl p-4 border border-green-200">
                    <div className="flex items-center mb-2">
                      <span className="text-green-600 mr-2">🎁</span>
                      <span className="font-medium text-green-800">N포인트 서비스 런칭 기념 특별 이벤트</span>
                    </div>
                    <p className="text-sm text-green-700">
                      네이버 서비스 주문 시 추가 10% 할인 혜택을 받으실 수 있습니다!
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-6 bg-blue-50 rounded-2xl">
                  <h4 className="font-semibold mb-3 text-blue-900">네이버 서비스 주문 안내</h4>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li>• 주문 후 {selectedService.estimatedTime} 내에 작업이 완료됩니다</li>
                    <li>• 실제 한국인 계정으로만 진행되어 안전합니다</li>
                    <li>• 네이버 정책을 준수하여 서비스를 제공합니다</li>
                    <li>• 작업 진행 중 문의사항은 1:1 문의를 이용해주세요</li>
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
              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !selectedCategory) ||
                    (currentStep === 2 && !selectedService) ||
                    (currentStep === 3 && (!targetUrl.trim() || quantity < (selectedService?.minQuantity || 0)))
                  }
                  className="px-8 py-3 bg-green-600 text-white rounded-2xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
