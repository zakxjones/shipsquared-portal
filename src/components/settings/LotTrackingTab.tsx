import React, { useState } from 'react';
import SettingsBlock from './SettingsBlock';

export default function LotTrackingTab() {
  const [enabled, setEnabled] = useState(false);
  const [expiryDays, setExpiryDays] = useState('7');

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Save logic
    alert('Lot tracking settings saved!');
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <SettingsBlock title="Lot Tracking" description="Manage lot tracking and expiry notifications.">
        <div className="space-y-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={enabled}
              onChange={() => setEnabled(!enabled)}
              className="accent-blue-600"
            />
            <span>Enable Lot Tracking</span>
          </label>
          <div className="max-w-xs">
            <label className="block text-sm font-medium mb-1">Lot Expiry Notification (days before expiry)</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 mt-1"
              value={expiryDays}
              onChange={e => setExpiryDays(e.target.value)}
              min="1"
            />
          </div>
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