import { Tab } from "@headlessui/react";
import {
  FolderIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { getServicesByPlatform } from "../data/services";
import type { Platform, ServiceItem } from "../types/services";
import type { UserSession } from "../utils/auth";
import ServiceCard from "./ServiceCard";
import ServiceFolderScroll from "./ServiceFolderScroll";
import ServiceTabs from "./ServiceTabs";

interface ServicesSectionProps {
  userSession: UserSession | null;
  onServiceSelect: (service: ServiceItem) => void;
  onAuth: (mode: "signin" | "signup") => void;
}

type ViewMode = "grid" | "list" | "folders";

export default function ServicesSection({
  userSession,
  onServiceSelect,
  onAuth,
}: ServicesSectionProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(
    Platform.INSTAGRAM,
  );
  const [viewMode, setViewMode] = useState<ViewMode>("folders");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<
    "all" | "popular" | "recommended" | "event"
  >("all");

  // Get services based on platform and apply filters
  let services = getServicesByPlatform(selectedPlatform);

  // Apply search filter
  if (searchTerm) {
    services = services.filter(
      (service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  // Apply category filter
  if (filter === "popular") {
    services = services.filter((s) => s.isPopular);
  } else if (filter === "recommended") {
    services = services.filter((s) => s.isRecommended);
  } else if (filter === "event") {
    services = services.filter((s) => s.isEvent);
  }

  const viewModeButtons = [
    { key: "folders" as ViewMode, icon: FolderIcon, label: "폴더형" },
    { key: "grid" as ViewMode, icon: Squares2X2Icon, label: "그리드" },
    { key: "list" as ViewMode, icon: ListBulletIcon, label: "리스트" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">서비스 선택</h2>
        <p className="text-gray-600">
          플랫폼을 선택하고 원하는 서비스를 찾아보세요
        </p>
      </div>

      {/* Platform Tabs */}
      <div className="mb-8">
        <ServiceTabs
          selectedPlatform={selectedPlatform}
          onPlatformChange={setSelectedPlatform}
        />
      </div>

      {/* Search and Controls */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="서비스 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setFilter("popular")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "popular"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🔥 인기
            </button>
            <button
              onClick={() => setFilter("recommended")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "recommended"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              ⭐ 추천
            </button>
            <button
              onClick={() => setFilter("event")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "event"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🎁 이벤트
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {viewModeButtons.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setViewMode(key)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    viewMode === key
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      <div className="min-h-[400px]">
        {viewMode === "folders" && (
          <ServiceFolderScroll
            platform={selectedPlatform}
            onServiceSelect={onServiceSelect}
          />
        )}

        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  검색 결과가 없습니다
                </h3>
                <p className="text-gray-500">
                  다른 검색어나 필터를 시도해보세요
                </p>
              </div>
            ) : (
              services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onSelect={onServiceSelect}
                  variant="default"
                />
              ))
            )}
          </div>
        )}

        {viewMode === "list" && (
          <div className="space-y-4">
            {services.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  검색 결과가 없습니다
                </h3>
                <p className="text-gray-500">
                  다른 검색어나 필터를 시도해보세요
                </p>
              </div>
            ) : (
              services.map((service) => (
                <div key={service.id} className="w-full">
                  <ServiceCard
                    service={service}
                    onSelect={onServiceSelect}
                    variant="compact"
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Service Count */}
      <div className="mt-8 text-center text-sm text-gray-500">
        총 {services.length}개의 서비스가 있습니다
      </div>
    </div>
  );
}
