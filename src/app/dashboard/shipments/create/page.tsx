'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function CreateShipmentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: 'manual',
    origin: '',
    supplier: '',
    shippingMethod: '',
    shipTo: '',
    packingList: null as File | null,
    shipDate: '',
    palletCount: '',
    eta: '',
    trackingNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const shippingOptions = [
    { id: 'fast_air', label: 'Fast Air $$$$ (9-15 Days)' },
    { id: 'fast_sea', label: 'Fast Sea $$ (20-25 Days)' },
    { id: 'common_sea', label: 'Common Sea $ (35-40 Days)' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('userId', '1'); // TODO: Replace with actual user ID
      submitData.append('type', formData.type);
      submitData.append('origin', formData.origin);

      if (formData.type === 'shipsquared') {
        submitData.append('supplier', formData.supplier);
        submitData.append('shippingMethod', formData.shippingMethod);
        submitData.append('shipTo', formData.shipTo);
      } else {
        if (formData.packingList) {
          submitData.append('packingList', formData.packingList);
        }
        submitData.append('shipDate', formData.shipDate);
        submitData.append('palletCount', formData.palletCount);
        submitData.append('eta', formData.eta);
        submitData.append('trackingNumber', formData.trackingNumber);
      }

      const response = await fetch('/api/shipments', {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) {
        throw new Error('Failed to create shipment');
      }

      router.push('/dashboard/shipments');
    } catch (error) {
      console.error('Error creating shipment:', error);
      alert('Failed to create shipment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newState = { ...prev, [name]: value };

      // When shipper type changes, reset the other form fields to their defaults
      if (name === 'type') {
        newState.supplier = '';
        newState.shippingMethod = '';
        newState.shipTo = '';
        newState.packingList = null;
        newState.shipDate = '';
        newState.palletCount = '';
        newState.eta = '';
        newState.trackingNumber = '';
      }
      
      return newState;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, packingList: e.target.files![0] }));
    }
  };

  const handleFileClear = () => {
    setFormData(prev => ({ ...prev, packingList: null }));
    const fileInput = document.getElementById('packingList') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Send Inventory to ShipSquared</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Shipper</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="manual">I've coordinated my own freight</option>
              <option value="shipsquared">ShipSquared Logistics</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">Origin</label>
            <input
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {formData.type === 'shipsquared' ? (
            <>
              <div>
                <label className="block mb-2">Supplier Name and/or WeChat ID</label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Preferred Shipping Method</label>
                <select
                  name="shippingMethod"
                  value={formData.shippingMethod}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="" disabled>Select a shipping method</option>
                  {shippingOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2">Ship To</label>
                <select
                  name="shipTo"
                  value={formData.shipTo}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="" disabled>Select a destination</option>
                  <option value="shipsquared_dallas">ShipSquared Dallas</option>
                  <option value="amazon_fba">Amazon FBA</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block mb-2 font-medium">Packing List</label>
                <div className="flex items-center">
                  <label
                    htmlFor="packingList"
                    className="cursor-pointer bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-l-md whitespace-nowrap"
                  >
                    Choose File
                  </label>
                  <input
                    id="packingList"
                    type="file"
                    onChange={handleFileChange}
                    className="sr-only"
                    required
                  />
                  <div className="flex items-center border border-l-0 border-gray-300 rounded-r-md w-full">
                    <span className="px-4 py-2 text-gray-500 flex-grow truncate">
                      {formData.packingList ? formData.packingList.name : 'No file chosen'}
                    </span>
                    {formData.packingList && (
                      <button
                        type="button"
                        onClick={handleFileClear}
                        className="px-3 text-gray-400 hover:text-red-600"
                        aria-label="Remove file"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block mb-2">Ship Date</label>
                <input
                  type="date"
                  name="shipDate"
                  value={formData.shipDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Pallet Count</label>
                <input
                  type="number"
                  name="palletCount"
                  value={formData.palletCount}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">ETA</label>
                <input
                  type="date"
                  name="eta"
                  value={formData.eta}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Tracking Number (Optional)</label>
                <input
                  type="text"
                  name="trackingNumber"
                  value={formData.trackingNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? 'Creating...' : 'Create Shipment'}
          </button>
        </form>
      </div>
    </div>
  );
} 