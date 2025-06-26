import { useState, useEffect } from 'react'
import { useAdmin } from '../contexts/AdminContext'

interface PriceCalculatorProps {
  onOrderClick: () => void
}

export default function PriceCalculator({ onOrderClick }: PriceCalculatorProps) {
  const { serviceConfigs } = useAdmin()
  const [selectedPlatform, setSelectedPlatform] = useState('Instagram')
  const [selectedService, setSelectedService] = useState('')
  const [quantity, setQuantity] = useState(100)
  const [totalPrice, setTotalPrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [appliedDiscountRate, setAppliedDiscountRate] = useState(0)

  const platforms = ['Instagram', 'YouTube', 'TikTok', 'Facebook', 'X', 'Threads', 'Naver']

  const filteredServices = serviceConfigs.filter(
    service => service.platform === selectedPlatform && service.isActive
  )

  const currentService = serviceConfigs.find(service => service.id === selectedService)

  useEffect(() => {
    if (filteredServices.length > 0 && !selectedService) {
      setSelectedService(filteredServices[0].id)
    }
  }, [filteredServices, selectedService])

  useEffect(() => {
    if (currentService && quantity >= currentService.minQuantity) {
      calculatePrice()
    }
  }, [currentService, quantity])

  const calculatePrice = () => {
    if (!currentService) return

    let basePrice = currentService.price
    let finalDiscountRate = currentService.discountRate

    // Apply base discount
    if (currentService.discountRate > 0) {
      basePrice = Math.floor(basePrice * (1 - currentService.discountRate / 100))
    }

    // Find applicable bulk discount
    if (currentService.bulkDiscounts && currentService.bulkDiscounts.length > 0) {
      const applicableDiscount = currentService.bulkDiscounts
        .filter(discount => quantity >= discount.minQuantity)
        .sort((a, b) => b.discountPercent - a.discountPercent)[0]

      if (applicableDiscount) {
        finalDiscountRate = Math.max(finalDiscountRate, applicableDiscount.discountPercent)
        basePrice = Math.floor(currentService.price * (1 - applicableDiscount.discountPercent / 100))
      }
    }

    const originalTotal = Math.ceil((quantity / currentService.minQuantity) * currentService.price)
    const discountedTotal = Math.ceil((quantity / currentService.minQuantity) * basePrice)

    setTotalPrice(discountedTotal)
    setDiscount(originalTotal - discountedTotal)
    setAppliedDiscountRate(finalDiscountRate)
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString()
  }

  const getDiscountColor = (rate: number) => {
    if (rate >= 25) return 'text-red-600 bg-red-100'
    if (rate >= 15) return 'text-orange-600 bg-orange-100'
    if (rate >= 5) return 'text-green-600 bg-green-100'
    return 'text-blue-600 bg-blue-100'
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">💰 실시간 가격 계산기</h2>
        <p className="text-gray-600">수량에 따른 자동 할인이 적용됩니다</p>
      </div>

      <div className="space-y-6">
        {/* Platform Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            📱 플랫폼 선택
          </label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {platforms.map((platform) => (
              <button
                key={platform}
                onClick={() => {
                  setSelectedPlatform(platform)
                  setSelectedService('')
                }}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedPlatform === platform
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        {/* Service Selection */}
        {filteredServices.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ⚙️ 서비스 선택
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {filteredServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - {service.category}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quantity Selection */}
        {currentService && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              🔢 수량: {quantity.toLocaleString()}개
            </label>
            <div className="space-y-3">
              <input
                type="range"
                min={currentService.minQuantity}
                max={currentService.maxQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right,
                    rgb(147, 51, 234) 0%,
                    rgb(147, 51, 234) ${((quantity - currentService.minQuantity) / (currentService.maxQuantity - currentService.minQuantity)) * 100}%,
                    rgb(229, 231, 235) ${((quantity - currentService.minQuantity) / (currentService.maxQuantity - currentService.minQuantity)) * 100}%,
                    rgb(229, 231, 235) 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{currentService.minQuantity.toLocaleString()}</span>
                <span>{currentService.maxQuantity.toLocaleString()}</span>
              </div>
            </div>

            {/* Quick Quantity Buttons */}
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                currentService.minQuantity,
                Math.floor(currentService.maxQuantity * 0.25),
                Math.floor(currentService.maxQuantity * 0.5),
                Math.floor(currentService.maxQuantity * 0.75),
                currentService.maxQuantity
              ].map((qty) => (
                <button
                  key={qty}
                  onClick={() => setQuantity(qty)}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    quantity === qty
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                  }`}
                >
                  {qty.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bulk Discounts Display */}
        {currentService?.bulkDiscounts && currentService.bulkDiscounts.length > 0 && (
          <div className="bg-green-50 rounded-2xl p-4">
            <h4 className="font-semibold text-green-900 mb-3">🎯 대량 할인 혜택</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentService.bulkDiscounts.map((discount, index) => (
                <div
                  key={`${discount.minQuantity}-${discount.discountPercent}`}
                  className={`p-3 rounded-xl transition-all ${
                    quantity >= discount.minQuantity
                      ? 'bg-green-200 border-2 border-green-400 scale-105'
                      : 'bg-white border border-green-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {discount.minQuantity.toLocaleString()}개 이상
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      quantity >= discount.minQuantity
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-600'
                    }`}>
                      -{discount.discountPercent}%
                    </span>
                  </div>
                  {quantity >= discount.minQuantity && (
                    <div className="text-xs text-green-700 mt-1 font-medium">
                      ✅ 적용됨!
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price Summary */}
        {currentService && quantity >= currentService.minQuantity && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
            <h4 className="font-semibold text-gray-900 mb-4">💳 가격 요약</h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">서비스</span>
                <span className="font-medium">{currentService.name}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">수량</span>
                <span className="font-medium">{quantity.toLocaleString()}개</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">예상 처리시간</span>
                <span className="font-medium text-blue-600">{currentService.estimatedTime}</span>
              </div>

              {appliedDiscountRate > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">적용 할인</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-bold ${getDiscountColor(appliedDiscountRate)}`}>
                    -{appliedDiscountRate}% 할인
                  </span>
                </div>
              )}

              {discount > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span>할인 금액</span>
                  <span className="font-bold">-{formatPrice(discount)}원</span>
                </div>
              )}

              <hr className="border-gray-300" />

              <div className="flex justify-between items-center text-xl font-bold">
                <span>총 결제금액</span>
                <div className="text-right">
                  <span className="text-purple-600">{formatPrice(totalPrice)}원</span>
                  {discount > 0 && (
                    <div className="text-sm text-gray-400 line-through">
                      {formatPrice(totalPrice + discount)}원
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onOrderClick}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🚀 지금 주문하기
            </button>
          </div>
        )}

        {/* Service Features */}
        {currentService?.features && currentService.features.length > 0 && (
          <div className="bg-blue-50 rounded-2xl p-4">
            <h4 className="font-semibold text-blue-900 mb-3">✨ 서비스 특징</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentService.features.map((feature, index) => (
                <div key={`feature-${index}-${feature.slice(0, 10)}`} className="flex items-center text-sm text-blue-800">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        )}
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
