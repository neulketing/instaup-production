import { useEffect, useState } from "react";
import type { ServiceItem } from "../types/services";

interface StepOrderModalProps {
  isOpen: boolean;
  service: ServiceItem;
  userSession: any;
  onClose: () => void;
  onOrder: (orderData: {
    targetUrl: string;
    quantity: number;
    totalAmount?: number;
  }) => void;
  onAuthRequired: () => void;
}

interface OrderStep {
  number: string;
  title: string;
  description: string;
}

export default function StepOrderModal({
  isOpen,
  onClose,
  onOrder,
  isLoggedIn,
  onLoginRequired,
  userBalance,
  selectedService,
}: StepOrderModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(
    null,
  );
  const [selectedDetailService, setSelectedDetailService] = useState<
    string | null
  >(null);
  const [selectedProduct, setSelectedProduct] = useState<ServiceItem | null>(
    null,
  );
  const [targetUrl, setTargetUrl] = useState("");
  const [quantity, setQuantity] = useState(100);
  const [isLoading, setIsLoading] = useState(false);

  // 최종 간소화된 4단계 프로세스
  const steps: OrderStep[] = [
    {
      number: "01",
      title: "상품 설명 확인",
      description: "해당 상품에 대한 설명입니다. *꼭 읽어주세요*",
    },
    {
      number: "02",
      title: "주소 입력",
      description: "인스타그램 게시물 주소를 입력해주세요.",
    },
    {
      number: "03",
      title: "수량 입력",
      description: "구매하실 수량을 입력해 주세요.",
    },
    {
      number: "04",
      title: "주문 확인",
      description: "주문가격 (구매수량 입력시 자동으로 계산됩니다.)",
    },
  ];

  // SNS샵과 동일한 서비스 타입 (6x3 그리드)
  const serviceTypes = [
    {
      id: "recommendation",
      name: "추천서비스",
      icon: "⭐",
      description: "인기상품",
      color: "bg-yellow-50 border-yellow-200",
    },
    {
      id: "event",
      name: "이벤트",
      icon: "🎁",
      description: "특가할인",
      color: "bg-orange-50 border-orange-200",
    },
    {
      id: "premium",
      name: "상위노출",
      icon: "👑",
      description: "프리미엄",
      color: "bg-purple-50 border-purple-200",
    },
    {
      id: "management",
      name: "계정관리",
      icon: "📊",
      description: "운영대행",
      color: "bg-blue-50 border-blue-200",
    },
    {
      id: "package",
      name: "패키지",
      icon: "📦",
      description: "맞춤상품",
      color: "bg-green-50 border-green-200",
    },
    {
      id: "instagram",
      name: "인스타그램",
      icon: "📷",
      description: "팔로워,좋아요",
      color: "bg-pink-50 border-pink-200",
      highlight: true,
    },
  ];

  // 인스타그램 세부 서비스
  const instagramServices = [
    {
      id: "followers_basic",
      name: "인스타 팔로워 늘리기 [기본]",
      description: "안정적인 기본 팔로워",
      price: 120,
    },
    {
      id: "followers_premium",
      name: "🟢 인스타 팔로워 늘리기 [프리미엄]",
      description: "고품질 프리미엄 팔로워",
      price: 180,
      highlight: true,
    },
    {
      id: "followers_vip",
      name: "👑 인스타 팔로워 늘리기 [VIP]",
      description: "최고급 VIP 팔로워",
      price: 250,
    },
    {
      id: "likes",
      name: "인스타 좋아요 늘리기",
      description: "게시물 좋아요 증가",
      price: 80,
    },
    {
      id: "views",
      name: "인스타 조회수 늘리기",
      description: "릴스/영상 조회수",
      price: 60,
    },
    {
      id: "comments",
      name: "인스타 댓글 늘리기",
      description: "실제 댓글 작성",
      price: 200,
    },
    {
      id: "story_views",
      name: "인스타 스토리 조회수",
      description: "스토리 조회수 증가",
      price: 90,
    },
  ];

  // 상품별 상세 정보
  const productDetails: { [key: string]: ServiceItem } = {
    followers_basic: {
      id: "followers_basic",
      platform: "instagram" as any,
      name: "인스타 팔로워 늘리기 [기본]",
      description: "안정적이고 검증된 기본 팔로워 서비스입니다.",
      price: 120,
      originalPrice: 150,
      discount: 20,
      minOrder: 100,
      maxOrder: 50000,
      deliveryTime: "즉시~30분",
      quality: "basic",
      isPopular: false,
      features: ["30일 보장", "즉시 시작", "무료 리필"],
      category: "followers" as any,
      warningNote: "계정을 비공개로 설정하시면 서비스가 불가능합니다.",
    },
    followers_premium: {
      id: "followers_premium",
      platform: "instagram" as any,
      name: "🟢 인스타 팔로워 늘리기 [프리미엄]",
      description:
        "고품질의 실제 한국인 팔로워로 구성된 프리미엄 서비스입니다.",
      price: 180,
      originalPrice: 220,
      discount: 18,
      minOrder: 50,
      maxOrder: 30000,
      deliveryTime: "즉시~15분",
      quality: "premium",
      isPopular: true,
      isRecommended: true,
      features: ["실제 한국인", "고품질 보장", "30일 리필", "즉시 시작"],
      category: "followers" as any,
      warningNote: "프리미엄 서비스로 최고 품질을 보장합니다.",
    },
    followers_vip: {
      id: "followers_vip",
      platform: "instagram" as any,
      name: "👑 인스타 팔로워 늘리기 [VIP]",
      description:
        "최고급 VIP 팔로워 서비스로 셀럽 수준의 팔로워를 제공합니다.",
      price: 250,
      originalPrice: 300,
      discount: 17,
      minOrder: 20,
      maxOrder: 20000,
      deliveryTime: "즉시~10분",
      quality: "vip",
      isRecommended: true,
      features: ["VIP 등급", "셀럽 수준", "영구 보장", "1분 시작"],
      category: "followers" as any,
      warningNote: "VIP 서비스는 수량이 제한되어 있습니다.",
    },
  };

  useEffect(() => {
    if (!isOpen) {
      // 모달이 닫힐 때 모든 상태 초기화
      setCurrentStep(1);
      setSelectedServiceType(null);
      setSelectedDetailService(null);
      setSelectedProduct(null);
      setTargetUrl("");
      setQuantity(100);
    } else if (selectedService) {
      // 모달이 열릴 때 선택된 서비스가 있으면 설정
      setSelectedProduct(selectedService);
      setSelectedServiceType("instagram");
      setSelectedDetailService(selectedService.id);
    }
  }, [isOpen, selectedService]);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleServiceTypeSelect = (serviceType: string) => {
    setSelectedServiceType(serviceType);
    // 서비스 타입 선택 후 바로 세부 서비스 선택 UI 표시
  };

  const handleDetailServiceSelect = (serviceId: string) => {
    setSelectedDetailService(serviceId);
    setSelectedProduct(productDetails[serviceId] || null);
    // 세부 서비스 선택 후 바로 다음 단계로
    handleNext();
  };

  // 수량별 할인 계산
  const getQuantityDiscount = (qty: number) => {
    if (qty >= 5000) return 15; // 5000개 이상 15% 할인
    if (qty >= 2000) return 10; // 2000개 이상 10% 할인
    if (qty >= 1000) return 7; // 1000개 이상 7% 할인
    if (qty >= 500) return 5; // 500개 이상 5% 할인
    return 0; // 할인 없음
  };

  const calculateTotalPrice = () => {
    if (!selectedProduct) return 0;
    const basePrice = selectedProduct.price * (quantity / 100);
    const discount = getQuantityDiscount(quantity);
    const discountAmount = basePrice * (discount / 100);
    return Math.round(basePrice - discountAmount);
  };

  const getDiscountedUnitPrice = () => {
    if (!selectedProduct) return 0;
    const discount = getQuantityDiscount(quantity);
    return Math.round(selectedProduct.price * (1 - discount / 100));
  };

  const handleFinalOrder = async () => {
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }

    if (calculateTotalPrice() > userBalance) {
      alert("잔액이 부족합니다. 충전 후 이용해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      await onOrder({
        service: selectedProduct,
        targetUrl,
        quantity,
        totalPrice: calculateTotalPrice(),
      });
      onClose();
    } catch (error) {
      console.error("주문 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="fixed right-0 top-0 h-full w-full max-w-6xl bg-white shadow-lg overflow-y-auto">
        {/* SNS샵 스타일 헤더 */}
        <div className="sticky top-0 bg-[#22426f] text-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="https://ext.same-assets.com/3036106235/246958056.svg"
                alt="SNS샵"
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold">주문하기</h1>
                <p className="text-sm opacity-90">
                  실제 한국인 SNS 마케팅 서비스
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
        </div>

        {/* SNS샵 스타일 진행 단계 표시 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        currentStep > index + 1
                          ? "bg-green-500 text-white shadow-lg"
                          : currentStep === index + 1
                            ? "bg-[#22426f] text-white shadow-lg ring-4 ring-blue-200"
                            : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {currentStep > index + 1 ? "✓" : step.number}
                    </div>
                    <div
                      className={`text-xs mt-2 font-medium text-center ${
                        currentStep >= index + 1
                          ? "text-[#22426f]"
                          : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-20 h-1 mx-3 rounded ${
                        currentStep > index + 1 ? "bg-green-500" : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="flex">
          {/* 왼쪽 메인 영역 */}
          <div className="flex-1 p-8">
            {/* 현재 단계 제목 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#22426f] to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {steps[currentStep - 1].number}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {steps[currentStep - 1].title}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {steps[currentStep - 1].description}
                  </p>
                </div>
              </div>
              <div className="h-1 bg-gradient-to-r from-[#22426f] to-blue-500 rounded-full"></div>
            </div>

            {/* Step 1: 상품 설명 확인 */}
            {currentStep === 1 && selectedProduct && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">
                    📋 상품 설명 확인
                  </h3>
                  <p className="text-blue-700">
                    선택하신 상품의 상세 정보를 확인해주세요.
                  </p>
                </div>

                <div className="bg-white rounded-xl border shadow-lg p-8">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">
                        {selectedProduct.name}
                      </h4>
                      <p className="text-gray-600 mb-6">
                        {selectedProduct.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="font-medium text-gray-700">가격</div>
                          <div className="text-lg font-bold text-[#22426f]">
                            {selectedProduct.price.toLocaleString()}원/100개
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="font-medium text-gray-700">
                            처리시간
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            {selectedProduct.deliveryTime}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleNext}
                        className="mt-8 bg-gradient-to-r from-[#22426f] to-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:from-[#1e3b61] hover:to-blue-700 transition-colors"
                      >
                        ✓ 확인했습니다. 다음 단계로 →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: 인스타그램 게시물 주소 입력 */}
            {currentStep === 2 && selectedProduct && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">
                    🔗 인스타그램 게시물 주소 입력
                  </h3>
                  <p className="text-blue-700">
                    서비스를 적용할 인스타그램 게시물의 정확한 URL을
                    입력해주세요.
                  </p>
                </div>

                <div className="bg-white rounded-xl border shadow-lg p-8">
                  <div className="space-y-6">
                    {/* URL 입력 */}
                    <div>
                      <label className="block text-lg font-bold text-gray-900 mb-3">
                        📎 게시물 URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        placeholder="https://www.instagram.com/p/XXXXXXXXX/"
                        className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#22426f] focus:ring-4 focus:ring-blue-100 transition-all"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        예시: https://www.instagram.com/p/XXXXXXXXX/
                      </p>
                    </div>

                    {/* URL 입력 가이드 */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <h4 className="font-bold text-yellow-800 mb-3">
                        📋 URL 입력 가이드
                      </h4>
                      <div className="space-y-2 text-sm text-yellow-700">
                        <div className="flex items-start gap-2">
                          <span className="text-yellow-600">1.</span>
                          <span>인스타그램 앱에서 해당 게시물로 이동</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-yellow-600">2.</span>
                          <span>우상단 점 3개(⋯) 메뉴 클릭</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-yellow-600">3.</span>
                          <span>"링크 복사" 선택하여 URL 복사</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-yellow-600">4.</span>
                          <span>위 입력창에 붙여넣기</span>
                        </div>
                      </div>
                    </div>

                    {/* 주의사항 */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h4 className="font-bold text-red-800 mb-3">
                        ⚠️ URL 입력 시 주의사항
                      </h4>
                      <div className="space-y-2 text-sm text-red-700">
                        <div className="flex items-center gap-2">
                          <span className="text-red-500">•</span>
                          <span>
                            반드시 <strong>정확한 게시물 링크</strong>를
                            입력해주세요
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-red-500">•</span>
                          <span>
                            계정이 <strong>공개 상태</strong>인지 확인해주세요
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-red-500">•</span>
                          <span>
                            잘못된 URL 입력 시 서비스가 진행되지 않습니다
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-red-500">•</span>
                          <span>
                            프로필 링크가 아닌 <strong>게시물 링크</strong>여야
                            합니다
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* URL 유효성 체크 표시 */}
                    {targetUrl && (
                      <div
                        className={`p-4 rounded-lg ${
                          targetUrl.includes("instagram.com/p/")
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {targetUrl.includes("instagram.com/p/") ? (
                            <>
                              <span className="text-green-600 text-xl">✅</span>
                              <span className="text-green-800 font-medium">
                                올바른 인스타그램 게시물 URL입니다!
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-red-600 text-xl">❌</span>
                              <span className="text-red-800 font-medium">
                                올바른 인스타그램 게시물 URL이 아닙니다.
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: 구매 수량 설정 */}
            {currentStep === 3 && selectedProduct && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-green-900 mb-2">
                    📊 구매 수량 설정
                  </h3>
                  <p className="text-green-700">
                    슬라이더를 이용해 수량을 선택하세요. 많이 구매할수록 더 큰
                    할인을 받을 수 있습니다!
                  </p>
                </div>

                <div className="bg-white rounded-xl border shadow-lg p-8">
                  <div className="space-y-8">
                    {/* 수량별 할인 안내 */}
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-6">
                      <h4 className="font-bold text-red-900 mb-4 text-lg">
                        🎉 수량별 할인 혜택
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div
                            className={`flex justify-between p-2 rounded ${quantity >= 5000 ? "bg-red-100 border border-red-300" : "bg-gray-50"}`}
                          >
                            <span>5,000개 이상</span>
                            <span className="font-bold text-red-600">
                              15% 할인
                            </span>
                          </div>
                          <div
                            className={`flex justify-between p-2 rounded ${quantity >= 2000 && quantity < 5000 ? "bg-orange-100 border border-orange-300" : "bg-gray-50"}`}
                          >
                            <span>2,000개 이상</span>
                            <span className="font-bold text-orange-600">
                              10% 할인
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div
                            className={`flex justify-between p-2 rounded ${quantity >= 1000 && quantity < 2000 ? "bg-yellow-100 border border-yellow-300" : "bg-gray-50"}`}
                          >
                            <span>1,000개 이상</span>
                            <span className="font-bold text-yellow-600">
                              7% 할인
                            </span>
                          </div>
                          <div
                            className={`flex justify-between p-2 rounded ${quantity >= 500 && quantity < 1000 ? "bg-green-100 border border-green-300" : "bg-gray-50"}`}
                          >
                            <span>500개 이상</span>
                            <span className="font-bold text-green-600">
                              5% 할인
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 슬라이더 수량 선택 */}
                    <div>
                      <label className="block text-lg font-bold text-gray-900 mb-6">
                        🎯 주문 수량 선택{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      {/* 현재 수량 표시 */}
                      <div className="text-center mb-6">
                        <div className="text-5xl font-bold text-[#22426f] mb-2">
                          {quantity.toLocaleString()}
                        </div>
                        <div className="text-lg text-gray-600">개</div>
                        {getQuantityDiscount(quantity) > 0 && (
                          <div className="mt-2 inline-block bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold animate-pulse">
                            {getQuantityDiscount(quantity)}% 할인 적용중!
                          </div>
                        )}
                      </div>

                      {/* 슬라이더 */}
                      <div className="mb-8">
                        <input
                          type="range"
                          min={selectedProduct.minOrder}
                          max={selectedProduct.maxOrder}
                          step="50"
                          value={quantity}
                          onChange={(e) =>
                            setQuantity(Number.parseInt(e.target.value))
                          }
                          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #22426f 0%, #22426f ${((quantity - selectedProduct.minOrder) / (selectedProduct.maxOrder - selectedProduct.minOrder)) * 100}%, #e5e7eb ${((quantity - selectedProduct.minOrder) / (selectedProduct.maxOrder - selectedProduct.minOrder)) * 100}%, #e5e7eb 100%)`,
                          }}
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                          <span>
                            {selectedProduct.minOrder.toLocaleString()}개
                          </span>
                          <span>
                            {selectedProduct.maxOrder.toLocaleString()}개
                          </span>
                        </div>
                      </div>

                      {/* 빠른 수량 선택 버튼 */}
                      <div className="grid grid-cols-5 gap-3 mb-6">
                        {[100, 500, 1000, 2000, 5000]
                          .filter(
                            (q) =>
                              q >= selectedProduct.minOrder &&
                              q <= selectedProduct.maxOrder,
                          )
                          .map((quickQuantity) => (
                            <button
                              key={quickQuantity}
                              onClick={() => setQuantity(quickQuantity)}
                              className={`py-3 px-4 rounded-lg text-sm font-bold transition-all ${
                                quantity === quickQuantity
                                  ? "bg-[#22426f] text-white shadow-lg"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {quickQuantity.toLocaleString()}개
                              {getQuantityDiscount(quickQuantity) > 0 && (
                                <div className="text-xs text-red-500">
                                  -{getQuantityDiscount(quickQuantity)}%
                                </div>
                              )}
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* 실시간 가격 계산 */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                      <h4 className="font-bold text-blue-900 mb-4 text-lg">
                        💰 주문 금액 계산
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-lg">
                          <span className="text-gray-700">
                            기본 단가 (100개당)
                          </span>
                          <span
                            className={
                              getQuantityDiscount(quantity) > 0
                                ? "line-through text-gray-400"
                                : "font-bold"
                            }
                          >
                            {selectedProduct.price.toLocaleString()}원
                          </span>
                        </div>
                        {getQuantityDiscount(quantity) > 0 && (
                          <div className="flex justify-between text-lg">
                            <span className="text-gray-700">
                              할인 단가 (100개당)
                            </span>
                            <span className="font-bold text-red-600">
                              {getDiscountedUnitPrice().toLocaleString()}원 (-
                              {getQuantityDiscount(quantity)}%)
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg">
                          <span className="text-gray-700">주문 수량</span>
                          <span className="font-bold">
                            {quantity.toLocaleString()}개
                          </span>
                        </div>
                        <div className="border-t border-blue-200 pt-3">
                          <div className="flex justify-between text-2xl">
                            <span className="font-bold text-blue-900">
                              총 결제 금액
                            </span>
                            <span className="font-bold text-[#22426f]">
                              {calculateTotalPrice().toLocaleString()}원
                            </span>
                          </div>
                          {getQuantityDiscount(quantity) > 0 && (
                            <div className="text-right text-sm text-red-600 mt-1">
                              기본가격 대비{" "}
                              {(
                                selectedProduct.price * (quantity / 100) -
                                calculateTotalPrice()
                              ).toLocaleString()}
                              원 절약!
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: 주문 확인 */}
            {currentStep === 4 && selectedProduct && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-green-900 mb-2">
                    🛒 최종 주문 확인 및 결제
                  </h3>
                  <p className="text-green-700">
                    주문 정보를 최종 확인하고 결제를 진행해주세요.
                  </p>
                </div>

                <div className="bg-white rounded-xl border shadow-lg p-8">
                  <div className="space-y-8">
                    {/* 주문 상품 정보 */}
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <h4 className="font-bold text-blue-900 mb-4 text-lg">
                        📦 주문 상품 정보
                      </h4>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">상품명</span>
                            <span className="font-bold text-right">
                              {selectedProduct.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">주문 수량</span>
                            <span className="font-bold">
                              {quantity.toLocaleString()}개
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              단가 (100개당)
                            </span>
                            <span className="font-bold">
                              {selectedProduct.price.toLocaleString()}원
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">처리 시간</span>
                            <span className="font-bold text-green-600">
                              {selectedProduct.deliveryTime}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">품질 등급</span>
                            <span className="font-bold uppercase">
                              {selectedProduct.quality}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">리필 보장</span>
                            <span className="font-bold text-purple-600">
                              30일 무료
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <div className="flex justify-between">
                          <span className="text-gray-600">대상 URL</span>
                          <span className="font-medium text-blue-600 break-all text-right max-w-md">
                            {targetUrl}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 결제 정보 */}
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                      <h4 className="font-bold text-green-900 mb-4 text-lg">
                        💳 결제 정보
                      </h4>
                      <div className="space-y-4">
                        <div className="flex justify-between text-xl">
                          <span className="font-bold">총 주문 금액</span>
                          <span className="font-bold text-[#22426f] text-2xl">
                            {calculateTotalPrice().toLocaleString()}원
                          </span>
                        </div>

                        <div className="border-t border-green-200 pt-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">현재 잔액</span>
                              <span
                                className={`font-bold ${userBalance >= calculateTotalPrice() ? "text-green-600" : "text-red-600"}`}
                              >
                                {userBalance.toLocaleString()}원
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                결제 후 잔액
                              </span>
                              <span className="font-bold">
                                {(
                                  userBalance - calculateTotalPrice()
                                ).toLocaleString()}
                                원
                              </span>
                            </div>
                          </div>
                        </div>

                        {userBalance < calculateTotalPrice() && (
                          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-red-600 text-xl">⚠️</span>
                              <div>
                                <p className="text-red-800 font-bold">
                                  잔액이 부족합니다!
                                </p>
                                <p className="text-red-600 text-sm">
                                  {(
                                    calculateTotalPrice() - userBalance
                                  ).toLocaleString()}
                                  원을 추가로 충전해주세요.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 최종 확인사항 */}
                    <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                      <h4 className="font-bold text-yellow-800 mb-4 text-lg">
                        📋 최종 확인사항
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-600">✓</span>
                            <span className="text-yellow-700">
                              주문 후 <strong>즉시 서비스 시작</strong> (1-5분
                              내)
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-600">✓</span>
                            <span className="text-yellow-700">
                              서비스 시작 후 <strong>취소/환불 불가</strong>
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-600">✓</span>
                            <span className="text-yellow-700">
                              <strong>30일간 무료 리필</strong> 보장
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-600">✓</span>
                            <span className="text-yellow-700">
                              계정은 <strong>공개 상태 유지</strong> 필수
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 결제 버튼 */}
                    <div className="text-center">
                      <button
                        onClick={handleFinalOrder}
                        disabled={
                          isLoading || userBalance < calculateTotalPrice()
                        }
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-6 rounded-xl text-xl font-bold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-3">
                            <div className="loading-spinner w-6 h-6"></div>
                            <span>주문 처리 중...</span>
                          </div>
                        ) : (
                          `💳 ${calculateTotalPrice().toLocaleString()}원 결제하기`
                        )}
                      </button>

                      <p className="text-sm text-gray-500 mt-3">
                        결제와 동시에 서비스가 자동으로 시작됩니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 네비게이션 버튼 */}
            <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>←</span>
                <span>이전 단계</span>
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={
                    currentStep === 2 &&
                    (!targetUrl || !targetUrl.includes("instagram.com/p/"))
                  }
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#22426f] to-blue-600 text-white rounded-xl font-bold hover:from-[#1e3b61] hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>다음 단계</span>
                  <span>→</span>
                </button>
              ) : null}
            </div>
          </div>

          {/* 오른쪽 사이드바 - SNS샵 스타일 */}
          <div className="w-96 bg-gray-50 p-6 border-l">
            {/* 서버 상태 */}
            <div className="bg-[#22426f] text-white p-6 rounded-lg mb-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <h3 className="font-bold">🟢 모든 서비스 정상 가동중</h3>
              </div>
              <p className="text-sm opacity-90">
                마지막 업데이트: {new Date().toLocaleString()}
              </p>
              <div className="mt-3 text-xs opacity-75">
                평균 처리 시간: 2분 12초
              </div>
            </div>

            {/* 실시간 공지사항 */}
            <div className="bg-white rounded-lg p-6 mb-6 border">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-blue-500">📢</span>
                실시간 공지사항
              </h3>
              <div className="space-y-4 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-blue-600 font-bold">NEW</span>
                    <span className="text-xs text-gray-500">5분 전</span>
                  </div>
                  <p className="text-blue-800">
                    인스타그램 팔로워 서비스 품질이 업그레이드되었습니다.
                  </p>
                </div>

                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-600 font-bold">완료</span>
                    <span className="text-xs text-gray-500">1시간 전</span>
                  </div>
                  <p className="text-green-800">
                    서버 최적화 작업이 완료되어 더욱 빨라졌습니다.
                  </p>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-purple-600 font-bold">이벤트</span>
                    <span className="text-xs text-gray-500">3시간 전</span>
                  </div>
                  <p className="text-purple-800">
                    첫 주문 시 20% 할인 이벤트가 진행 중입니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 주문 가이드 */}
            <div className="bg-white rounded-lg p-6 mb-6 border">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-orange-500">📋</span>
                주문 가이드
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">▶</span>
                  <span>인스타그램 게시물 링크 복사 방법</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">▶</span>
                  <span>팔로워 늘리기 효과적인 사용법</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">▶</span>
                  <span>좋아요 서비스 최적 활용 팁</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">▶</span>
                  <span>조회수 늘리기 주의사항</span>
                </div>
              </div>
            </div>

            {/* 고객 지원 */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-yellow-500">💬</span>
                고객 지원
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2">
                  <img
                    src="https://ext.same-assets.com/3036106235/704908293.svg"
                    alt="카카오톡"
                    className="w-5 h-5"
                  />
                  카카오톡 상담하기
                </button>

                <div className="text-center text-sm text-gray-600">
                  <p className="mb-1">📞 고객센터: 24시간 운영</p>
                  <p className="mb-1">📧 이메일 문의 가능</p>
                  <p>⚡ 평균 응답시간: 30초</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
