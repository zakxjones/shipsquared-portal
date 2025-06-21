'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

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
}

export default function ClientShipmentHistoryPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/shipments');
        if (!response.ok) {
          throw new Error('Failed to fetch shipment history');
        }
        const data = await response.json();
        setShipments(data.shipments || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  const getStatusPill = (status: string) => {
    const baseClasses = "px-3 py-1 text-xs font-medium rounded-full inline-block";
    switch (status.toLowerCase()) {
      case 'received': return <span className={`${baseClasses} bg-green-100 text-green-800`}>Received</span>;
      case 'in transit': return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>In Transit</span>;
      case 'cancelled': return <span className={`${baseClasses} bg-red-100 text-red-800`}>Cancelled</span>;
      default: return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
    }
  };

  if (loading) return <div className="p-8 text-center">Loading shipment history...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Shipment History</h1>
      <div className="space-y-4">
        {shipments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">You have no shipment history.</p>
          </div>
        ) : (
          shipments.map((shipment) => (
            <div key={shipment.id} className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Shipment ID: {shipment.id}</p>
                  <p className="text-lg font-semibold">{shipment.shipperType === 'shipsquared' ? `${shipment.supplier} to ${shipment.shipTo}` : 'Manually Coordinated Freight'}</p>
                  <p className="text-sm text-gray-600">
                    Created on {format(new Date(shipment.createdAt), 'MMM dd, yyyy')}
                  </p>
                </div>
                {getStatusPill(shipment.status)}
              </div>
              {shipment.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800">Admin Notes:</h4>
                  <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{shipment.notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}