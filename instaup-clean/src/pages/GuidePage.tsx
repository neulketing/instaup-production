import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface GuideSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  steps: {
    title: string;
    content: string;
    image?: string;
    tip?: string;
  }[];
}

export default function GuidePage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("getting-started");

  const guideSections: GuideSection[] = [
    {
      id: "getting-started",
      title: "시작하기",
      icon: "🚀",
      description: "INSTAUP 서비스 이용을 위한 첫 단계를 안내합니다.",
      steps: [
        {
          title: "1. 회원가입 하기",
          content:
            '• 우상단의 "로그인" 버튼 클릭\n• "회원가입" 탭 선택\n• 이메일과 비밀번호 입력\n• 추천인 코드가 있다면 입력 (선택사항)\n• 회원가입 완료 시 10,000원 보너스 지급',
          tip: "추천인 코드 입력 시 추가 혜택을 받을 수 있습니다!",
        },
        {
          title: "2. 잔액 충전하기",
          content:
            '• 로그인 후 우상단 "충전" 버튼 클릭\n• 충전할 금액 선택 (10,000원~500,000원)\n• 결제 수단 선택 (카드, 간편결제, 무통장입금)\n• 결제 완료 후 즉시 잔액 반영',
          tip: "50,000원 이상 충전 시 보너스 금액이 추가로 지급됩니다!",
        },
        {
          title: "3. 첫 주문하기",
          content:
            '• 원하는 플랫폼과 서비스 선택\n• 대상 URL 입력 (Instagram 게시물, YouTube 동영상 등)\n• 수량 선택 및 가격 확인\n• "주문하기" 버튼 클릭하여 결제\n• 주문 완료 후 진행 상황 모니터링',
          tip: "처음에는 소량으로 테스트해보세요!",
        },
      ],
    },
    {
      id: "instagram-guide",
      title: "Instagram 이용 가이드",
      icon: "📸",
      description:
        "Instagram 좋아요, 팔로워, 조회수 서비스 이용 방법을 설명합니다.",
      steps: [
        {
          title: "1. 계정 공개 설정",
          content:
            '• Instagram 앱에서 프로필 > 설정 이동\n• "개인정보 보호" > "비공개 계정" 끄기\n• 계정이 공개 상태인지 확인\n• 게시물도 공개 설정 확인',
          tip: "비공개 계정에는 서비스를 제공할 수 없습니다.",
        },
        {
          title: "2. 게시물 URL 복사하기",
          content:
            '• 대상 게시물 선택\n• 우상단 "⋯" 메뉴 클릭\n• "링크 복사" 선택\n• 복사된 URL을 주문 시 입력',
          tip: "올바른 게시물 URL인지 확인하세요!",
        },
        {
          title: "3. 팔로워 서비스 이용하기",
          content:
            "• 프로필 URL 준비 (instagram.com/username)\n• 원하는 팔로워 수량 선택\n• 현재 팔로워 수 확인 후 주문\n• 24시간 이내 서비스 시작",
          tip: "급격한 증가보다는 자연스러운 증가를 권장합니다.",
        },
        {
          title: "4. 좋아요 서비스 이용하기",
          content:
            "• 대상 게시물 URL 준비\n• 현재 좋아요 수 확인\n• 적정 수량 선택 (기존 좋아요의 2-5배 권장)\n• 주문 완료 후 1-30분 내 시작",
          tip: "너무 많은 좋아요는 부자연스러울 수 있습니다.",
        },
      ],
    },
    {
      id: "youtube-guide",
      title: "YouTube 이용 가이드",
      icon: "📺",
      description:
        "YouTube 조회수, 구독자, 좋아요 서비스 이용 방법을 안내합니다.",
      steps: [
        {
          title: "1. 동영상 공개 설정",
          content:
            '• YouTube Studio 접속\n• 콘텐츠 > 동영상 선택\n• 공개 상태 "공개"로 설정\n• 연령 제한 없음으로 설정\n• 변경사항 저장',
          tip: "비공개나 한정공개 동영상에는 서비스 제공이 불가능합니다.",
        },
        {
          title: "2. 동영상 URL 복사하기",
          content:
            '• 대상 동영상 페이지 이동\n• 주소창에서 URL 복사\n• 또는 "공유" 버튼 > "복사" 클릭\n• 짧은 URL(youtu.be)도 가능',
          tip: "재생목록 URL이 아닌 개별 동영상 URL을 사용하세요!",
        },
        {
          title: "3. 조회수 늘리기",
          content:
            "• 동영상 URL 입력\n• 원하는 조회수 선택\n• 현재 조회수의 2-10배 권장\n• 주문 후 1-6시간 내 시작\n• 자연스러운 속도로 증가",
          tip: "급격한 조회수 증가는 YouTube 정책에 위반될 수 있습니다.",
        },
        {
          title: "4. 구독자 늘리기",
          content:
            "• 채널 URL 준비 (youtube.com/channel/...)\n• 현재 구독자 수 확인\n• 적정 수량 선택\n• 고품질 구독자 제공\n• 30일 리필 보장",
          tip: "꾸준한 컨텐츠 업로드와 함께 이용하면 더욱 효과적입니다.",
        },
      ],
    },
    {
      id: "safety-tips",
      title: "안전한 이용을 위한 팁",
      icon: "🛡️",
      description: "계정 안전과 효과적인 서비스 이용을 위한 중요한 팁들입니다.",
      steps: [
        {
          title: "1. 적정 수량 선택하기",
          content:
            "• 기존 팔로워/좋아요 수의 2-5배 이내 권장\n• 한 번에 너무 많은 수량 주문 금지\n• 계정 규모에 맞는 자연스러운 증가\n• 의심스러운 급증 피하기",
          tip: "자연스러운 성장이 가장 안전합니다!",
        },
        {
          title: "2. 주문 간격 조절하기",
          content:
            "• 연속 주문 시 최소 24시간 간격 유지\n• 다양한 게시물에 분산 주문\n• 한 게시물에 반복 주문 자제\n• 계정별 월 한도 확인",
          tip: "꾸준한 활동과 함께 서비스를 이용하세요.",
        },
        {
          title: "3. 계정 관리하기",
          content:
            "• 정기적인 게시물 업로드\n• 팔로워와의 소통 유지\n• 프로필 정보 완성하기\n• 해시태그 적절히 활용\n• 커뮤니티 가이드라인 준수",
          tip: "활발한 계정 활동이 효과를 극대화합니다.",
        },
        {
          title: "4. 문제 발생 시 대응",
          content:
            "• 즉시 서비스 중단 요청\n• 고객센터에 상황 신고\n• 계정 상태 모니터링\n• 플랫폼 정책 변경 확인\n• 필요시 백업 계정 준비",
          tip: "문제 발생 시 빠른 대응이 중요합니다!",
        },
      ],
    },
    {
      id: "troubleshooting",
      title: "문제 해결",
      icon: "🔧",
      description: "자주 발생하는 문제들과 해결 방법을 안내합니다.",
      steps: [
        {
          title: "1. 서비스가 시작되지 않을 때",
          content:
            "• URL이 올바른지 확인\n• 계정/게시물 공개 설정 확인\n• 24시간 대기 후 문의\n• 고객센터에 주문번호 제공\n• 스크린샷과 함께 문의",
          tip: "대부분 URL 오류나 공개 설정 문제입니다.",
        },
        {
          title: "2. 서비스가 중간에 멈출 때",
          content:
            "• 계정 상태 확인 (정지, 삭제 등)\n• 게시물 삭제/비공개 여부 확인\n• 플랫폼 정책 변경 확인\n• 즉시 고객센터 문의\n• 진행률과 함께 상황 설명",
          tip: "즉시 문의하시면 빠른 해결이 가능합니다.",
        },
        {
          title: "3. 수량이 감소할 때",
          content:
            '• 자연 감소는 정상적인 현상\n• 30일 이내 20% 이상 감소시 리필 가능\n• 주문 내역에서 "리필 요청" 클릭\n• 감소 원인 파악 및 대응\n• 필요시 추가 주문 고려',
          tip: "리필 서비스는 무료로 제공됩니다!",
        },
        {
          title: "4. 계정이 제재받을 때",
          content:
            "• 즉시 모든 서비스 중단\n• 플랫폼 고객센터 문의\n• 제재 사유 파악\n• 이의제기 절차 진행\n• 필요시 법적 조치 고려",
          tip: "안전한 이용 가이드를 준수하면 제재 위험을 줄일 수 있습니다.",
        },
      ],
    },
  ];

  const currentSection = guideSections.find(
    (section) => section.id === activeSection,
  );

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
                📚 이용 가이드
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 안내 메시지 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="text-3xl mr-4">📖</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                INSTAUP 완벽 가이드
              </h2>
              <p className="text-gray-700">
                처음 이용하시는 분부터 고급 사용자까지, 모든 기능을 안전하고
                효과적으로 이용하는 방법을 단계별로 안내합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 사이드바 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">가이드 목록</h3>
              <nav className="space-y-2">
                {guideSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-3 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? "bg-[#22426f] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{section.icon}</span>
                      <div>
                        <div className="font-medium">{section.title}</div>
                        <div
                          className={`text-xs mt-1 ${
                            activeSection === section.id
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {section.steps.length}단계
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>

              {/* 빠른 링크 */}
              <div className="mt-8 pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-3">빠른 링크</h4>
                <div className="space-y-2 text-sm">
                  <button
                    onClick={() => navigate("/addfunds")}
                    className="w-full text-left p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    💰 잔액 충전하기
                  </button>
                  <button
                    onClick={() => navigate("/orders")}
                    className="w-full text-left p-2 text-green-600 hover:bg-green-50 rounded"
                  >
                    📦 주문 내역 보기
                  </button>
                  <button
                    onClick={() => navigate("/faq")}
                    className="w-full text-left p-2 text-purple-600 hover:bg-purple-50 rounded"
                  >
                    ❓ FAQ 보기
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3">
            {currentSection && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                {/* 섹션 헤더 */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <span className="text-4xl mr-4">{currentSection.icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {currentSection.title}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {currentSection.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 진행 표시 */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      진행 상황
                    </span>
                    <span className="text-sm text-gray-500">
                      {currentSection.steps.length}단계
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#22426f] h-2 rounded-full transition-all duration-300"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>

                {/* 단계별 가이드 */}
                <div className="space-y-8">
                  {currentSection.steps.map((step, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#22426f] text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                          {index + 1}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            {step.title}
                          </h3>

                          <div className="text-gray-700 whitespace-pre-line leading-relaxed mb-4">
                            {step.content}
                          </div>

                          {step.tip && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <div className="flex items-start">
                                <span className="text-yellow-600 text-lg mr-2">
                                  💡
                                </span>
                                <div>
                                  <div className="text-sm font-medium text-yellow-800 mb-1">
                                    도움말
                                  </div>
                                  <div className="text-sm text-yellow-700">
                                    {step.tip}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 다음 단계 안내 */}
                <div className="mt-12 pt-8 border-t">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      다음으로 읽어보세요
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {guideSections
                        .filter((section) => section.id !== activeSection)
                        .slice(0, 2)
                        .map((section) => (
                          <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                          >
                            <div className="flex items-center mb-2">
                              <span className="text-2xl mr-3">
                                {section.icon}
                              </span>
                              <div className="font-medium text-gray-900">
                                {section.title}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600">
                              {section.description}
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 고객센터 안내 */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              🤝 추가 도움이 필요하신가요?
            </h2>
            <p className="text-gray-600 mb-6">
              가이드를 따라했는데도 문제가 해결되지 않는다면 언제든지 문의해
              주세요.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors">
                💬 카카오톡 상담
              </button>
              <button
                onClick={() =>
                  (window.location.href = "mailto:support@instaup.kr")
                }
                className="px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                📧 이메일 문의
              </button>
              <button
                onClick={() => navigate("/faq")}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                ❓ FAQ 확인
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              평균 응답시간: 5분 이내 | 고객 만족도: 98.5%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
