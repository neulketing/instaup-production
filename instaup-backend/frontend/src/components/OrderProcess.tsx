import { useEffect, useState } from "react";
import type { Platform, ServiceItem } from "../types/services";
import type { UserSession } from "../utils/auth";

interface OrderProcessProps {
  userSession: UserSession | null;
  onAuth: (mode: "signin" | "signup") => void;
  onShowRecharge: () => void;
  onOrder: (orderData: {
    service: ServiceItem;
    targetUrl: string;
    quantity: number;
    totalPrice: number;
  }) => void;
}

// API 서비스 클래스 추가
class ProductAPI {
  private static baseURL =
    import.meta.env.VITE_BACKEND_API_URL ||
    "https://instaup-production.up.railway.app";

  static async getProducts(filters?: {
    category?: string;
    platform?: string;
    search?: string;
    page?: number;
    limit?: number;
    isActive?: boolean;
  }) {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.platform) params.append("platform", filters.platform);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.isActive !== undefined)
      params.append("isActive", filters.isActive.toString());

    const response = await fetch(
      `${this.baseURL}/api/admin/products?${params}`,
    );
    return response.json();
  }
}

// 백엔드 Product 타입을 ServiceItem으로 변환하는 함수
const convertProductToServiceItem = (product: any): ServiceItem => {
  return {
    id: product.id,
    platform: product.platform as Platform,
    category: product.category,
    name: product.name,
    description: product.description,
    price: product.price,
    minOrder: product.minOrder,
    maxOrder: product.maxOrder,
    deliveryTime: product.deliveryTime,
    quality: product.quality,
    unit: product.unit || "개",
    isPopular: product.isPopular,
    features: product.features || [],
  };
};

export default function OrderProcess({
  userSession,
  onAuth,
  onShowRecharge,
  onOrder,
}: OrderProcessProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null,
  );
  const [selectedAccountType, setSelectedAccountType] = useState<
    "korean" | "foreign"
  >("korean");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    null,
  );
  const [targetUrl, setTargetUrl] = useState("");
  const [quantity, setQuantity] = useState(100);
  const [isLoading, setIsLoading] = useState(false);

  // 백엔드에서 가져온 서비스 데이터
  const [allServices, setAllServices] = useState<ServiceItem[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  // 서비스 데이터 로드
  const loadServices = async () => {
    try {
      setServicesLoading(true);
      const response = await ProductAPI.getProducts({
        isActive: true, // 활성화된 상품만 가져오기
        limit: 1000, // 충분한 수량
      });

      if (response.success && response.data.products) {
        const serviceItems = response.data.products.map(
          convertProductToServiceItem,
        );
        setAllServices(serviceItems);
      }
    } catch (error) {
      console.error("서비스 데이터 로드 실패:", error);
      // 오류 시 샘플 데이터 사용 (백엔드 연결 문제 시)
      const sampleServices: ServiceItem[] = [
        {
          id: 'instagram_21',
          platform: 'instagram',
          category: 'followers',
          name: '인스타 실제 한국 팔로워',
          description: '100% 실제 활동하는 한국인 유저들이 인스타 공식앱을 통해 직접 방문하여 팔로우를 눌러드리는 방식으로 안전하게 진행됩니다.',
          price: 180,
          minOrder: 20,
          maxOrder: 3000000,
          deliveryTime: '1~6시간',
          quality: 'premium',
          unit: '개',
          isPopular: true,
          features: ['실제 한국인', '30일 AS', '안전한 방식', '프리미엄 품질'],
        },
        {
          id: 'instagram_56',
          platform: 'instagram',
          category: 'likes',
          name: '인스타 좋아요',
          description: '인스타그램 게시물의 좋아요를 자연스럽게 증가시켜드립니다.',
          price: 15,
          minOrder: 10,
          maxOrder: 50000,
          deliveryTime: '1~30분',
          quality: 'premium',
          unit: '개',
          isPopular: true,
          features: ['빠른 시작', '30일 AS', '안전한 방식', '자연스러운 증가'],
        },
        {
          id: 'youtube_01',
          platform: 'youtube',
          category: 'subscribers',
          name: '유튜브 구독자',
          description: '유튜브 채널의 구독자를 늘려드립니다.',
          price: 25,
          minOrder: 10,
          maxOrder: 100000,
          deliveryTime: '1~24시간',
          quality: 'premium',
          unit: '명',
          isPopular: true,
          features: ['실제 유저', '안전한 방식', '빠른 시작', '고품질'],
        },
        {
          id: 'tiktok_01',
          platform: 'tiktok',
          category: 'followers',
          name: '틱톡 팔로워',
          description: '틱톡 계정의 팔로워를 늘려드립니다.',
          price: 30,
          minOrder: 20,
          maxOrder: 50000,
          deliveryTime: '1~24시간',
          quality: 'premium',
          unit: '명',
          isPopular: false,
          features: ['실제 유저', '안전한 방식', '고품질', '빠른 시작'],
        },
        {
          id: 'twitter_01',
          platform: 'twitter',
          category: 'followers',
          name: '트위터 팔로워',
          description: '트위터 계정의 팔로워를 늘려드립니다.',
          price: 35,
          minOrder: 10,
          maxOrder: 50000,
          deliveryTime: '1~24시간',
          quality: 'standard',
          unit: '명',
          isPopular: false,
          features: ['실제 유저', '안전한 방식', '빠른 시작'],
        },
        {
          id: 'facebook_01',
          platform: 'facebook',
          category: 'likes',
          name: '페이스북 좋아요',
          description: '페이스북 게시물의 좋아요를 늘려드립니다.',
          price: 20,
          minOrder: 10,
          maxOrder: 10000,
          deliveryTime: '1~24시간',
          quality: 'standard',
          unit: '개',
          isPopular: false,
          features: ['실제 유저', '안전한 방식'],
        }
      ];
      setAllServices(sampleServices);
    } finally {
      setServicesLoading(false);
    }
  };

  // 컴포넌트 마운트시 서비스 데이터 로드
  useEffect(() => {
    loadServices();
  }, []);

  // 할인율 계산 (수량에 따라 최대 15% 할인)
  const calculateDiscount = (quantity: number): number => {
    if (quantity >= 10000) return 15;
    if (quantity >= 5000) return 12;
    if (quantity >= 2000) return 10;
    if (quantity >= 1000) return 8;
    if (quantity >= 500) return 5;
    if (quantity >= 200) return 3;
    return 0;
  };

  // 총 가격 계산
  const calculateTotalPrice = (): number => {
    if (!selectedService) return 0;
    const basePrice = (selectedService.price * quantity) / 100;
    const discountRate = calculateDiscount(quantity);
    return Math.round(basePrice * (1 - discountRate / 100));
  };

  // 플랫폼별 서비스 필터링
  const getServicesByPlatform = (platform: Platform | null) => {
    if (!platform) return [];
    return allServices.filter((s) => s.platform === platform);
  };

  // 카테고리별 서비스 분류
  const getServicesByCategory = () => {
    const platformServices = getServicesByPlatform(selectedPlatform);

    const categories = {
      followers: platformServices.filter((s) => s.category === "followers"),
      likes: platformServices.filter((s) => s.category === "likes"),
      comments: platformServices.filter((s) => s.category === "comments"),
      views: platformServices.filter((s) => s.category === "views"),
      subscribers: platformServices.filter((s) => s.category === "subscribers"),
      reels_views: platformServices.filter((s) => s.category === "reels_views"),
      story_views: platformServices.filter((s) => s.category === "story_views"),
      comment_likes: platformServices.filter(
        (s) => s.category === "comment_likes",
      ),
      page_likes: platformServices.filter((s) => s.category === "page_likes"),
      retweets: platformServices.filter((s) => s.category === "retweets"),
    };

    return categories;
  };

  // 서비스 선택 처리
  const handleServiceSelect = (service: ServiceItem) => {
    setSelectedService(service);
    setQuantity(service.minOrder);
    setCurrentStep(3); // step 2에서 서비스 선택 시 step 3으로 이동
  };

  // 다음 단계로 이동 (현재 사용하지 않음)
  const handleNext = () => {
    // 현재 단계별 직접 이동으로 대체됨
  };

  // 이전 단계로 이동
  const handlePrev = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);

      // 이전 단계로 갈 때 해당 단계의 선택 상태 초기화
      if (newStep === 1) {
        // 1단계로 돌아가면 모든 선택 초기화
        setSelectedPlatform(null);
        setSelectedAccountType("korean");
        setSelectedService(null);
        setTargetUrl("");
        setQuantity(100);
      } else if (newStep === 2) {
        // 2단계로 돌아가면 서비스 선택 이후 초기화
        setSelectedService(null);
        setTargetUrl("");
        setQuantity(100);
      } else if (newStep === 3) {
        // 3단계로 돌아가면 주문 정보만 초기화
        setTargetUrl("");
        setQuantity(100);
      }
    }
  };

  // 주문 제출
  const handleSubmit = async () => {
    if (!selectedService || !userSession) {
      onAuth("signin");
      return;
    }

    if (!targetUrl || quantity < (selectedService.minOrder || 0)) {
      return;
    }

    setIsLoading(true);
    try {
      await onOrder({
        service: selectedService,
        targetUrl,
        quantity,
        totalPrice: calculateTotalPrice(),
      });
      // 주문 성공 후 초기화 (1단계로 돌아가기)
      setCurrentStep(1);
      setSelectedService(null);
      setTargetUrl("");
      setQuantity(100);
    } catch (error) {
      console.error("주문 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 플랫폼 선택시 자동으로 다음 단계로 이동
  useEffect(() => {
    if (selectedPlatform && currentStep === 1) {
      setCurrentStep(2);
    }
  }, [selectedPlatform, currentStep]);

  const categories = getServicesByCategory();

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="sticky top-0 bg-[#22426f] text-white p-6 shadow-lg z-10">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-4">
            <img
              src="https://ext.same-assets.com/3036106235/246958056.svg"
              alt="InstaUp"
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-2xl font-bold">주문하기</h1>
              <p className="text-sm opacity-90">
                실제 한국인 SNS 마케팅 서비스
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 진행 단계 표시 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            {[
              { num: "01", title: "이용하실 서비스 유형을 선택해 주세요." },
              { num: "02", title: "세부 서비스를 선택해주세요." },
              { num: "03", title: "구매하실 상품을 선택해 주세요." },
            ].map((step, index) => (
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
                    {currentStep > index + 1 ? "✓" : step.num}
                  </div>
                  <div
                    className={`text-xs mt-2 font-medium text-center max-w-[200px] ${
                      currentStep >= index + 1
                        ? "text-[#22426f]"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </div>
                </div>
                {index < 2 && (
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

      {/* 메인 콘텐츠 */}
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          {/* Step 1: 플랫폼 선택 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#22426f] to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    01
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    이용하실 서비스 유형을 선택해 주세요.
                  </h2>
                </div>
              </div>

              {/* 플랫폼 그리드 */}
              <div className="grid grid-cols-6 gap-4">
                {[
                  {
                    icon: "⭐",
                    name: "추천서비스",
                    platform: null,
                    active: false,
                  },
                  { icon: "🎁", name: "이벤트", platform: null, active: false },
                  {
                    icon: "👑",
                    name: "상위노출",
                    platform: null,
                    active: false,
                  },
                  {
                    icon: "📊",
                    name: "계정관리",
                    platform: null,
                    active: false,
                  },
                  { icon: "📦", name: "패키지", platform: null, active: false },
                  {
                    icon: "📷",
                    name: "인스타그램",
                    platform: "instagram" as Platform,
                    active: true,
                  },
                  {
                    icon: "🎥",
                    name: "유튜브",
                    platform: "youtube" as Platform,
                    active: true,
                  },
                  {
                    icon: "📘",
                    name: "페이스북",
                    platform: "facebook" as Platform,
                    active: true,
                  },
                  {
                    icon: "🎵",
                    name: "틱톡",
                    platform: "tiktok" as Platform,
                    active: true,
                  },
                  { icon: "🔗", name: "스레드", platform: null, active: false },
                  {
                    icon: "🐦",
                    name: "트위터",
                    platform: "twitter" as Platform,
                    active: true,
                  },
                  { icon: "📌", name: "Nz로블", platform: null, active: false },
                  {
                    icon: "📈",
                    name: "뉴스언론보도",
                    platform: null,
                    active: false,
                  },
                  { icon: "🎬", name: "채널단", platform: null, active: false },
                  { icon: "📺", name: "카카오", platform: null, active: false },
                  {
                    icon: "🎭",
                    name: "스토어마케팅",
                    platform: null,
                    active: false,
                  },
                  {
                    icon: "🎯",
                    name: "어플마케팅",
                    platform: null,
                    active: false,
                  },
                  {
                    icon: "⚙️",
                    name: "SEO트래픽",
                    platform: null,
                    active: false,
                  },
                  { icon: "🔧", name: "기타", platform: null, active: false },
                ].map((platformData, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (platformData.active && platformData.platform) {
                        console.log(
                          "플랫폼 선택 버튼 클릭:",
                          platformData.platform,
                        );
                        setSelectedPlatform(platformData.platform);
                      }
                    }}
                    disabled={!platformData.active}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      platformData.active
                        ? selectedPlatform === platformData.platform
                          ? "border-blue-500 bg-blue-100 ring-2 ring-blue-200"
                          : "border-blue-500 bg-blue-50 hover:bg-blue-100"
                        : "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="text-2xl mb-2">{platformData.icon}</div>
                    <div className="text-sm font-medium">
                      {platformData.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: 세부 서비스를 선택해주세요 (애플 스타일) */}
          {currentStep === 2 && (
            <div className="space-y-12">
              {/* 헤더 - 애플 스타일 */}
              <div className="text-center">
                <h2 className="text-3xl font-light text-gray-900 mb-2">
                  세부 서비스를 선택해주세요
                </h2>
                <p className="text-lg text-gray-500">
                  원하시는 서비스를 선택하시면 바로 다음 단계로 진행됩니다
                </p>
              </div>

              {/* 로딩 상태 */}
              {servicesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-[#22426f] border-t-transparent rounded-full"></div>
                  <span className="ml-3 text-gray-600">서비스 로딩 중...</span>
                </div>
              ) : allServices.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    등록된 서비스가 없습니다
                  </h3>
                  <p className="text-gray-500">
                    관리자가 서비스를 추가할 때까지 기다려주세요.
                  </p>
                </div>
              ) : (
                <>
                  {/* 한국인/외국인 선택 - 애플 스타일 */}
                  <div className="flex items-center justify-center">
                    <div className="bg-gray-100 rounded-full p-1 flex">
                      <button
                        onClick={() => setSelectedAccountType("korean")}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          selectedAccountType === "korean"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        🇰🇷 한국인
                      </button>
                      <button
                        onClick={() => setSelectedAccountType("foreign")}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          selectedAccountType === "foreign"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        🌍 외국인
                      </button>
                    </div>
                  </div>

                  {/* 서비스 목록 - 애플 스타일 단순 리스트 */}
                  <div className="max-w-2xl mx-auto">
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                      {/* 팔로워/구독자 서비스 */}
                      {[...categories.followers, ...categories.subscribers].map(
                        (service, index) => (
                          <button
                            key={service.id}
                            onClick={() => handleServiceSelect(service)}
                            className={`w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors ${
                              index !==
                              [
                                ...categories.followers,
                                ...categories.subscribers,
                              ].length -
                                1
                                ? "border-b border-gray-100"
                                : ""
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm">👥</span>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {service.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {service.price.toLocaleString()}원 /{" "}
                                    {service.unit}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {service.isPopular && (
                                  <span className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-full font-medium">
                                    인기
                                  </span>
                                )}
                                <svg
                                  className="w-5 h-5 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </div>
                            </div>
                          </button>
                        ),
                      )}

                      {/* 좋아요 서비스 */}
                      {categories.likes.map((service, index) => (
                        <button
                          key={service.id}
                          onClick={() => handleServiceSelect(service)}
                          className={`w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors ${
                            index !== categories.likes.length - 1 ||
                            [...categories.views, ...categories.reels_views]
                              .length > 0
                              ? "border-b border-gray-100"
                              : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-sm">❤️</span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {service.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {service.price.toLocaleString()}원 /{" "}
                                  {service.unit}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {service.isPopular && (
                                <span className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-full font-medium">
                                  인기
                                </span>
                              )}
                              <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>
                        </button>
                      ))}

                      {/* 조회수 서비스 */}
                      {[...categories.views, ...categories.reels_views].map(
                        (service, index) => (
                          <button
                            key={service.id}
                            onClick={() => handleServiceSelect(service)}
                            className={`w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors ${
                              index !==
                              [...categories.views, ...categories.reels_views]
                                .length -
                                1
                                ? "border-b border-gray-100"
                                : ""
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm">👁️</span>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {service.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {service.price.toLocaleString()}원 /{" "}
                                    {service.unit}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {service.isPopular && (
                                  <span className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-full font-medium">
                                    인기
                                  </span>
                                )}
                                <svg
                                  className="w-5 h-5 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </div>
                            </div>
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* 뒤로가기 버튼 - 애플 스타일 */}
              <div className="text-center">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  ← 다른 플랫폼 선택하기
                </button>
              </div>
            </div>
          )}

          {/* Step 3: 주문 정보 입력 */}
          {currentStep === 3 && selectedService && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#22426f] to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    03
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    구매하실 상품을 선택해 주세요.
                  </h2>
                </div>
              </div>

              {/* 선택된 서비스 정보 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-2">
                  📋 선택된 서비스
                </h3>
                <p className="text-blue-700 font-medium">
                  {selectedService.name}
                </p>
                <div className="flex gap-4 mt-3 text-sm">
                  <span className="bg-white px-3 py-1 rounded-full">
                    가격: {selectedService.price.toLocaleString()}원/1개
                  </span>
                  <span className="bg-white px-3 py-1 rounded-full">
                    처리시간: {selectedService.deliveryTime}
                  </span>
                </div>
              </div>

              {/* 드롭다운에서 서비스 선택 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <label className="block text-lg font-bold text-gray-900 mb-4">
                  서비스 선택 <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedService.id}
                  onChange={(e) => {
                    const service = allServices.find(
                      (s) => s.id === e.target.value,
                    );
                    if (service) {
                      setSelectedService(service);
                      setQuantity(service.minOrder);
                    }
                  }}
                  className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#22426f] focus:ring-4 focus:ring-blue-100 transition-all"
                >
                  {getServicesByPlatform(selectedPlatform).map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ₩{service.price.toLocaleString()} [1개당]
                    </option>
                  ))}
                </select>
              </div>

              {/* URL 입력 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <label className="block text-lg font-bold text-gray-900 mb-4">
                  {selectedService.category === "followers" ||
                  selectedService.category === "subscribers"
                    ? `📎 ${selectedPlatform === "youtube" ? "채널 URL" : "계정 URL"}`
                    : `📎 ${
                        selectedPlatform === "youtube"
                          ? "영상 URL"
                          : selectedPlatform === "twitter"
                            ? "트윗 URL"
                            : selectedPlatform === "facebook"
                              ? "게시물 URL"
                              : selectedPlatform === "tiktok"
                                ? "영상 URL"
                                : "게시물 URL"
                      }`}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder={
                    selectedService.category === "followers" ||
                    selectedService.category === "subscribers"
                      ? selectedPlatform === "youtube"
                        ? "https://youtube.com/@채널이름"
                        : selectedPlatform === "twitter"
                          ? "https://twitter.com/사용자이름"
                          : selectedPlatform === "tiktok"
                            ? "https://tiktok.com/@사용자이름"
                            : "@사용자이름 또는 프로필 URL"
                      : selectedPlatform === "youtube"
                        ? "https://youtube.com/watch?v=XXXXXXXXX"
                        : selectedPlatform === "twitter"
                          ? "https://twitter.com/username/status/XXXXXXXXX"
                          : selectedPlatform === "tiktok"
                            ? "https://tiktok.com/@username/video/XXXXXXXXX"
                            : "게시물 URL을 입력하세요"
                  }
                  className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#22426f] focus:ring-4 focus:ring-blue-100 transition-all"
                  required
                />
              </div>

              {/* 수량 입력 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <label className="block text-lg font-bold text-gray-900 mb-4">
                  📊 주문 수량 <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      setQuantity(
                        Math.max(selectedService.minOrder, quantity - 100),
                      )
                    }
                    className="w-12 h-12 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-center font-bold text-lg"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(
                          selectedService.minOrder,
                          Number.parseInt(e.target.value) || 0,
                        ),
                      )
                    }
                    min={selectedService.minOrder}
                    max={selectedService.maxOrder}
                    className="flex-1 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#22426f] focus:ring-4 focus:ring-blue-100 transition-all text-center text-lg font-bold"
                  />
                  <button
                    onClick={() =>
                      setQuantity(
                        Math.min(selectedService.maxOrder, quantity + 100),
                      )
                    }
                    className="w-12 h-12 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-center font-bold text-lg"
                  >
                    +
                  </button>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>
                    최소: {selectedService.minOrder.toLocaleString()}개
                  </span>
                  <span>
                    최대: {selectedService.maxOrder.toLocaleString()}개
                  </span>
                </div>
              </div>

              {/* 할인 및 총 가격 */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-green-900 mb-4">
                  💰 주문 금액
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>기본 가격:</span>
                    <span>
                      ₩
                      {(
                        (selectedService.price * quantity) /
                        100
                      ).toLocaleString()}
                    </span>
                  </div>
                  {calculateDiscount(quantity) > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>할인 ({calculateDiscount(quantity)}%):</span>
                      <span>
                        -₩
                        {(
                          ((selectedService.price * quantity) / 100) *
                          (calculateDiscount(quantity) / 100)
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold text-green-900">
                    <span>총 결제 금액:</span>
                    <span>₩{calculateTotalPrice().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* 주문 실행 버튼 */}
              <div className="flex gap-4">
                <button
                  onClick={handlePrev}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ← 이전 단계
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    !targetUrl ||
                    quantity < selectedService.minOrder ||
                    isLoading
                  }
                  className="flex-1 bg-gradient-to-r from-[#22426f] to-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:from-[#1e3b61] hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? "주문 처리중..."
                    : `₩${calculateTotalPrice().toLocaleString()} 주문하기`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
