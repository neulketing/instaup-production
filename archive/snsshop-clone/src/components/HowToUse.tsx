export default function HowToUse() {
  const steps = [
    {
      number: 1,
      title: '플랫폼 선택',
      description: '인스타그램, 유튜브, 틱톡 등 원하는 플랫폼을 선택하세요.',
      icon: '📱'
    },
    {
      number: 2,
      title: '서비스 선택',
      description: '팔로워, 좋아요, 조회수 등 필요한 서비스를 선택하세요.',
      icon: '⚙️'
    },
    {
      number: 3,
      title: '링크 입력',
      description: '작업할 계정이나 게시물의 링크를 입력하세요.',
      icon: '🔗'
    },
    {
      number: 4,
      title: '결제 및 시작',
      description: '결제 완료 후 30분 이내에 작업이 시작됩니다.',
      icon: '💳'
    }
  ]

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            이용방법
          </h2>
          <p className="text-xl text-gray-600">
            간단한 4단계로 SNS 성장을 시작하세요
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="relative mb-6">
                <div className="bg-[#22426f] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto text-2xl font-bold">
                  {step.number}
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-xl">{step.icon}</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Guide Image */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              인스타그램 링크 찾기 가이드
            </h3>
            <p className="text-gray-600">
              PC와 모바일에서 인스타그램 링크를 찾는 방법을 안내해드립니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">PC에서</h4>
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <img
                  src="https://ext.same-assets.com/3036106235/1679763158.png"
                  alt="PC 가이드"
                  className="w-full h-auto rounded"
                />
              </div>
              <p className="text-sm text-gray-600">
                1. 인스타그램 웹사이트에서 원하는 게시물을 클릭<br/>
                2. 주소창의 URL을 복사하여 붙여넣기
              </p>
            </div>

            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">모바일에서</h4>
              <div className="bg-gray-100 rounded-lg p-4 mb-4 flex justify-center">
                <img
                  src="https://ext.same-assets.com/3036106235/3265459786.png"
                  alt="모바일 가이드"
                  className="h-auto max-w-xs rounded"
                />
              </div>
              <p className="text-sm text-gray-600">
                1. 인스타그램 앱에서 게시물의 공유 버튼 클릭<br/>
                2. "링크 복사"를 선택하여 링크 복사
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            자주 묻는 질문
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3">
                Q. 작업 시작까지 얼마나 걸리나요?
              </h4>
              <p className="text-gray-600">
                결제 완료 후 30분 이내에 작업이 시작됩니다.
                업무시간 외에는 다음 영업일에 시작됩니다.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3">
                Q. 실제 한국인 팔로워인가요?
              </h4>
              <p className="text-gray-600">
                네, 모든 팔로워는 실제 한국인 계정입니다.
                봇이나 가짜 계정은 사용하지 않습니다.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3">
                Q. 환불이 가능한가요?
              </h4>
              <p className="text-gray-600">
                작업 시작 전까지는 100% 환불이 가능합니다.
                작업 시작 후에는 부분 환불이 가능합니다.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3">
                Q. 계정이 차단될 위험은 없나요?
              </h4>
              <p className="text-gray-600">
                안전한 방식으로 작업하여 계정 차단 위험을 최소화합니다.
                만약 문제 발생 시 책임지고 해결해드립니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
