import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export default function FaqPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const categories = [
    { id: "all", name: "전체" },
    { id: "order", name: "주문/결제" },
    { id: "service", name: "서비스 이용" },
    { id: "account", name: "계정 관리" },
    { id: "refund", name: "환불/취소" },
    { id: "technical", name: "기술 문의" },
  ];

  const faqData: FAQItem[] = [
    {
      id: "1",
      category: "order",
      question: "주문은 어떻게 하나요?",
      answer:
        "1. 원하는 서비스를 선택하세요\n2. 대상 URL을 입력하세요 (Instagram 게시물, YouTube 동영상 등)\n3. 수량을 선택하세요\n4. 결제를 완료하세요\n\n주문 완료 후 1-24시간 내에 서비스가 시작됩니다.",
    },
    {
      id: "2",
      category: "order",
      question: "결제는 어떤 방법이 가능한가요?",
      answer:
        "다음 결제 방법을 지원합니다:\n\n• 신용카드/체크카드 (즉시 충전)\n• 카카오페이 (즉시 충전)\n• 네이버페이 (즉시 충전)\n• 토스페이 (즉시 충전)\n• 무통장입금 (1-2시간 내 처리)\n\n모든 결제는 SSL 보안으로 안전하게 처리됩니다.",
    },
    {
      id: "3",
      category: "service",
      question: "서비스는 언제 시작되나요?",
      answer:
        "서비스 시작 시간은 플랫폼과 서비스 종류에 따라 다릅니다:\n\n• Instagram 좋아요/팔로워: 1-30분\n• YouTube 조회수/구독자: 1-6시간\n• TikTok 좋아요/팔로워: 30분-2시간\n• Facebook 좋아요/팬: 1-12시간\n\n주문 후 진행 상황은 '주문 내역'에서 실시간으로 확인할 수 있습니다.",
    },
    {
      id: "4",
      category: "service",
      question: "계정이 비공개일 때도 서비스를 이용할 수 있나요?",
      answer:
        "아니요, 비공개 계정에는 서비스를 제공할 수 없습니다.\n\n서비스 이용을 위해서는:\n• Instagram: 공개 계정으로 설정\n• YouTube: 공개 동영상으로 설정\n• TikTok: 공개 계정으로 설정\n\n서비스 완료 후 다시 비공개로 설정하는 것은 가능합니다.",
    },
    {
      id: "5",
      category: "account",
      question: "잔액은 어떻게 충전하나요?",
      answer:
        "잔액 충전 방법:\n\n1. 우상단의 '충전' 버튼 클릭\n2. 충전할 금액 선택 (10,000원~500,000원)\n3. 결제 수단 선택\n4. 결제 완료\n\n50,000원 이상 충전 시 보너스 금액이 추가로 지급됩니다!",
    },
    {
      id: "6",
      category: "account",
      question: "추천인 시스템은 어떻게 작동하나요?",
      answer:
        "추천인 혜택:\n\n• 신규 회원 가입 시: 추천인과 피추천인 모두 10,000원 지급\n• 피추천인 첫 주문 시: 추천인에게 주문금액의 5% 지급\n• 10명 추천 달성: 추가 50,000원 지급\n• 50명 추천 달성: 추가 300,000원 지급\n\n계정 관리 > 추천인 관리에서 나의 추천인 코드를 확인할 수 있습니다.",
    },
    {
      id: "7",
      category: "refund",
      question: "환불은 언제 가능한가요?",
      answer:
        "환불 가능한 경우:\n\n• 서비스 시작 전 취소 요청 (100% 환불)\n• 서비스 품질 문제 (부분 환불 가능)\n• 잘못된 URL 입력으로 인한 오류\n\n환불 불가능한 경우:\n• 서비스 완료 후\n• 고객 변심\n• 계정 비공개 설정으로 인한 실패\n\n환불 요청은 고객센터를 통해 문의해 주세요.",
    },
    {
      id: "8",
      category: "refund",
      question: "잔액 환불은 가능한가요?",
      answer:
        "충전된 잔액은 원칙적으로 환불이 불가능합니다.\n\n예외적으로 환불 가능한 경우:\n• 시스템 오류로 인한 잘못된 충전\n• 중복 결제\n• 미성년자의 무단 결제 (보호자 동의서 필요)\n\n환불 신청 시 본인 인증 및 결제 내역 확인이 필요합니다.",
    },
    {
      id: "9",
      category: "technical",
      question: "서비스가 중도에 중단되면 어떻게 하나요?",
      answer:
        "서비스 중단 발생 시:\n\n1. 즉시 고객센터로 문의\n2. 진행률과 중단 사유 확인\n3. 보상 방안 협의 (재진행 또는 부분 환불)\n\n대부분의 경우 24시간 내에 서비스가 재개되며, 품질에 문제가 있을 경우 무상 리필 서비스를 제공합니다.",
    },
    {
      id: "10",
      category: "technical",
      question: "리필 서비스란 무엇인가요?",
      answer:
        "리필 서비스는 서비스 완료 후 감소분에 대한 보충 서비스입니다.\n\n리필 조건:\n• 서비스 완료 후 30일 이내\n• 자연 감소분 20% 이상일 때\n• 부정 행위가 없는 경우\n\n리필 신청 방법:\n주문 내역 > 해당 주문 > '리필 요청' 버튼 클릭\n\n리필은 무료로 제공되며, 원래 주문량의 50%까지 가능합니다.",
    },
    {
      id: "11",
      category: "order",
      question: "대량 주문 할인이 있나요?",
      answer:
        "대량 주문 시 자동 할인이 적용됩니다:\n\n• 10만원 이상: 5% 할인\n• 50만원 이상: 10% 할인\n• 100만원 이상: 15% 할인\n• 500만원 이상: 20% 할인\n\n할인은 주문 시 자동으로 적용되며, 추가 쿠폰과 중복 사용 가능합니다.",
    },
    {
      id: "12",
      category: "service",
      question: "어떤 플랫폼을 지원하나요?",
      answer:
        "현재 지원하는 플랫폼:\n\n• Instagram: 좋아요, 팔로워, 조회수, 댓글\n• YouTube: 조회수, 구독자, 좋아요, 댓글\n• TikTok: 좋아요, 팔로워, 조회수, 공유\n• Facebook: 좋아요, 팬 페이지, 댓글\n• Twitter: 좋아요, 팔로워, 리트윗\n\n새로운 플랫폼과 서비스는 지속적으로 추가되고 있습니다.",
    },
  ];

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQs = faqData.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      searchTerm === "" ||
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

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
              <h1 className="text-xl font-bold text-gray-900">
                ❓ 자주 묻는 질문
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 안내 메시지 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="text-3xl mr-4">💡</div>
            <div>
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                자주 묻는 질문을 확인해보세요
              </h2>
              <p className="text-blue-800">
                대부분의 궁금증은 아래 FAQ에서 해결할 수 있습니다. 원하는 답변을
                찾지 못하셨다면 고객센터로 문의해 주세요.
              </p>
            </div>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="space-y-4">
            {/* 검색 */}
            <div>
              <input
                type="text"
                placeholder="질문이나 키워드를 검색하세요..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 카테고리 필터 */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-[#22426f] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ 목록 */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-gray-500 mb-2">🔍 검색 결과가 없습니다</div>
              <p className="text-gray-600">
                다른 검색어나 카테고리를 시도해보세요.
              </p>
            </div>
          ) : (
            filteredFAQs.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm">
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start">
                      <span className="text-lg mr-3">❓</span>
                      <h3 className="font-medium text-gray-900">
                        {item.question}
                      </h3>
                    </div>
                    <span
                      className={`text-gray-400 transition-transform ${
                        expandedItems.has(item.id) ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </div>
                </button>

                {expandedItems.has(item.id) && (
                  <div className="px-6 pb-4">
                    <div className="border-t pt-4">
                      <div className="flex items-start">
                        <span className="text-lg mr-3">💬</span>
                        <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                          {item.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* 고객센터 안내 */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📞 추가 문의가 필요하신가요?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">💬</div>
              <div className="font-medium text-gray-900 mb-1">
                카카오톡 상담
              </div>
              <div className="text-sm text-gray-600 mb-2">
                24시간 실시간 상담
              </div>
              <button className="text-sm bg-yellow-400 text-gray-900 px-3 py-1 rounded-lg hover:bg-yellow-500">
                상담하기
              </button>
            </div>

            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">📧</div>
              <div className="font-medium text-gray-900 mb-1">이메일 문의</div>
              <div className="text-sm text-gray-600 mb-2">
                support@instaup.kr
              </div>
              <button
                onClick={() =>
                  (window.location.href = "mailto:support@instaup.kr")
                }
                className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200"
              >
                메일 보내기
              </button>
            </div>

            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">📱</div>
              <div className="font-medium text-gray-900 mb-1">전화 상담</div>
              <div className="text-sm text-gray-600 mb-2">평일 09:00-18:00</div>
              <button className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200">
                1588-0000
              </button>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              평균 응답시간:{" "}
              <span className="font-medium text-blue-600">5분 이내</span> | 고객
              만족도: <span className="font-medium text-green-600">98.5%</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
