'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';

interface Shipment {
  id: string;
  createdAt: string;
  status: string;
  shipperType: string;
  origin: string | null;
  supplier: string | null;
  shippingMethod: string | null;
  shipTo: string | null;
  notes: string | null;
  trackingNumber: string | null;
  user: {
    name: string | null;
    email: string | null;
  };
}

const statusOptions = ['Pending', 'In Transit', 'Received', 'Cancelled'];

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [currentStatus, setCurrentStatus] = useState('');
  const [currentNotes, setCurrentNotes] = useState('');
  const [currentTracking, setCurrentTracking] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/shipments');
      if (!response.ok) {
        throw new Error('Failed to fetch shipments');
      }
      const data = await response.json();
      setShipments(data.shipments || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleUpdate = async () => {
    if (!selectedShipment) return;
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/shipments/${selectedShipment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: currentStatus, 
          notes: currentNotes,
          trackingNumber: currentTracking,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update shipment');
      }
      await fetchShipments(); // Refresh data
      closeModal();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const openModal = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setCurrentStatus(shipment.status);
    setCurrentNotes(shipment.notes || '');
    setCurrentTracking(shipment.trackingNumber || '');
  };

  const closeModal = () => {
    setSelectedShipment(null);
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Inbound Shipment Requests</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipper</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shipments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No shipment requests found.</td>
                </tr>
              ) : (
                shipments.map((shipment) => (
                  <tr key={shipment.id} onClick={() => openModal(shipment)} className="cursor-pointer hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(shipment.createdAt), 'MMM dd, yyyy')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shipment.user.name || shipment.user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${shipment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{shipment.status}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shipment.shipperType === 'shipsquared' ? 'ShipSquared Logistics' : 'Own Freight'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shipment.origin || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shipment.shipperType === 'shipsquared' ? `${shipment.supplier} to ${shipment.shipTo}` : 'See Packing List'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Update Shipment</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select id="status" value={currentStatus} onChange={(e) => setCurrentStatus(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                  {statusOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes for Client</label>
                <textarea id="notes" value={currentNotes} onChange={(e) => setCurrentNotes(e.target.value)} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
              </div>
              <div>
                <label htmlFor="tracking" className="block text-sm font-medium text-gray-700">Tracking Number</label>
                <input type="text" id="tracking" value={currentTracking} onChange={(e) => setCurrentTracking(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={closeModal} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
              <button onClick={handleUpdate} disabled={isUpdating} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
                {isUpdating ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 