import { useState } from "react";
import { getServicesByPlatform, servicesData } from "../data/services";
import type { Platform, ServiceItem } from "../types/services";
import type { UserSession } from "../utils/auth";

interface ServiceListProps {
  selectedPlatform: Platform;
  onServiceSelect: (service: ServiceItem) => void;
  userSession: UserSession | null;
  onAuth: (mode: "signin" | "signup") => void;
}

export default function ServiceList({
  selectedPlatform,
  onServiceSelect,
  userSession,
  onAuth,
}: ServiceListProps) {
  const [filter, setFilter] = useState<
    "all" | "popular" | "recommended" | "event"
  >("all");

  let services = getServicesByPlatform(selectedPlatform);

  // 필터 적용
  if (filter === "popular") {
    services = services.filter((s) => s.isPopular);
  } else if (filter === "recommended") {
    services = services.filter((s) => s.isRecommended);
  } else if (filter === "event") {
    services = services.filter((s) => s.isEvent);
  }

  return (
    <div className="space-y-6">
      {/* 필터 버튼 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-[#22426f] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          전체
        </button>
        <button
          onClick={() => setFilter("popular")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === "popular"
              ? "bg-[#22426f] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          인기
        </button>
        <button
          onClick={() => setFilter("recommended")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === "recommended"
              ? "bg-[#22426f] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          추천
        </button>
        <button
          onClick={() => setFilter("event")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === "event"
              ? "bg-[#22426f] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          이벤트
        </button>
      </div>

      {/* 서비스 목록 */}
      {services.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">😔</div>
          <p className="text-gray-500">해당하는 서비스가 없습니다</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-all cursor-pointer"
              onClick={() => onServiceSelect(service)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {service.name}
                    </h4>

                    {/* 배지들 */}
                    <div className="flex gap-1">
                      {service.isPopular && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                          인기
                        </span>
                      )}
                      {service.isRecommended && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
                          추천
                        </span>
                      )}
                      {service.isEvent && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full font-medium">
                          이벤트
                        </span>
                      )}
                      {service.quality === "premium" && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full font-medium">
                          프리미엄
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">
                    {service.description}
                  </p>

                  {/* 특징 */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        ✓ {feature}
                      </span>
                    ))}
                    {service.features.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{service.features.length - 3}개 더
                      </span>
                    )}
                  </div>

                  {/* 주문 정보 */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>최소: {service.minOrder.toLocaleString()}개</span>
                    <span>최대: {service.maxOrder.toLocaleString()}개</span>
                    <span>배송: {service.deliveryTime}</span>
                  </div>
                </div>

                {/* 가격 */}
                <div className="text-right ml-4">
                  {service.originalPrice && service.discount ? (
                    <div>
                      <div className="text-sm text-gray-400 line-through">
                        {service.originalPrice.toLocaleString()}원
                      </div>
                      <div className="text-lg font-bold text-[#22426f]">
                        {service.price.toLocaleString()}원
                      </div>
                      <div className="text-sm text-red-600 font-medium">
                        {service.discount}% 할인
                      </div>
                    </div>
                  ) : (
                    <div className="text-lg font-bold text-[#22426f]">
                      {service.price.toLocaleString()}원
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">100개당</div>
                </div>
              </div>

              {/* 경고 메시지 */}
              {service.warningNote && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ {service.warningNote}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
