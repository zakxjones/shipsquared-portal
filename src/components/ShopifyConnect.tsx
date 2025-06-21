"use client";

import { useState } from "react";

export default function ShopifyConnect() {
  const [shop, setShop] = useState("");
  return (
    <form
      action={`/api/integrations/shopify/start`}
      method="GET"
      className="flex gap-2 items-center"
      onSubmit={e => {
        if (!shop.endsWith('.myshopify.com')) {
          e.preventDefault();
          alert('Please enter a valid Shopify domain (e.g. mystore.myshopify.com)');
        }
      }}
    >
      <input
        type="text"
        name="shop"
        placeholder="your-store.myshopify.com"
        value={shop}
        onChange={e => setShop(e.target.value)}
        className="border rounded px-2 py-1"
        required
      />
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Connect Shopify
      </button>
    </form>
  );
} 