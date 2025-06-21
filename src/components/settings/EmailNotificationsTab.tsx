import React, { useState } from 'react';
import SettingsBlock from './SettingsBlock';

export default function EmailNotificationsTab() {
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [shippingUpdates, setShippingUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Save logic
    alert('Notification settings saved!');
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <SettingsBlock title="Email Notifications" description="Choose which notifications you want to receive.">
        <div className="space-y-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={orderUpdates}
              onChange={() => setOrderUpdates(!orderUpdates)}
              className="accent-blue-600"
            />
            <span>Order Updates</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={shippingUpdates}
              onChange={() => setShippingUpdates(!shippingUpdates)}
              className="accent-blue-600"
            />
            <span>Shipping Updates</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={promotions}
              onChange={() => setPromotions(!promotions)}
              className="accent-blue-600"
            />
            <span>Promotions</span>
          </label>
        </div>
      </SettingsBlock>
      <div className="flex justify-end gap-2 mt-8">
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
} 