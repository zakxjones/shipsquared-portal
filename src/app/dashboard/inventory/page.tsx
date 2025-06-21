"use client";
import { useState } from 'react';

const subpages = [
  { name: 'Inventory', key: 'inventory' },
  { name: 'Transfers', key: 'transfers' },
  { name: 'Adjustment History', key: 'adjustments' },
  { name: 'Locations', key: 'locations' },
];

const inventoryData = [
  {
    product: 'Sample Product A',
    sku: 'SKU-A',
    available: 120,
    committed: 10,
    incoming: 30,
  },
  {
    product: 'Sample Product B',
    sku: 'SKU-B',
    available: 80,
    committed: 5,
    incoming: 0,
  },
];

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState('inventory');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <nav className="flex gap-4">
          {subpages.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-md font-medium text-sm ${activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'}`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'inventory' && (
        <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Committed</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incoming</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryData.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900">{item.product}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-700">{item.sku}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-700">{item.available}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-700">{item.committed}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-700">{item.incoming}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <button className="text-blue-600 hover:underline text-sm">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'transfers' && (
        <div className="bg-white rounded-lg shadow p-8 text-gray-500 text-center">Transfers page coming soon.</div>
      )}
      {activeTab === 'adjustments' && (
        <div className="bg-white rounded-lg shadow p-8 text-gray-500 text-center">Adjustment history coming soon.</div>
      )}
      {activeTab === 'locations' && (
        <div className="bg-white rounded-lg shadow p-8 text-gray-500 text-center">Locations page coming soon.</div>
      )}
    </div>
  );
} 