'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import type { User } from 'next-auth';
import Link from 'next/link';
import { Package, Truck, Check, Edit2 } from 'lucide-react';

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
  packingListUrl: string | null;
  palletCount: string | null;
  trackingNumber: string | null;
}

interface ShipmentsClientProps {
  user: User;
}

export default function ShipmentsClient({ user }: ShipmentsClientProps) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTracking, setEditingTracking] = useState<string | null>(null);
  const [trackingValue, setTrackingValue] = useState('');

  const fetchShipments = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await fetch('/api/shipments'); // This API route is already user-scoped
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

  useEffect(() => {
    fetchShipments();
  }, []);
  
  const handleTrackingUpdate = async (shipmentId: string) => {
    try {
        await fetch(`/api/shipments/${shipmentId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ trackingNumber: trackingValue })
        });
        await fetchShipments();
        setEditingTracking(null);
    } catch (err) {
        console.error("Failed to update tracking number");
    }
  };

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
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-800">Details</h4>
                  <p>Pallets: {shipment.palletCount || 'N/A'}</p>
                  {shipment.packingListUrl && (
                    <Link href={shipment.packingListUrl} target="_blank" className="text-blue-600 hover:underline flex items-center">
                      <Package size={16} className="mr-1" /> View Packing List
                    </Link>
                  )}
                </div>
                <div>
                    <h4 className="font-semibold text-gray-800">Tracking</h4>
                    {editingTracking === shipment.id ? (
                        <div className="flex items-center gap-2">
                            <input type="text" value={trackingValue} onChange={e => setTrackingValue(e.target.value)} className="p-1 border rounded" />
                            <button onClick={() => handleTrackingUpdate(shipment.id)} className="text-green-600"><Check size={18} /></button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <p>{shipment.trackingNumber || 'Not available'}</p>
                            <button onClick={() => { setEditingTracking(shipment.id); setTrackingValue(shipment.trackingNumber || ''); }} className="text-gray-400 hover:text-blue-600">
                                <Edit2 size={16} />
                            </button>
                        </div>
                    )}
                </div>
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