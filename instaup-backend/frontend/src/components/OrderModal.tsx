import { useState } from "react";
import { platformsData } from "../data/services";
import type { ServiceItem } from "../types/services";

interface OrderModalProps {
  isOpen: boolean;
  service: ServiceItem | null;
  onClose: () => void;
  onOrder: (orderData: any) => void;
  isLoggedIn: boolean;
  onLoginRequired: () => void;
  userBalance?: number;
}

export default function OrderModal({
  isOpen,
  service,
  onClose,
  onOrder,
  isLoggedIn,
  onLoginRequired,
  userBalance = 0,
}: OrderModalProps) {
  const [orderData, setOrderData] = useState({
    link: "",
    quantity: service?.minOrder || 5,
    note: "",
    accountType: "public", // public or private
    isValidated: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationStep, setValidationStep] = useState(1);
  const [linkValidation, setLinkValidation] = useState({
    isValid: false,
    isPublic: false,
    accountExists: false,
    message: "",
  });

  if (!isOpen || !service) return null;

  const platform = platformsData.find((p) => p.id === service.platform);
  const totalPrice = Math.floor((orderData.quantity / 1) * service.price); // SNS샵은 개당 가격
  const originalTotalPrice = service.originalPrice
    ? Math.floor((orderData.quantity / 1) * service.originalPrice)
    : null;
  const savings = originalTotalPrice ? originalTotalPrice - totalPrice : 0;
  const hasInsufficientBalance = totalPrice > userBalance;

  // SNS샵 스타일 링크 검증 (인스타그램 아이디 또는 링크)
  const validateInstagramLink = (input: string) => {
    const trimmedInput = input.trim();

    // 인스타그램 아이디만 입력된 경우 (@ 없이)
    const usernamePattern = /^[a-zA-Z0-9_.]{1,30}$/;

    // 인스타그램 링크 패턴
    const linkPattern =
      /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9_.]{1,30})/;

    if (usernamePattern.test(trimmedInput)) {
      return {
        isValid: true,
        username: trimmedInput,
        type: "username",
      };
    }

    const linkMatch = trimmedInput.match(linkPattern);
    if (linkMatch) {
      return {
        isValid: true,
        username: linkMatch[1],
        type: "link",
      };
    }

    return {
      isValid: false,
      username: "",
      type: "invalid",
    };
  };

  const handleLinkValidation = async () => {
    if (!orderData.link.trim()) {
      setLinkValidation({
        isValid: false,
        isPublic: false,
        accountExists: false,
        message: "인스타그램 아이디를 입력해주세요.",
      });
      return;
    }

    const validation = validateInstagramLink(orderData.link);

    if (!validation.isValid) {
      setLinkValidation({
        isValid: false,
        isPublic: false,
        accountExists: false,
        message: "올바른 인스타그램 아이디 또는 링크를 입력해주세요.",
      });
      return;
    }

    setIsLoading(true);

    // 실제 SNS샵과 같은 계정 검증 시뮬레이션
    setTimeout(() => {
      const isAccountPublic = Math.random() > 0.1; // 90% 확률로 공개 계정
      const accountExists = Math.random() > 0.05; // 95% 확률로 계정 존재

      if (!accountExists) {
        setLinkValidation({
          isValid: false,
          isPublic: false,
          accountExists: false,
          message: "존재하지 않는 계정입니다. 아이디를 다시 확인해주세요.",
        });
      } else if (!isAccountPublic) {
        setLinkValidation({
          isValid: false,
          isPublic: false,
          accountExists: true,
          message: "비공개 계정입니다. 계정을 공개로 설정한 후 주문해주세요.",
        });
      } else {
        setLinkValidation({
          isValid: true,
          isPublic: true,
          accountExists: true,
          message: "검증 완료! 주문을 진행할 수 있습니다.",
        });
        setOrderData((prev) => ({ ...prev, isValidated: true }));
        setValidationStep(2);
      }

      setIsLoading(false);
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }

    if (!orderData.isValidated) {
      alert("먼저 계정 검증을 완료해주세요.");
      return;
    }

    if (
      orderData.quantity < service.minOrder ||
      orderData.quantity > service.maxOrder
    ) {
      alert(
        `주문 수량은 ${service.minOrder}개 이상 ${service.maxOrder}개 이하로 입력해주세요.`,
      );
      return;
    }

    // 잔액 검사
    if (hasInsufficientBalance) {
      alert(
        `잔액이 부족합니다.\n\n필요 금액: ${totalPrice.toLocaleString()}원\n현재 잔액: ${userBalance.toLocaleString()}원\n부족 금액: ${(totalPrice - userBalance).toLocaleString()}원\n\n충전 후 다시 주문해주세요.`,
      );
      return;
    }

    setIsLoading(true);

    // SNS샵 스타일 주문 처리
    setTimeout(() => {
      onOrder({
        service,
        ...orderData,
        totalPrice,
        platform,
        orderType: "instant_start", // 즉시 시작
        refillPolicy: "60일간 3회",
        deliveryMethod: "official_app",
      });
      setIsLoading(false);
      onClose();
    }, 2000);
  };

  const handleQuantityChange = (value: number) => {
    const clampedValue = Math.max(
      service.minOrder,
      Math.min(service.maxOrder, value),
    );
    setOrderData((prev) => ({ ...prev, quantity: clampedValue }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* 모달 */}
      <div className="relative bg-white rounded-lg w-full max-w-md max-h-screen overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* 헤더 */}
          <div className="sticky top-0 bg-white border-b p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">주문하기</h2>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <span className="text-gray-600">✕</span>
              </button>
            </div>
          </div>

          {/* 서비스 정보 */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-50">
                <img
                  src={platform?.icon}
                  alt={platform?.name}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{service.name}</h3>
                <p className="text-sm text-gray-600">{platform?.name}</p>
              </div>
            </div>

            {/* 배지들 */}
            <div className="flex gap-2 mb-4">
              {service.isPopular && (
                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                  인기
                </span>
              )}
              {service.isRecommended && (
                <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
                  추천
                </span>
              )}
              {service.deliveryTime.includes("1-5분") && (
                <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full font-medium">
                  즉시시작
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-4">{service.description}</p>

            {/* 특징 */}
            <div className="space-y-1">
              {service.features.slice(0, 4).map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center text-sm text-gray-600"
                >
                  <span className="text-green-500 mr-2">✓</span>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* 주문 단계별 진행 */}
          <div className="p-6 space-y-6">
            {/* 단계 1: 계정 입력 및 검증 */}
            <div className={`${validationStep >= 1 ? "block" : "hidden"}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-[#22426f] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <h4 className="font-medium text-gray-900">계정 정보 입력</h4>
              </div>

              <div className="ml-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  인스타그램 아이디 *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={orderData.link}
                    onChange={(e) =>
                      setOrderData((prev) => ({
                        ...prev,
                        link: e.target.value,
                        isValidated: false,
                      }))
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="username 또는 인스타그램 링크"
                    disabled={orderData.isValidated}
                  />
                  <button
                    type="button"
                    onClick={handleLinkValidation}
                    disabled={isLoading || orderData.isValidated}
                    className="px-4 py-2 bg-[#22426f] text-white rounded-lg hover:bg-[#1e3b61] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading
                      ? "검증중..."
                      : orderData.isValidated
                        ? "완료"
                        : "검증"}
                  </button>
                </div>

                {/* 검증 결과 */}
                {linkValidation.message && (
                  <div
                    className={`mt-2 p-3 rounded-lg text-sm ${
                      linkValidation.isValid
                        ? "bg-green-50 border border-green-200 text-green-800"
                        : "bg-red-50 border border-red-200 text-red-800"
                    }`}
                  >
                    {linkValidation.isValid ? "✅" : "❌"}{" "}
                    {linkValidation.message}
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  ⚠️ 주문 전 계정이 공개 상태인지 확인해주세요
                </p>
              </div>
            </div>

            {/* 단계 2: 수량 선택 */}
            <div className={`${validationStep >= 2 ? "block" : "hidden"}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-[#22426f] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <h4 className="font-medium text-gray-900">주문 수량 선택</h4>
              </div>

              <div className="ml-8">
                <div className="flex items-center gap-3 mb-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleQuantityChange(orderData.quantity - 10)
                    }
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    disabled={orderData.quantity <= service.minOrder}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={orderData.quantity}
                    onChange={(e) =>
                      handleQuantityChange(Number.parseInt(e.target.value) || 0)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                    min={service.minOrder}
                    max={service.maxOrder}
                    step={1}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleQuantityChange(orderData.quantity + 10)
                    }
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    disabled={orderData.quantity >= service.maxOrder}
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  최소 {service.minOrder.toLocaleString()}개 ~ 최대{" "}
                  {service.maxOrder.toLocaleString()}개
                </p>
              </div>
            </div>

            {/* 요청사항 */}
            {validationStep >= 2 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  요청사항 (선택)
                </label>
                <textarea
                  value={orderData.note}
                  onChange={(e) =>
                    setOrderData((prev) => ({ ...prev, note: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="특별한 요청사항이 있으시면 입력해주세요"
                />
              </div>
            )}
          </div>

          {/* 결제 정보 */}
          {validationStep >= 2 && (
            <div className="p-6 bg-gray-50 border-t">
              {/* 잔액 정보 */}
              {isLoggedIn && (
                <div className="mb-4 p-3 bg-white rounded-lg border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">현재 잔액</span>
                    <span className="font-medium text-[#22426f]">
                      {userBalance.toLocaleString()}원
                    </span>
                  </div>
                  {hasInsufficientBalance && (
                    <div className="mt-2 text-xs text-red-600">
                      ⚠️ 잔액이 부족합니다. (
                      {(totalPrice - userBalance).toLocaleString()}원 부족)
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">수량</span>
                  <span className="font-medium">
                    {orderData.quantity.toLocaleString()}개
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">단가</span>
                  <span className="font-medium">
                    {service.price.toLocaleString()}원/개
                  </span>
                </div>
                {savings > 0 && (
                  <>
                    <div className="flex justify-between text-sm text-gray-400 line-through">
                      <span>정가</span>
                      <span>{originalTotalPrice?.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between text-sm text-red-600">
                      <span>할인</span>
                      <span>-{savings.toLocaleString()}원</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-lg font-bold text-[#22426f] pt-2 border-t">
                  <span>총 결제금액</span>
                  <span>{totalPrice.toLocaleString()}원</span>
                </div>
              </div>

              {/* 예상 시작 시간 */}
              <div className="text-center text-sm text-gray-600 mb-4">
                <span className="font-medium">⏰ 시작 시간:</span>{" "}
                {service.deliveryTime}
                <br />
                <span className="font-medium">🔄 리필 정책:</span> 60일간 3회
                무료 리필
              </div>

              {/* 주문 버튼 */}
              <button
                type="submit"
                disabled={
                  isLoading || !orderData.isValidated || hasInsufficientBalance
                }
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  hasInsufficientBalance
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-[#22426f] text-white hover:bg-[#1e3b61]"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    주문 처리 중...
                  </div>
                ) : !orderData.isValidated ? (
                  "계정 검증을 먼저 완료해주세요"
                ) : hasInsufficientBalance ? (
                  `잔액 부족 (${(totalPrice - userBalance).toLocaleString()}원 부족)`
                ) : (
                  `${totalPrice.toLocaleString()}원 결제하기`
                )}
              </button>

              {!isLoggedIn && (
                <p className="text-center text-sm text-red-600 mt-2">
                  주문하시려면 로그인이 필요합니다
                </p>
              )}
            </div>
          )}

          {/* 경고 메시지 */}
          {service.warningNote && (
            <div className="p-4 bg-yellow-50 border-t">
              <p className="text-sm text-yellow-800">⚠️ {service.warningNote}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
