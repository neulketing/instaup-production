import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import { platformsData } from "../data/services";
import type { Platform } from "../types/services";

interface ServiceTabsProps {
  selectedPlatform: Platform;
  onPlatformChange: (platform: Platform) => void;
}

export default function ServiceTabs({
  selectedPlatform,
  onPlatformChange,
}: ServiceTabsProps) {
  const selectedIndex = platformsData.findIndex(
    (platform) => platform.id === selectedPlatform,
  );

  return (
    <div className="w-full">
      <Tab.Group
        selectedIndex={selectedIndex}
        onChange={(index) => onPlatformChange(platformsData[index].id)}
      >
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 overflow-x-auto scrollbar-hide">
          {platformsData.map((platform) => (
            <Tab key={platform.id} as={Fragment}>
              {({ selected }) => (
                <button
                  className={`
                    whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium leading-5
                    transition-all duration-200 flex items-center gap-2 min-w-fit
                    ${
                      selected
                        ? "bg-white text-gray-900 shadow"
                        : "text-gray-700 hover:bg-white/60 hover:text-gray-900"
                    }
                  `}
                >
                  <img
                    src={platform.icon}
                    alt={platform.name}
                    className="w-5 h-5"
                  />
                  <span>{platform.name}</span>
                  {platform.orderCount > 0 && (
                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                      {platform.orderCount > 1000
                        ? `${Math.floor(platform.orderCount / 1000)}K+`
                        : platform.orderCount.toLocaleString()}
                    </span>
                  )}
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-6">
          {platformsData.map((platform) => (
            <Tab.Panel key={platform.id} className="outline-none">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={platform.icon}
                    alt={platform.name}
                    className="w-8 h-8"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {platform.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {platform.description}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span
                      className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        platform.serverStatus === "online"
                          ? "bg-green-100 text-green-800"
                          : platform.serverStatus === "maintenance"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    `}
                    >
                      {platform.serverStatus === "online"
                        ? "운영중"
                        : platform.serverStatus === "maintenance"
                          ? "점검중"
                          : "중단"}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  총 주문: {platform.orderCount.toLocaleString()}건
                </div>
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
