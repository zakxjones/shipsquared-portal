'use client';

import { useEffect, useState } from 'react';
import { Package, ClipboardList, Users, Send } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  platform: string;
  total: number;
  currency: string;
  createdAt: string;
  shippingAddress: any;
  items: any[];
  customerName?: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
}

const PER_PAGE_OPTIONS = [50, 100, 500];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [startDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString();
  });

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          perPage: perPage.toString(),
          startDate,
        });
        const response = await fetch(`/api/orders?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data.orders);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page, perPage, startDate]);

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPerPage(Number(e.target.value));
    setPage(1); // Reset to first page
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading orders</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-4xl font-bold mb-2">Orders</h1>
        <p className="mt-2 text-gray-600 text-lg mb-6">Manage and track your orders.</p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold leading-6 text-gray-900">Recent Orders</h2>
            <p className="mt-1 text-sm text-gray-700">
              A list of all your recent orders and their current status.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <label htmlFor="perPage" className="text-sm text-gray-700 mr-2">Show</label>
            <select
              id="perPage"
              value={perPage}
              onChange={handlePerPageChange}
              className="border rounded px-2 py-1 text-sm"
            >
              {PER_PAGE_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <span className="text-sm text-gray-700 ml-2">per page</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="text-left text-base font-semibold text-gray-900">Order #</th>
                <th className="text-left text-base font-semibold text-gray-900">Customer</th>
                <th className="text-left text-base font-semibold text-gray-900">Status</th>
                <th className="text-left text-base font-semibold text-gray-900">Total</th>
                <th className="text-left text-base font-semibold text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="whitespace-nowrap text-lg font-bold text-gray-900">{order.orderNumber}</td>
                  <td className="whitespace-nowrap text-base text-gray-900">{order.customerName || '-'}</td>
                  <td className="whitespace-nowrap text-base text-gray-700">{order.paymentStatus || '-'}</td>
                  <td className="whitespace-nowrap text-base text-gray-700">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: order.currency,
                    }).format(order.total)}
                  </td>
                  <td className="whitespace-nowrap text-base text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-8">
          <div className="text-base text-gray-700">
            Showing {(page - 1) * perPage + 1}
            {' - '}
            {Math.min(page * perPage, total)} of {total} orders
          </div>
          <div className="flex gap-2">
            <button
              className="btn"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`btn ${p === page ? 'bg-gradient-to-r from-purple-500 to-pink-500 font-bold' : 'bg-white text-gray-700 border'}`}
                onClick={() => handlePageChange(p)}
                disabled={p === page}
              >
                {p}
              </button>
            ))}
            <button
              className="btn"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 