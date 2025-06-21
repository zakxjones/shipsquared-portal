"use client";

import { useState } from "react";

export default function InventoryShipmentForm({ userId }: { userId: string }) {
  const [type, setType] = useState<"shipsquared" | "own">("shipsquared");
  const [supplier, setSupplier] = useState("");
  const [shippingMethod, setShippingMethod] = useState("");
  const [shipTo, setShipTo] = useState("shipsquared");
  const [packingList, setPackingList] = useState<File | null>(null);
  const [shipDate, setShipDate] = useState("");
  const [palletCount, setPalletCount] = useState("");
  const [eta, setEta] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    // Validate required fields
    if (type === "shipsquared") {
      if (!supplier || !shippingMethod || !shipTo) {
        setError("Please fill in all required fields.");
        setLoading(false);
        return;
      }
    } else {
      if (!packingList || !shipDate || !palletCount || !eta) {
        setError("Please fill in all required fields.");
        setLoading(false);
        return;
      }
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("type", type);
    if (type === "shipsquared") {
      formData.append("supplier", supplier);
      formData.append("shippingMethod", shippingMethod);
      formData.append("shipTo", shipTo);
    } else {
      if (packingList) formData.append("packingList", packingList);
      formData.append("shipDate", shipDate);
      formData.append("palletCount", palletCount);
      formData.append("eta", eta);
    }

    // POST to API
    const res = await fetch("/api/shipments", {
      method: "POST",
      body: formData,
    });
    setLoading(false);
    if (!res.ok) {
      setError("Failed to create shipment.");
      return;
    }
    setSuccess(true);
    setSupplier("");
    setShippingMethod("");
    setShipTo("shipsquared");
    setPackingList(null);
    setShipDate("");
    setPalletCount("");
    setEta("");
    setStatus(null);
    // Optionally, trigger a refresh of the shipment list
    window.location.reload();
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">How would you like to ship?</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              value="shipsquared"
              checked={type === "shipsquared"}
              onChange={() => setType("shipsquared")}
              className="accent-blue-600"
            />
            ShipSquared Freight Forwarding
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              value="own"
              checked={type === "own"}
              onChange={() => setType("own")}
              className="accent-blue-600"
            />
            Use My Own Freight Forwarder
          </label>
        </div>
      </div>

      {type === "shipsquared" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier Details *</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={supplier}
              onChange={e => setSupplier(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Shipping Method Requested *</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={shippingMethod}
              onChange={e => setShippingMethod(e.target.value)}
              required
            >
              <option value="">Select a method</option>
              <option value="common_sea">Common Sea $</option>
              <option value="fast_sea">Fast Sea $$</option>
              <option value="fast_air">Fast Air $$$$</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ship To *</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="shipTo"
                  value="shipsquared"
                  checked={shipTo === "shipsquared"}
                  onChange={() => setShipTo("shipsquared")}
                  className="accent-blue-600"
                />
                ShipSquared USA
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="shipTo"
                  value="other"
                  checked={shipTo === "other"}
                  onChange={() => setShipTo("other")}
                  className="accent-blue-600"
                />
                Other (for Amazon FBA)
              </label>
            </div>
          </div>
        </>
      )}

      {type === "own" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Packing List *</label>
            <input
              type="file"
              accept=".pdf,.csv,.xlsx,.xls,.png,.jpg,.jpeg"
              className="mt-1 block w-full"
              onChange={e => setPackingList(e.target.files?.[0] || null)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ship Date *</label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={shipDate}
              onChange={e => setShipDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">How Many Pallets? *</label>
            <input
              type="number"
              min={1}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={palletCount}
              onChange={e => setPalletCount(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">ETA to Our Warehouse *</label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={eta}
              onChange={e => setEta(e.target.value)}
              required
            />
          </div>
        </>
      )}

      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">Shipment created!</div>}
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Shipment"}
        </button>
      </div>
    </form>
  );
} 