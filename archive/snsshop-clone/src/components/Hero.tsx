interface HeroProps {
  onOrderClick: () => void
}

export default function Hero({ onOrderClick }: HeroProps) {
  return (
    <div className="bg-white py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          {/* Clean Promotion Badge - Toss style */}
          <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl text-sm font-medium mb-8 border border-blue-100">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
            신규 가입 시 10,000원 적립금 + 첫 주문 20% 할인
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
            실제 한국인으로
            <br />
            <span className="text-blue-600">SNS 성장하기</span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-normal">
            INSTAUP과 함께 인스타그램, 유튜브, 틱톡에서
            <br />
            <strong className="text-gray-900">100% 실제 한국인 팔로워</strong>로 계정을 성장시키세요
          </p>

          {/* Toss-style Key Benefits */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-gray-50 px-4 py-3 rounded-2xl">
              <div className="text-sm font-medium text-gray-900">30분 내 시작</div>
              <div className="text-xs text-gray-600 mt-1">즉시 작업 시작</div>
            </div>
            <div className="bg-gray-50 px-4 py-3 rounded-2xl">
              <div className="text-sm font-medium text-gray-900">30일 드롭 보장</div>
              <div className="text-xs text-gray-600 mt-1">안전한 서비스</div>
            </div>
            <div className="bg-gray-50 px-4 py-3 rounded-2xl">
              <div className="text-sm font-medium text-gray-900">수량별 할인</div>
              <div className="text-xs text-gray-600 mt-1">자동 할인 적용</div>
            </div>
            <div className="bg-gray-50 px-4 py-3 rounded-2xl">
              <div className="text-sm font-medium text-gray-900">100% 한국인</div>
              <div className="text-xs text-gray-600 mt-1">실제 계정만</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={onOrderClick}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              지금 시작하기
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-2xl text-lg font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto">
              가격표 보기
            </button>
          </div>

          {/* Clean Features Section - Toss style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded-lg" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">실제 한국인</h3>
              <p className="text-gray-600 text-sm">봇이나 가짜 계정이 아닌 실제 한국인 팔로워</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-green-600 rounded-lg" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">빠른 처리</h3>
              <p className="text-gray-600 text-sm">주문 후 30분 이내에 작업 시작</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-orange-600 rounded-lg" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">안전보장</h3>
              <p className="text-gray-600 text-sm">100% 안전한 서비스와 환불 보장</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
