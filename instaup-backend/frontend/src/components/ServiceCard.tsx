import {
  ChatBubbleLeftIcon,
  CrownIcon,
  EyeIcon,
  GiftIcon,
  HeartIcon,
  ShareIcon,
  SparklesIcon,
  StarIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import {
  ChatBubbleLeftIcon as ChatSolid,
  EyeIcon as EyeSolid,
  HeartIcon as HeartSolid,
  ShareIcon as ShareSolid,
  StarIcon as StarSolid,
  UserPlusIcon as UserPlusSolid,
} from "@heroicons/react/24/solid";
import type { ServiceItem } from "../types/services";
import { ServiceCategory } from "../types/services";

interface ServiceCardProps {
  service: ServiceItem;
  onSelect: (service: ServiceItem) => void;
  variant?: "default" | "compact";
}

const getCategoryIcon = (category: ServiceCategory, filled = false) => {
  const iconProps = "w-5 h-5";

  switch (category) {
    case ServiceCategory.LIKES:
      return filled ? (
        <HeartSolid className={iconProps} />
      ) : (
        <HeartIcon className={iconProps} />
      );
    case ServiceCategory.VIEWS:
      return filled ? (
        <EyeSolid className={iconProps} />
      ) : (
        <EyeIcon className={iconProps} />
      );
    case ServiceCategory.FOLLOWERS:
    case ServiceCategory.SUBSCRIBERS:
      return filled ? (
        <UserPlusSolid className={iconProps} />
      ) : (
        <UserPlusIcon className={iconProps} />
      );
    case ServiceCategory.COMMENTS:
      return filled ? (
        <ChatSolid className={iconProps} />
      ) : (
        <ChatBubbleLeftIcon className={iconProps} />
      );
    case ServiceCategory.SHARES:
      return filled ? (
        <ShareSolid className={iconProps} />
      ) : (
        <ShareIcon className={iconProps} />
      );
    default:
      return filled ? (
        <StarSolid className={iconProps} />
      ) : (
        <StarIcon className={iconProps} />
      );
  }
};

export default function ServiceCard({
  service,
  onSelect,
  variant = "default",
}: ServiceCardProps) {
  const isCompact = variant === "compact";

  return (
    <div
      className={`
        bg-white rounded-xl border border-gray-200 overflow-hidden
        transition-all duration-300 cursor-pointer group
        hover:shadow-lg hover:border-gray-300 hover:-translate-y-1
        ${isCompact ? "p-4" : "p-6"}
      `}
      onClick={() => onSelect(service)}
    >
      {/* Header with Icon and Badges */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`
            ${
              service.quality === "vip"
                ? "bg-gradient-to-br from-purple-500 to-pink-500"
                : service.quality === "premium"
                  ? "bg-gradient-to-br from-blue-500 to-indigo-500"
                  : "bg-gradient-to-br from-gray-400 to-gray-500"
            }
            p-2.5 rounded-lg text-white
            group-hover:scale-110 transition-transform duration-300
          `}
          >
            {getCategoryIcon(service.category, true)}
          </div>

          <div className="flex-1">
            <h3
              className={`font-semibold text-gray-900 group-hover:text-blue-600 transition-colors ${
                isCompact ? "text-sm" : "text-base"
              }`}
            >
              {service.name}
            </h3>
            <p className={`text-gray-600 ${isCompact ? "text-xs" : "text-sm"}`}>
              {service.description}
            </p>
          </div>
        </div>

        {/* Quality Badge */}
        {service.quality === "vip" && (
          <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
            <CrownIcon className="w-3 h-3 text-purple-600" />
            <span className="text-xs font-medium text-purple-600">VIP</span>
          </div>
        )}
        {service.quality === "premium" && (
          <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-full">
            <SparklesIcon className="w-3 h-3 text-blue-600" />
            <span className="text-xs font-medium text-blue-600">프리미엄</span>
          </div>
        )}
      </div>

      {/* Badges Row */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {service.isPopular && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium">
            🔥 인기
          </span>
        )}
        {service.isRecommended && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
            ⭐ 추천
          </span>
        )}
        {service.isEvent && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full font-medium">
            <GiftIcon className="w-3 h-3" />
            이벤트
          </span>
        )}
      </div>

      {/* Features (for non-compact) */}
      {!isCompact && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {service.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
              >
                ✓ {feature}
              </span>
            ))}
            {service.features.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                +{service.features.length - 3}개 더
              </span>
            )}
          </div>
        </div>
      )}

      {/* Price and Order Info */}
      <div className="flex items-end justify-between">
        <div className="flex-1">
          {/* Order Range */}
          <div className="text-xs text-gray-500 mb-1">
            {service.minOrder.toLocaleString()}~
            {service.maxOrder.toLocaleString()}개
          </div>

          {/* Delivery Time */}
          <div className="text-xs text-gray-500">⏱ {service.deliveryTime}</div>
        </div>

        {/* Price */}
        <div className="text-right">
          {service.originalPrice && service.discount ? (
            <div className="space-y-1">
              <div className="text-xs text-gray-400 line-through">
                {service.originalPrice.toLocaleString()}원
              </div>
              <div
                className={`font-bold text-blue-600 ${isCompact ? "text-sm" : "text-lg"}`}
              >
                {service.price.toLocaleString()}원
              </div>
              <div className="text-xs text-red-600 font-medium">
                {service.discount}% 할인
              </div>
            </div>
          ) : (
            <div
              className={`font-bold text-blue-600 ${isCompact ? "text-sm" : "text-lg"}`}
            >
              {service.price.toLocaleString()}원
            </div>
          )}
          <div className="text-xs text-gray-500">
            {service.unit || "100개당"}
          </div>
        </div>
      </div>

      {/* Warning Note */}
      {service.warningNote && !isCompact && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">⚠️ {service.warningNote}</p>
        </div>
      )}

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
    </div>
  );
}
