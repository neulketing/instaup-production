import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { getServicesByPlatform } from "../data/services";
import type { Platform, ServiceItem } from "../types/services";
import ServiceCard from "./ServiceCard";

interface ServiceFolderScrollProps {
  platform: Platform;
  onServiceSelect: (service: ServiceItem) => void;
}

interface ServiceFolder {
  title: string;
  services: ServiceItem[];
  isOpen?: boolean;
}

export default function ServiceFolderScroll({
  platform,
  onServiceSelect,
}: ServiceFolderScrollProps) {
  const allServices = getServicesByPlatform(platform);

  // Group services into folders
  const folders: ServiceFolder[] = [
    {
      title: "🔥 인기 서비스",
      services: allServices.filter((s) => s.isPopular),
    },
    {
      title: "⭐ 추천 서비스",
      services: allServices.filter((s) => s.isRecommended),
    },
    {
      title: "🎁 이벤트 서비스",
      services: allServices.filter((s) => s.isEvent),
    },
    {
      title: "👑 프리미엄 서비스",
      services: allServices.filter(
        (s) => s.quality === "premium" || s.quality === "vip",
      ),
    },
    {
      title: "📦 전체 서비스",
      services: allServices,
    },
  ].filter((folder) => folder.services.length > 0);

  return (
    <div className="space-y-4">
      {folders.map((folder, folderIndex) => (
        <Disclosure key={folderIndex} defaultOpen={folderIndex === 0}>
          {({ open }) => (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <Disclosure.Button className="flex w-full items-center justify-between px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-gray-900">
                    {folder.title}
                  </span>
                  <span className="bg-blue-100 text-blue-600 text-sm px-2 py-1 rounded-full font-medium">
                    {folder.services.length}개
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {open ? (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500 transform transition-transform" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 text-gray-500 transform transition-transform" />
                  )}
                </div>
              </Disclosure.Button>

              <Disclosure.Panel className="px-6 py-4">
                {folder.services.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">📭</div>
                    <p className="text-gray-500">해당 서비스가 없습니다</p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Horizontal Scroll Container */}
                    <div
                      className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#D1D5DB #F3F4F6",
                      }}
                    >
                      {folder.services.map((service) => (
                        <div key={service.id} className="flex-none w-80">
                          <ServiceCard
                            service={service}
                            onSelect={onServiceSelect}
                            variant="compact"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Fade Gradient Overlay for scroll indication */}
                    <div className="absolute top-0 right-0 bottom-4 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                    <div className="absolute top-0 left-0 bottom-4 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                  </div>
                )}
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
      ))}

      {/* Quick Action Buttons */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 선택</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {["팔로워", "좋아요", "조회수", "댓글"].map((quickType, index) => (
            <button
              key={index}
              className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm font-medium text-gray-700 hover:text-blue-600"
              onClick={() => {
                const matchingServices = allServices.filter((s) =>
                  s.name.includes(quickType),
                );
                if (matchingServices.length > 0) {
                  onServiceSelect(matchingServices[0]);
                }
              }}
            >
              {quickType} 서비스
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
