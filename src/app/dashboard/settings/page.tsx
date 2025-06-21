"use client";

import React, { useState } from "react";
import SettingsTabs, { SETTINGS_TABS } from "@/components/settings/SettingsTabs";
import GeneralTab from "@/components/settings/GeneralTab";
import ShippingTab from "@/components/settings/ShippingTab";
import ReturnsTab from "@/components/settings/ReturnsTab";
import MyProfileTab from "@/components/settings/MyProfileTab";
import EmailNotificationsTab from "@/components/settings/EmailNotificationsTab";
import UsersTab from "@/components/settings/UsersTab";

const TAB_COMPONENTS: Record<string, React.FC> = {
  General: GeneralTab,
  Shipping: ShippingTab,
  Returns: ReturnsTab,
  "My Profile": MyProfileTab,
  "Email Notifications": EmailNotificationsTab,
  Users: UsersTab,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("General");
  const ActiveTabComponent = TAB_COMPONENTS[activeTab] || GeneralTab;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto pt-8">
        <h1 className="text-2xl font-bold mb-2 px-8">Settings</h1>
        <div className="rounded-t-xl overflow-hidden shadow-sm">
          <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <div className="px-8 py-8">
          <TabPanel>
            <ActiveTabComponent />
          </TabPanel>
        </div>
      </div>
    </div>
  );
}

function TabPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      {children}
    </div>
  );
} 