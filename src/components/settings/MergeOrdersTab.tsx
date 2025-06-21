import React, { useState } from 'react';
import SettingsBlock from './SettingsBlock';

export default function MergeOrdersTab() {
  const [enabled, setEnabled] = useState(false);
  const [mergeWindow, setMergeWindow] = useState('2');

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Save logic
    alert('Merge orders settings saved!');
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <SettingsBlock title="Merge Orders" description="Configure order merging options.">
        <div className="space-y-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={enabled}
              onChange={() => setEnabled(!enabled)}
              className="accent-blue-600"
            />
            <span>Enable Merge Orders</span>
          </label>
          <div className="max-w-xs">
            <label className="block text-sm font-medium mb-1">Merge Window (hours)</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 mt-1"
              value={mergeWindow}
              onChange={e => setMergeWindow(e.target.value)}
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