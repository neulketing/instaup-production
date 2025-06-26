interface Platform {
  id: string
  name: string
  icon: string
  services: string[]
  isPopular?: boolean
  isNew?: boolean
  isSpecial?: boolean
  description: string
  startingPrice: string
}

const platforms: Platform[] = [
  {
    id: 'instagram',
    name: '인스타그램',
    icon: 'https://ext.same-assets.com/3036106235/3453187750.svg',
    services: ['한국인 팔로워', '한국인 좋아요', '조회수', '댓글'],
    isPopular: true,
    description: '국내 1위 인스타그램 성장 서비스',
    startingPrice: '80원부터'
  },
  {
    id: 'youtube',
    name: '유튜브',
    icon: 'https://ext.same-assets.com/3036106235/918703132.svg',
    services: ['한국인 구독자', '조회수', '좋아요', '댓글'],
    description: '유튜브 알고리즘 최적화',
    startingPrice: '25원부터'
  },
  {
    id: 'tiktok',
    name: '틱톡',
    icon: 'https://ext.same-assets.com/3036106235/3392181185.svg',
    services: ['팔로워', '좋아요', '조회수', '공유'],
    description: '바이럴 효과 극대화',
    startingPrice: '20원부터'
  },
  {
    id: 'facebook',
    name: '페이스북',
    icon: 'https://ext.same-assets.com/3036106235/1032565564.svg',
    services: ['페이지 좋아요', '팔로워', '공유', '댓글'],
    description: '페이스북 마케팅 솔루션',
    startingPrice: '90원부터'
  },
  {
    id: 'twitter',
    name: 'X (트위터)',
    icon: 'https://ext.same-assets.com/3036106235/578974085.svg',
    services: ['팔로워', '좋아요', '리트윗', '조회수'],
    description: 'X 플랫폼 영향력 확대',
    startingPrice: '100원부터'
  },
  {
    id: 'threads',
    name: '스레드',
    icon: 'https://ext.same-assets.com/3036106235/1028841693.svg',
    services: ['팔로워', '좋아요', '조회수'],
    isNew: true,
    description: '메타의 새로운 SNS',
    startingPrice: '110원부터'
  },
  {
    id: 'naver',
    name: '네이버',
    icon: 'https://ext.same-assets.com/3036106235/1521804435.svg',
    services: ['플레이스 마케팅', '블로그 방문자', '쇼핑 클릭', '지식인 추천', '카페 가입', '뉴스 조회수'],
    description: '네이버 SEO 및 마케팅',
    startingPrice: '10원부터',
    isPopular: true
  },
  {
    id: 'kakao',
    name: '카카오',
    icon: 'https://ext.same-assets.com/3036106235/4075293063.svg',
    services: ['스토리 좋아요', '채널 구독'],
    description: '카카오 플랫폼 마케팅',
    startingPrice: '60원부터'
  },
  {
    id: 'special',
    name: '🎁 패키지',
    icon: 'https://ext.same-assets.com/3036106235/1341349194.svg',
    services: ['통합 마케팅', '맞춤 패키지', '할인 혜택'],
    description: '여러 플랫폼 통합 할인',
    startingPrice: '상담 후 결정',
    isSpecial: true
  }
]

interface PlatformGridProps {
  onOrderClick: () => void
  onPlatformOrderClick: (platform: string) => void
}

export default function PlatformGrid({ onOrderClick, onPlatformOrderClick }: PlatformGridProps) {
  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            다양한 플랫폼 지원
          </h2>
          <p className="text-lg text-gray-600">
            인기 있는 모든 소셜미디어 플랫폼에서 성장하세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className={`relative bg-white border rounded-3xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer ${
                platform.isSpecial
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              {/* Clean badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-1">
                {platform.isPopular && (
                  <div className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                    인기
                  </div>
                )}
                {platform.isNew && (
                  <div className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                    NEW
                  </div>
                )}
                {platform.isSpecial && (
                  <div className="bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
                    특가
                  </div>
                )}
              </div>

              {/* 플랫폼 헤더 */}
              <div className="flex items-center mb-4">
                <div className="relative">
                  <img
                    src={platform.icon}
                    alt={platform.name}
                    className="w-14 h-14"
                  />
                  {platform.isSpecial && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" />
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className={`text-xl font-bold ${platform.isSpecial ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent' : 'text-gray-900'}`}>
                    {platform.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{platform.description}</p>
                </div>
              </div>

              {/* 서비스 목록 */}
              <div className="space-y-2 mb-4">
                {platform.services.slice(0, 4).map((service) => (
                  <div
                    key={service}
                    className="flex items-center text-gray-600"
                  >
                    <span className={`w-2 h-2 rounded-full mr-3 ${platform.isSpecial ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-blue-500'}`} />
                    <span className="text-sm">{service}</span>
                  </div>
                ))}
                {platform.services.length > 4 && (
                  <div className="text-xs text-gray-400 ml-5">
                    +{platform.services.length - 4}개 서비스 더보기
                  </div>
                )}
              </div>

              {/* 가격 정보 */}
              <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">시작 가격</span>
                  <span className={`font-bold ${platform.isSpecial ? 'text-purple-600 text-lg' : 'text-[#22426f]'}`}>
                    {platform.startingPrice}
                  </span>
                </div>
                {platform.isSpecial && (
                  <div className="text-xs text-purple-600 mt-1">
                    💰 최대 30% 할인 혜택
                  </div>
                )}
              </div>

              {/* Platform-specific order button */}
              <button
                onClick={() => onPlatformOrderClick(platform.name)}
                className={`w-full py-3 rounded-2xl font-medium transition-colors ${
                  platform.isSpecial
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {platform.isSpecial ? '특가 상담받기' : `${platform.name} 주문하기`}
              </button>
            </div>
          ))}
        </div>

        {/* Clean Call to Action */}
        <div className="text-center mt-20">
          <div className="bg-white rounded-3xl p-12 border border-gray-200">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              지금 바로 시작하세요
            </h3>
            <p className="text-gray-600 mb-8">
              30분 이내 작업 시작으로 빠른 성장을 경험해보세요
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-medium hover:bg-blue-700 transition-colors">
              무료 상담받기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
