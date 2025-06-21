import React from "react";

export const SETTINGS_TABS = [
  "General",
  "Shipping",
  "Returns",
  "My Profile",
  "Email Notifications",
  "Users",
];

export default function SettingsTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  return (
    <nav className="flex space-x-4 border-b border-gray-200 bg-white px-8 pt-2 text-sm font-medium">
      {SETTINGS_TABS.map((tab) => (
        <button
          key={tab}
          className={`pb-2 px-1 transition-colors duration-150
            ${activeTab === tab
              ? "border-b-2 border-blue-600 text-blue-700 bg-transparent"
              : "text-gray-500 hover:text-blue-600 border-b-2 border-transparent"}
          `}
          onClick={() => onTabChange(tab)}
          aria-selected={activeTab === tab}
          role="tab"
        >
          {tab}
        </button>
      ))}
    </nav>
  );
} 