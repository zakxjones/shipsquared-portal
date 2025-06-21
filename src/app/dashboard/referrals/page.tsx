'use client';

import { useEffect, useState } from 'react';

interface Referral {
  id: string;
  firstName: string;
  lastName: string;
  brandName: string;
  site?: string;
  email: string;
  ordersPerMonth: number;
  referralStatus: string;
  referralBonusStatus: string;
  createdAt: string;
}

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    brandName: '',
    site: '',
    email: '',
    ordersPerMonth: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchReferrals = () => {
    fetch('/api/referrals')
      .then(res => res.json())
      .then(data => {
        setReferrals(data.referrals || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          firstName: '',
          lastName: '',
          brandName: '',
          site: '',
          email: '',
          ordersPerMonth: 0,
        });
        setShowForm(false);
        fetchReferrals(); // Refresh the list
        alert('Referral added successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create referral');
      }
    } catch (error) {
      alert('Failed to create referral');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Referrals</h1>
        <p className="mt-2 text-gray-600">Track and manage your referral program.</p>
      </div>

      <div className="rounded-lg bg-white shadow">
        <div className="p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex-auto">
              <h2 className="text-base font-semibold leading-6 text-gray-900">Your Referrals</h2>
              <p className="mt-2 text-sm text-gray-700">
                A list of all your referrals and their current status.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                type="button"
                onClick={() => setShowForm(!showForm)}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
              >
                {showForm ? 'Cancel' : 'Add Referral'}
              </button>
            </div>
          </div>

          {showForm && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="brandName" className="block text-sm font-medium text-gray-700">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    id="brandName"
                    required
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="site" className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <input
                    type="url"
                    id="site"
                    value={formData.site}
                    onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="ordersPerMonth" className="block text-sm font-medium text-gray-700">
                    Orders per Month
                  </label>
                  <input
                    type="number"
                    id="ordersPerMonth"
                    min="0"
                    value={formData.ordersPerMonth}
                    onChange={(e) => setFormData({ ...formData, ordersPerMonth: parseInt(e.target.value) || 0 })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {submitting ? 'Adding...' : 'Add Referral'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="mt-6">
            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : referrals.length === 0 ? (
              <p className="text-sm text-gray-500">No referrals found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders/Month</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referral Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonus Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {referrals.map(ref => (
                      <tr key={ref.id}>
                        <td className="px-4 py-2 whitespace-nowrap">{ref.firstName}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{ref.lastName}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{ref.brandName}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{ref.site || '-'}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{ref.email}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{ref.ordersPerMonth}</td>
                        <td className="px-4 py-2 whitespace-nowrap capitalize">{ref.referralStatus.replace('_', ' ')}</td>
                        <td className="px-4 py-2 whitespace-nowrap capitalize">{ref.referralBonusStatus.replace('_', ' ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 