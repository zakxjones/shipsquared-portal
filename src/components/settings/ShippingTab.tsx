import React, { useState } from 'react';
import SettingsBlock from './SettingsBlock';

export default function ShippingTab() {
  const [defaultMethod, setDefaultMethod] = useState('Standard');
  const [carrier, setCarrier] = useState('UPS');
  const [cost, setCost] = useState('5.00');

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Save logic
    alert('Shipping settings saved!');
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <SettingsBlock title="Shipping Settings" description="Configure your store's default shipping options.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium mb-1">Default Shipping Method</label>
            <select
              className="w-full border rounded px-3 py-2 mt-1"
              value={defaultMethod}
              onChange={e => setDefaultMethod(e.target.value)}
            >
              <option>Standard</option>
              <option>Express</option>
              <option>Overnight</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Shipping Carrier</label>
            <select
              className="w-full border rounded px-3 py-2 mt-1"
              value={carrier}
              onChange={e => setCarrier(e.target.value)}
            >
              <option>UPS</option>
              <option>FedEx</option>
              <option>USPS</option>
              <option>DHL</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Default Shipping Cost ($)</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 mt-1"
              value={cost}
              onChange={e => setCost(e.target.value)}
              min="0"
              step="0.01"
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