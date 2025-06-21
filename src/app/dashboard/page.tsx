"use client";
import { DollarSign, ClipboardList, Truck, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

const statsConfig = [
  { key: 'todayRevenue', label: "Today's Revenue", icon: DollarSign, isCurrency: true },
  { key: 'todayShipped', label: 'Orders Shipped Today', icon: Truck },
  { key: 'todayOrders', label: "Today's Orders", icon: ClipboardList },
  { key: 'yesterdayRevenue', label: "Yesterday's Revenue", icon: DollarSign, isCurrency: true },
  { key: 'yesterdayShipped', label: 'Orders Shipped Yesterday', icon: Truck },
  { key: 'yesterdayOrders', label: "Yesterday's Orders", icon: ClipboardList },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState<string>('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/dashboard/stats');
        const data = await res.json();
        setStats(data);
      } catch {
        setStats({});
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // ShipStation import on page load
  useEffect(() => {
    handleImport();
  }, []);

  async function handleImport() {
    setImportStatus('loading');
    setImportMessage('');
    try {
      const res = await fetch('/api/shipstation/import', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setImportStatus('success');
        setImportMessage(data.message || 'Import successful!');
      } else {
        setImportStatus('error');
        setImportMessage(data.message || 'Import failed.');
      }
    } catch {
      setImportStatus('error');
      setImportMessage('Import failed.');
    }
  }

  return (
    <div className="space-y-6 mt-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statsConfig.map((stat) => (
          <div
            key={stat.label}
            className="card flex flex-col items-center justify-center"
          >
            <stat.icon className="h-6 w-6 text-gray-400 mb-2" aria-hidden="true" />
            <span className="text-lg font-bold text-gray-900">
              {loading ? '...' : stat.isCurrency ? `$${Number(stats[stat.key] || 0).toLocaleString()}` : stats[stat.key] ?? 0}
            </span>
            <span className="text-xs text-gray-500 font-medium text-center mt-1">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ShipStation Import Section */}
      <div className="card flex flex-col gap-4 items-start">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">ShipStation Import</span>
          <button
            onClick={handleImport}
            disabled={importStatus === 'loading'}
            className="ml-2 flex items-center gap-1 px-3 py-1.5 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${importStatus === 'loading' ? 'animate-spin' : ''}`} />
            Refresh from ShipStation
          </button>
        </div>
        {importStatus === 'loading' && (
          <span className="text-blue-600 text-sm">Importing from ShipStation...</span>
        )}
        {importStatus === 'success' && (
          <span className="text-green-600 text-sm">{importMessage}</span>
        )}
        {importStatus === 'error' && (
          <span className="text-red-600 text-sm">{importMessage}</span>
        )}
      </div>
    </div>
  );
}
