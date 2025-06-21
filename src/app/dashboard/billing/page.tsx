"use client";

const billingData = [
  {
    invoiceDate: '2024-06-01',
    invoicePeriod: 'June 1–30',
    ordersShipped: 120,
    pickPackCost: 180.00,
    postageCost: 350.00,
    storageCost: 45.00,
    total: 575.00,
  },
  {
    invoiceDate: '2024-05-01',
    invoicePeriod: 'May 1–31',
    ordersShipped: 98,
    pickPackCost: 147.00,
    postageCost: 290.00,
    storageCost: 40.00,
    total: 477.00,
  },
];

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="mt-2 text-gray-600">View your monthly invoices and fulfillment costs.</p>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Period</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders Shipped</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pick & Pack Cost</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Postage Cost</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Storage Cost</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Invoice</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {billingData.map((row, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2 whitespace-nowrap">{row.invoiceDate}</td>
                <td className="px-4 py-2 whitespace-nowrap">{row.invoicePeriod}</td>
                <td className="px-4 py-2 whitespace-nowrap">{row.ordersShipped}</td>
                <td className="px-4 py-2 whitespace-nowrap">${row.pickPackCost.toFixed(2)}</td>
                <td className="px-4 py-2 whitespace-nowrap">${row.postageCost.toFixed(2)}</td>
                <td className="px-4 py-2 whitespace-nowrap">${row.storageCost.toFixed(2)}</td>
                <td className="px-4 py-2 whitespace-nowrap font-bold">${row.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 