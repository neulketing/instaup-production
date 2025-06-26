import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RechargeModal from "../components/RechargeModal";
import { backendApi } from "../services/backendApi";
import { authManager } from "../utils/auth";

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

interface RechargeHistory {
  id: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
  paidAt?: string;
}

export default function AddFundsPage() {
  const navigate = useNavigate();
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeHistory, setRechargeHistory] = useState<RechargeHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState(50000);
  const [userSession, setUserSession] = useState(
    authManager.getCurrentSession(),
  );

  useEffect(() => {
    if (!userSession) {
      navigate("/");
      return;
    }
    fetchRechargeHistory();
  }, [userSession]);

  const fetchRechargeHistory = async () => {
    try {
      setLoading(true);
      // TODO: 백엔드에서 충전 내역 API 구현 후 연결
      // const response = await backendApi.getRechargeHistory()

      // 임시 데이터
      const mockHistory: RechargeHistory[] = [
        {
          id: "1",
          amount: 100000,
          method: "신용카드",
          status: "completed",
          createdAt: new Date().toISOString(),
          paidAt: new Date().toISOString(),
        },
      ];
      setRechargeHistory(mockHistory);
    } catch (error) {
      console.error("충전 내역 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRechargeComplete = async (amount: number) => {
    // 잔액 업데이트
    const newBalance = userSession!.balance + amount;
    authManager.updateBalance(newBalance);
    setUserSession({ ...userSession!, balance: newBalance });

    // 충전 내역 새로고침
    await fetchRechargeHistory();

    // 충전 완료 후 재주문 유도
    toast.success(
      "충전 완료!",
      `${amount.toLocaleString()}원이 충전되었습니다. 현재 잔액: ${newBalance.toLocaleString()}원`,
      { duration: 5000 },
    );
    // 재주문 여부 확인
    setTimeout(() => {
      if (confirm("충전이 완료되었습니다. 바로 주문하시겠습니까?")) {
        navigate("/");
      }
    }, 500);
  };

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
  ];

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "처리중",
      completed: "완료",
      failed: "실패",
      cancelled: "취소됨",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  if (!userSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            로그인이 필요합니다
          </h2>
          <p className="text-gray-600 mb-4">
            잔액 충전을 하려면 로그인해주세요.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-[#22426f] text-white rounded-lg hover:bg-[#1e3b61]"
          >
            홈으로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/")}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100"
              >
                <span className="text-xl">←</span>
              </button>
              <h1 className="text-xl font-bold text-gray-900">💰 잔액 충전</h1>
            </div>
            <div className="text-sm text-gray-600">
              현재 잔액: {userSession.balance.toLocaleString()}원
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 현재 잔액 표시 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">현재 잔액</div>
            <div className="text-3xl font-bold text-[#22426f] mb-2">
              {userSession.balance.toLocaleString()}원
            </div>
            <div className="text-sm text-gray-600">
              💡 충전 후 즉시 모든 서비스 이용 가능
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 충전 섹션 */}
          <div className="space-y-6">
            {/* 추천 충전 금액 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                🎯 추천 충전 금액
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {amountOptions.map((option) => (
                  <button
                    key={option.amount}
                    onClick={() => setSelectedAmount(option.amount)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedAmount === option.amount
                        ? "border-[#22426f] bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
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
                        실제: {(option.amount + option.bonus).toLocaleString()}
                        원
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 결제 수단 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                💳 결제 수단
              </h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
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
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        {method.minAmount?.toLocaleString()}원~
                        <br />
                        {method.maxAmount?.toLocaleString()}원
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 충전하기 버튼 */}
            <button
              onClick={() => setShowRechargeModal(true)}
              className="w-full py-4 px-4 bg-[#22426f] text-white rounded-lg font-bold text-lg hover:bg-[#1e3b61] transition-colors"
            >
              {selectedAmount.toLocaleString()}원 충전하기
            </button>

            {/* 충전 안내 */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-blue-800">
                <div className="font-medium mb-2 flex items-center gap-2">
                  💡 충전 안내
                </div>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>신용카드/간편결제는 즉시 충전됩니다</li>
                  <li>무통장입금은 입금 확인 후 1-2시간 내 처리됩니다</li>
                  <li>50,000원 이상 충전 시 보너스가 제공됩니다</li>
                  <li>충전된 금액은 환불이 불가능합니다</li>
                  <li>모든 결제는 SSL 보안 연결로 안전하게 처리됩니다</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 충전 내역 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              📋 충전 내역
            </h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#22426f]"></div>
                <p className="mt-2 text-sm text-gray-600">
                  충전 내역을 불러오고 있습니다...
                </p>
              </div>
            ) : rechargeHistory.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-2">
                  💳 충전 내역이 없습니다
                </div>
                <p className="text-sm text-gray-600">첫 충전을 시작해보세요!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rechargeHistory.map((history) => (
                  <div
                    key={history.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(history.status)}`}
                        >
                          {getStatusText(history.status)}
                        </span>
                        <span className="text-sm text-gray-600">
                          {history.method}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {history.amount.toLocaleString()}원
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      신청:{" "}
                      {new Date(history.createdAt).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {history.paidAt && (
                        <>
                          <br />
                          완료:{" "}
                          {new Date(history.paidAt).toLocaleDateString(
                            "ko-KR",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 더 보기 버튼 */}
            {rechargeHistory.length > 0 && (
              <button className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50">
                전체 충전 내역 보기
              </button>
            )}
          </div>
        </div>

        {/* 고객센터 정보 */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📞 고객센터
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">💬</div>
              <div className="font-medium text-gray-900 mb-1">
                카카오톡 상담
              </div>
              <div className="text-gray-600">24시간 이용 가능</div>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">📧</div>
              <div className="font-medium text-gray-900 mb-1">이메일 문의</div>
              <div className="text-gray-600">support@instaup.kr</div>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">🕐</div>
              <div className="font-medium text-gray-900 mb-1">
                평균 응답시간
              </div>
              <div className="text-gray-600">5분 이내</div>
            </div>
          </div>
        </div>
      </div>

      {/* 충전 모달 */}
      {showRechargeModal && (
        <RechargeModal
          isOpen={showRechargeModal}
          onClose={() => setShowRechargeModal(false)}
          currentBalance={userSession.balance}
          onRechargeComplete={handleRechargeComplete}
        />
      )}
    </div>
  );
}
