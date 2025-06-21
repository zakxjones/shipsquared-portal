"use client";

import { useState } from "react";
import Image from "next/image";

const platforms = [
  {
    id: "shopify",
    name: "Shopify",
    logo: "/shopify-logo.svg", // Use SVG
    connected: false, // This will be set by parent
  },
  {
    id: "amazon",
    name: "Amazon FBM",
    logo: "/amazon-logo.svg",
    connected: false,
  },
  {
    id: "tiktok",
    name: "TikTok Shop",
    logo: "/tiktok-logo.svg",
    connected: false,
  },
  {
    id: "ebay",
    name: "eBay",
    logo: "/ebay-logo.svg",
    connected: false,
  },
  {
    id: "etsy",
    name: "Etsy",
    logo: "/etsy-logo.svg",
    connected: false,
  },
];

export default function ConnectStoreModal({
  open,
  onClose,
  connectedPlatforms = [],
}: {
  open: boolean;
  onClose: () => void;
  connectedPlatforms: string[];
}) {
  const [step, setStep] = useState<null | string>(null); // platform id or null
  const [shopifyDomain, setShopifyDomain] = useState("");
  const [amazonSource, setAmazonSource] = useState("");
  const [amazonIdentifier, setAmazonIdentifier] = useState("sku");

  if (!open) return null;

  // Merge connected state
  const platformList = platforms.map((p) => ({
    ...p,
    connected: connectedPlatforms.includes(p.id),
  }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] p-6 relative overflow-y-auto"
        style={{ boxSizing: 'border-box' }}
      >
        <button
          className="sticky top-4 right-4 float-right text-gray-400 hover:text-gray-600 z-10 bg-white"
          onClick={onClose}
          aria-label="Close"
          style={{ position: 'absolute', top: 16, right: 16 }}
        >
          ×
        </button>
        {!step && (
          <>
            <h2 className="text-2xl font-semibold mb-2">Connect a Store</h2>
            <p className="mb-4 text-gray-600">Select your store or marketplace to begin</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {platformList.map((platform) => (
                <div
                  key={platform.id}
                  className="border rounded-lg flex flex-col items-center p-4 relative bg-gray-50 h-64 justify-between"
                >
                  <div className="flex-1 flex flex-col items-center justify-center w-full">
                    <Image src={platform.logo} alt={platform.name} width={64} height={64} />
                    <span className="mt-2 font-semibold text-lg">{platform.name}</span>
                  </div>
                  {platform.connected ? (
                    <span className="absolute top-2 right-2 text-green-600" title="Connected">🔗</span>
                  ) : null}
                  <button
                    className={`mt-4 px-4 py-1 rounded w-full ${
                      platform.connected
                        ? "bg-green-100 text-green-600 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    disabled={platform.connected}
                    onClick={() => setStep(platform.id)}
                  >
                    {platform.connected ? "Connected" : "Connect"}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        {/* Shopify Step */}
        {step === "shopify" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Image src="/shopify-logo.svg" alt="Shopify" width={40} height={40} className="mr-2" /> Shopify
            </h2>
            <label className="block font-semibold mb-1">Shopify Domain <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="border rounded w-full px-3 py-2 mb-2"
              placeholder="yourstore.myshopify.com"
              value={shopifyDomain}
              onChange={e => setShopifyDomain(e.target.value)}
            />
            <div className="text-xs text-blue-900 bg-blue-50 border border-blue-100 rounded p-2 mb-4">
              Enter the domain of your Shopify store (Example: yourstore.myshopify.com)
            </div>
            <div className="flex justify-between mt-6">
              <button className="text-gray-600" onClick={() => setStep(null)}>Back</button>
              <div>
                <button className="mr-2 px-4 py-2 rounded bg-gray-200" onClick={onClose}>Cancel</button>
                <a
                  href={`/api/integrations/shopify/start?shop=${encodeURIComponent(shopifyDomain)}`}
                  className={`px-4 py-2 rounded bg-green-600 text-white ${!shopifyDomain.endsWith('.myshopify.com') ? 'opacity-50 pointer-events-none' : 'hover:bg-green-700'}`}
                >
                  Connect
                </a>
              </div>
            </div>
          </div>
        )}
        {/* Amazon Step */}
        {step === "amazon" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Image src="/amazon-logo.svg" alt="Amazon" width={40} height={40} className="mr-2" /> Amazon FBM
            </h2>
            <div className="mb-2 text-sm text-gray-700">
              If you don't currently sell on Amazon <a href="https://sell.amazon.com/" target="_blank" className="text-blue-600 underline">click here</a> to learn more and get started today.<br />
              For more detailed Amazon connection instructions, <a href="#" className="text-blue-600 underline">check out our support article</a>.
            </div>
            <label className="block font-semibold mb-1 mt-4">Amazon Order Source <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="border rounded w-full px-3 py-2 mb-2"
              placeholder="e.g. US Store, EU Store, etc."
              value={amazonSource}
              onChange={e => setAmazonSource(e.target.value)}
            />
            <label className="block font-semibold mb-1 mt-4">Product Identifier <span className="text-red-500">*</span></label>
            <select
              className="border rounded w-full px-3 py-2 mb-2"
              value={amazonIdentifier}
              onChange={e => setAmazonIdentifier(e.target.value)}
            >
              <option value="sku">SKU (recommended)</option>
              <option value="asin">Amazon ASIN</option>
            </select>
            <div className="flex justify-between mt-6">
              <button className="text-gray-600" onClick={() => setStep(null)}>Back</button>
              <div>
                <button className="mr-2 px-4 py-2 rounded bg-gray-200" onClick={onClose}>Cancel</button>
                <a
                  href="/api/integrations/amazon/start"
                  className={`px-4 py-2 rounded bg-green-600 text-white ${!amazonSource ? 'opacity-50 pointer-events-none' : 'hover:bg-green-700'}`}
                >
                  Connect
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 