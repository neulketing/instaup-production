import { useState } from "react";

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isLoggedIn: boolean;
}

export default function MobileBottomNav({
  activeTab,
  onTabChange,
  isLoggedIn,
}: MobileBottomNavProps) {
  const tabs = [
    {
      id: "home",
      label: "홈",
      icon: "🏠",
      activeIcon: "🏠",
    },
    {
      id: "orders",
      label: "주문",
      icon: "📦",
      activeIcon: "📦",
    },
    {
      id: "wallet",
      label: "충전",
      icon: "💳",
      activeIcon: "💳",
    },
    {
      id: "referral",
      label: "추천",
      icon: "👥",
      activeIcon: "👥",
    },
    {
      id: "profile",
      label: "프로필",
      icon: "👤",
      activeIcon: "👤",
    },
  ];

  // 로그인하지 않은 경우 제한된 탭만 표시
  const availableTabs = isLoggedIn
    ? tabs
    : tabs.filter((tab) => ["home"].includes(tab.id));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Backdrop blur effect */}
      <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200">
        <div className="flex items-center justify-around py-2 px-2 max-w-md mx-auto">
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 relative ${
                activeTab === tab.id
                  ? "bg-blue-100 text-blue-600 scale-105"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {/* Active indicator */}
              {activeTab === tab.id && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full"></div>
              )}

              <div className="text-xl mb-1">
                {activeTab === tab.id ? tab.activeIcon : tab.icon}
              </div>
              <span
                className={`text-xs font-medium ${
                  activeTab === tab.id ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Safe area for devices with home indicator */}
      <div className="h-2 bg-white/95 backdrop-blur-lg"></div>
    </div>
  );
}
