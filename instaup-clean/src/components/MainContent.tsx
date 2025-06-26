import type { ServiceItem } from "../types/services";
import type { UserSession } from "../utils/auth";
import ServicesSection from "./ServicesSection";

interface MainContentProps {
  userSession: UserSession | null;
  onServiceSelect: (service: ServiceItem) => void;
  onAuth: (mode: "signin" | "signup") => void;
  onShowRecharge: () => void;
}

export default function MainContent({
  userSession,
  onServiceSelect,
  onAuth,
  onShowRecharge,
}: MainContentProps) {
  return (
    <div className="h-full bg-white">
      {/* 헤더 영역 */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            실제 한국인 SNS 마케팅을 원한다면?
          </h1>
          <p className="text-lg text-gray-600">원하는 플랫폼을 선택해주세요.</p>
        </div>
      </div>

      {/* 간소화된 소개 */}
      <div className="p-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-600 mb-6">
            아래 탭에서 플랫폼을 선택하고, 다양한 보기 모드로 서비스를
            탐색해보세요.
          </p>
        </div>

        {/* 새로운 서비스 섹션 */}
        <div className="mt-8">
          <ServicesSection
            userSession={userSession}
            onServiceSelect={onServiceSelect}
            onAuth={onAuth}
          />
        </div>

        {/* Instagram 프리미엄 팔로워 업그레이드 - 할인율 표시 */}
        <div className="mt-6">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">🔥</span>
                  <h4 className="text-lg font-bold text-gray-900">
                    Instagram 프리미엄 팔로워 업그레이드
                  </h4>
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    할인
                  </span>
                </div>

                <p className="text-gray-600 mb-3">
                  고품질 한국인 팔로워로 업그레이드하고 더 나은 결과를
                  경험하세요
                </p>

                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold text-[#22426f]">
                    +{(206250).toLocaleString()}원 예상
                  </div>
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    15% 할인 적용
                  </div>
                </div>
              </div>

              <button className="px-6 py-3 bg-[#22426f] text-white rounded-lg hover:bg-[#1a365d] transition-colors font-medium">
                업그레이드
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
