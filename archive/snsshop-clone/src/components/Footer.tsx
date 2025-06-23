import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Logo className="mb-6" />
            <p className="text-gray-600 mb-6 leading-relaxed">
              실제 한국인 팔로워로 SNS 성장을 도와드리는 전문 서비스입니다.
              안전하고 빠른 서비스로 여러분의 소셜미디어 성장을 지원합니다.
            </p>

            <div className="space-y-1 text-sm text-gray-500">
              <p>서울시 강남구 테헤란로 195, SK T타워 13F</p>
              <p>사업자등록번호: 813-87-01236</p>
              <p>통신판매업신고: 2019-서울강남-1344</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">빠른 링크</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">주문하기</a></li>
              <li><a href="/guide" className="text-gray-600 hover:text-blue-600 transition-colors">서비스 안내</a></li>
              <li><a href="/faq" className="text-gray-600 hover:text-blue-600 transition-colors">자주 묻는 질문</a></li>
              <li><a href="/orders" className="text-gray-600 hover:text-blue-600 transition-colors">주문 관리</a></li>
              <li><a href="/addfunds" className="text-gray-600 hover:text-blue-600 transition-colors">충전하기</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">고객지원</h4>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-2xl border border-gray-200">
                <p className="text-sm font-medium text-gray-900">전화 상담</p>
                <a href="tel:1877-6533" className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
                  1877-6533
                </a>
                <p className="text-xs text-gray-500 mt-1">평일 10:30 ~ 18:30</p>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-gray-200">
                <p className="text-sm font-medium text-gray-900">이메일</p>
                <a href="mailto:cs@instaup.kr" className="text-blue-600 hover:text-blue-700 transition-colors font-medium text-sm">
                  cs@instaup.kr
                </a>
                <p className="text-xs text-gray-500 mt-1">24시간 접수</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <a
                href="https://pf.kakao.com/_xfTmtd/friend"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-yellow-400 text-black px-4 py-3 rounded-2xl hover:bg-yellow-500 transition-all hover:scale-105 font-medium"
              >
                <img
                  src="https://ext.same-assets.com/3036106235/748745620.svg"
                  alt="카카오톡"
                  className="w-5 h-5 mr-2"
                />
                카카오톡 1:1 상담
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="text-sm text-gray-500">
              © 2024 INSTAUP. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-4 md:justify-end">
              <a href="/privacy" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                개인정보처리방침
              </a>
              <a href="/terms" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                이용약관
              </a>
              <a href="/refund" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                환불정책
              </a>
            </div>
          </div>
        </div>

        {/* Notice - Toss Style */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <div className="flex items-start">
            <div className="w-5 h-5 bg-blue-600 rounded-lg flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              <span className="text-white text-xs">ℹ️</span>
            </div>
            <p className="text-xs text-blue-800 leading-relaxed">
              본 서비스는 소셜미디어 마케팅 목적으로만 사용되어야 하며, 불법적인 용도로 사용할 수 없습니다.
              실제 한국인 계정을 통한 자연스러운 성장을 보장하며, 플랫폼 정책을 준수하여 안전하게 서비스를 제공합니다.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
