import { useState } from "react";
import { backendApi } from "../services/backendApi";

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onRechargeComplete: (amount: number) => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  isRecommended?: boolean;
  fee?: number;
  minAmount?: number;
  maxAmount?: number;
}

export default function RechargeModal({
  isOpen,
  onClose,
  currentBalance,
  onRechargeComplete,
}: RechargeModalProps) {
  const [selectedAmount, setSelectedAmount] = useState(10000);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // SNS샵 실제 충전 금액 옵션 (소스 분석 기반)
  const amountOptions = [
    { amount: 10000, bonus: 0, label: "10,000원" },
    { amount: 30000, bonus: 0, label: "30,000원" },
    {
      amount: 50000,
      bonus: 2500,
      label: "50,000원",
      bonusText: "+2,500원 보너스",
    },
    {
      amount: 100000,
      bonus: 7000,
      label: "100,000원",
      bonusText: "+7,000원 보너스",
    },
    {
      amount: 200000,
      bonus: 20000,
      label: "200,000원",
      bonusText: "+20,000원 보너스",
    },
    {
      amount: 500000,
      bonus: 60000,
      label: "500,000원",
      bonusText: "+60,000원 보너스",
    },
  ];

  // SNS샵 실제 결제 수단 (소스 분석 기반)
  const paymentMethods: PaymentMethod[] = [
    {
      id: "card",
      name: "신용카드/체크카드",
      icon: "💳",
      description: "즉시 충전 가능",
      isRecommended: true,
      fee: 0,
      minAmount: 1000,
      maxAmount: 1000000,
    },
    {
      id: "kakaopay",
      name: "카카오페이",
      icon: "💬",
      description: "간편결제",
      fee: 0,
      minAmount: 1000,
      maxAmount: 500000,
    },
    {
      id: "naverpay",
      name: "네이버페이",
      icon: "🟢",
      description: "네이버 간편결제",
      fee: 0,
      minAmount: 1000,
      maxAmount: 500000,
    },
    {
      id: "tosspay",
      name: "토스페이",
      icon: "🔵",
      description: "토스 간편결제",
      fee: 0,
      minAmount: 1000,
      maxAmount: 500000,
    },
    {
      id: "bank",
      name: "무통장입금",
      icon: "🏦",
      description: "1-2시간 내 처리",
      fee: 0,
      minAmount: 10000,
      maxAmount: 2000000,
    },
    {
      id: "phone",
      name: "휴대폰결제",
      icon: "📱",
      description: "통신사 결제",
      fee: 3000,
      minAmount: 5000,
      maxAmount: 50000,
    },
  ];

  if (!isOpen) return null;

  const getChargeAmount = () => {
    const baseAmount = customAmount
      ? Number.parseInt(customAmount) || 0
      : selectedAmount;
    const bonusAmount =
      amountOptions.find((opt) => opt.amount === selectedAmount)?.bonus || 0;
    return customAmount ? baseAmount : baseAmount + bonusAmount;
  };

  const getPaymentFee = () => {
    // 결제 수수료 계산 (현재는 휴대폰결제만 수수료 있음)
    if (selectedPayment === "phone") {
      return 3000;
    }
    return 0;
  };

  const getTotalAmount = () => {
    const chargeAmount = getChargeAmount();
    const fee = getPaymentFee();
    return fee > 0 ? chargeAmount + fee : chargeAmount; // 수수료가 있으면 추가, 없으면 그대로
  };

  const getNetAmount = () => {
    const chargeAmount = getChargeAmount();
    const fee = getPaymentFee();
    return fee > 0 ? chargeAmount : chargeAmount; // 실제 충전되는 금액
  };

  const handleRecharge = async () => {
    const netAmount = getNetAmount();
    const totalPayAmount = getTotalAmount();

    if (!agreementChecked) {
      alert("결제 약관에 동의해주세요.");
      return;
    }

    if (netAmount < 1000) {
      alert("최소 충전 금액은 1,000원입니다.");
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // 결제 요청 데이터 생성
      // 백엔드 API를 통한 결제 처리
      const response = await backendApi.addBalance(netAmount, selectedPayment);

      if (response.success) {
        // 결제 성공
        onRechargeComplete(netAmount);
        setIsProcessing(false);
        onClose();

        // SNS샵 스타일 충전 완료 알림
        alert(
          `✅ 충전이 완료되었습니다!\n\n💰 충전 금액: ${netAmount.toLocaleString()}원\n💳 결제 수단: ${paymentMethods.find((m) => m.id === selectedPayment)?.name}\n💸 결제 금액: ${totalPayAmount.toLocaleString()}원\n📊 현재 잔액: ${(currentBalance + netAmount).toLocaleString()}원\n\n감사합니다! 😊`,
        );
      } else {
        // 결제 실패
        throw new Error(response.error || "결제 처리 중 오류가 발생했습니다.");
      }
    } catch (error: any) {
      console.error("Payment Error:", error);
      setPaymentError(error.message || "결제 처리 중 오류가 발생했습니다.");

      // 사용자 친화적 에러 메시지
      let userMessage = "결제 처리 중 오류가 발생했습니다.";
      if (error.message.includes("사용자가")) {
        userMessage = "결제가 취소되었습니다.";
      } else if (error.message.includes("한도")) {
        userMessage = "결제 한도를 확인해주세요.";
      } else if (error.message.includes("네트워크")) {
        userMessage = "네트워크 연결을 확인해주세요.";
      }

      alert(
        `❌ ${userMessage}\n\n문제가 지속되면 고객센터로 문의해주세요.\n카카오톡 상담: 24시간 이용 가능`,
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* 모달 */}
      <div className="relative bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">💰 잔액 충전</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              disabled={isProcessing}
            >
              <span className="text-gray-600">✕</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* 에러 메시지 */}
          {paymentError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-sm text-red-800">❌ {paymentError}</div>
            </div>
          )}

          {/* 현재 잔액 표시 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">현재 잔액</div>
              <div className="text-2xl font-bold text-[#22426f]">
                {currentBalance.toLocaleString()}원
              </div>
            </div>
          </div>

          {/* 충전 금액 선택 */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              💸 충전 금액 선택
            </h3>

            {/* 미리 설정된 금액 옵션 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {amountOptions.map((option) => (
                <button
                  key={option.amount}
                  onClick={() => handleAmountSelect(option.amount)}
                  disabled={isProcessing}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedAmount === option.amount
                      ? "border-[#22426f] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  } disabled:opacity-50`}
                >
                  <div className="font-semibold text-gray-900">
                    {option.label}
                  </div>
                  {option.bonus > 0 && (
                    <div className="text-xs text-green-600 font-medium mt-1">
                      {option.bonusText}
                    </div>
                  )}
                  {option.bonus > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      실제 충전:{" "}
                      {(option.amount + option.bonus).toLocaleString()}원
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* 직접 입력 */}
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💭 직접 입력 (최소 1,000원)
              </label>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                placeholder="충전할 금액을 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1000"
                step="1000"
                disabled={isProcessing}
              />
            </div>
          </div>

          {/* 결제 수단 선택 */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              💳 결제 수단 선택
            </h3>

            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const fee = method.id === "phone" ? 3000 : 0;
                // 결제 수단별 한도는 method 객체에서 직접 가져옴
                const limits = {
                  min: method.minAmount,
                  max: method.maxAmount,
                };

                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    disabled={isProcessing}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedPayment === method.id
                        ? "border-[#22426f] bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    } disabled:opacity-50`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {method.name}
                            </span>
                            {method.isRecommended && (
                              <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full font-medium">
                                추천
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            {method.description}
                          </div>
                          {fee > 0 && (
                            <div className="text-xs text-red-600">
                              수수료: {fee.toLocaleString()}원
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right text-xs text-gray-500">
                        {limits && (
                          <>
                            <div>{limits.min?.toLocaleString()}원~</div>
                            <div>{limits.max?.toLocaleString()}원</div>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 충전 정보 요약 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-3">📋 충전 정보</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">선택한 금액</span>
                <span className="font-medium">
                  {(customAmount
                    ? Number.parseInt(customAmount) || 0
                    : selectedAmount
                  ).toLocaleString()}
                  원
                </span>
              </div>

              {!customAmount &&
                selectedAmount > 0 &&
                amountOptions.find((opt) => opt.amount === selectedAmount)
                  ?.bonus && (
                  <div className="flex justify-between">
                    <span className="text-green-600">보너스</span>
                    <span className="font-medium text-green-600">
                      +
                      {amountOptions
                        .find((opt) => opt.amount === selectedAmount)
                        ?.bonus?.toLocaleString()}
                      원
                    </span>
                  </div>
                )}

              {getPaymentFee() > 0 && (
                <div className="flex justify-between">
                  <span className="text-red-600">결제 수수료</span>
                  <span className="font-medium text-red-600">
                    +{getPaymentFee().toLocaleString()}원
                  </span>
                </div>
              )}

              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">
                    실제 충전 금액
                  </span>
                  <span className="font-bold text-[#22426f] text-lg">
                    {getNetAmount().toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">결제 금액</span>
                  <span className="font-bold text-gray-900 text-lg">
                    {getTotalAmount().toLocaleString()}원
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>충전 후 잔액</span>
                <span>
                  {(currentBalance + getNetAmount()).toLocaleString()}원
                </span>
              </div>
            </div>
          </div>

          {/* 약관 동의 */}
          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreementChecked}
                onChange={(e) => setAgreementChecked(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                disabled={isProcessing}
              />
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">
                  결제 약관에 동의합니다.
                </span>
                <div className="mt-1 text-xs">
                  • 충전된 금액은 환불이 불가능합니다
                  <br />• 충전 금액은 서비스 이용에만 사용 가능합니다
                  <br />• 부정 사용 적발 시 계정이 제재될 수 있습니다
                  <br />• 결제 정보는 안전하게 암호화되어 처리됩니다
                </div>
              </div>
            </label>
          </div>

          {/* 충전 버튼 */}
          <button
            onClick={handleRecharge}
            disabled={
              isProcessing || getNetAmount() < 1000 || !agreementChecked
            }
            className="w-full py-4 px-4 bg-[#22426f] text-white rounded-lg font-bold text-lg hover:bg-[#1e3b61] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner w-5 h-5 mr-2"></div>
                결제 처리 중...
              </div>
            ) : (
              `${getTotalAmount().toLocaleString()}원 충전하기`
            )}
          </button>

          {/* 안내 메시지 */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <div className="font-medium mb-1 flex items-center gap-2">
                💡 충전 안내
              </div>
              <ul className="text-xs space-y-1 list-disc list-inside">
                <li>신용카드/간편결제는 즉시 충전됩니다</li>
                <li>무통장입금은 입금 확인 후 1-2시간 내 처리됩니다</li>
                <li>50,000원 이상 충전 시 보너스가 제공됩니다</li>
                <li>결제 문의: 카카오톡 상담 (24시간 운영)</li>
                <li>모든 결제는 SSL 보안 연결로 안전하게 처리됩니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
