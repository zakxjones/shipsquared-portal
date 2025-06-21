import React, { useState } from 'react';
import SettingsBlock from './SettingsBlock';

export default function PostHeroTab() {
  const [enabled, setEnabled] = useState(false);
  const [apiKey, setApiKey] = useState('');

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Save logic
    alert('PostHero settings saved!');
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <SettingsBlock title="PostHero Integration" description="Configure your PostHero integration.">
        <div className="space-y-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={enabled}
              onChange={() => setEnabled(!enabled)}
              className="accent-blue-600"
            />
            <span>Enable PostHero Integration</span>
          </label>
          <div className="max-w-md">
            <label className="block text-sm font-medium mb-1">API Key</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mt-1"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="Enter your PostHero API key"
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