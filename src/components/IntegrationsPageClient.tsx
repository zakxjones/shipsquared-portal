"use client";

import { useState } from "react";
import ConnectStoreModal from "@/components/ConnectStoreModal";

export default function IntegrationsPageClient({ user, connectedPlatforms }: { user: any; connectedPlatforms: string[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Connected Stores</h1>
        <p className="mt-2 text-gray-600">Manage your store integrations below.</p>
      </div>

      <div className="rounded-lg bg-white shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Your Connections</h2>
        {user?.platformConnections.length ? (
          <ul className="divide-y divide-gray-200">
            {user.platformConnections.map((conn: any) => (
              <li key={conn.id} className="py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{conn.platform.toUpperCase()}</div>
                  <div className="text-gray-500 text-sm">{conn.storeName || conn.storeUrl}</div>
                  <div className="text-xs text-gray-400">Connected</div>
                </div>
                <form action={`/api/integrations/disconnect`} method="POST">
                  <input type="hidden" name="connectionId" value={conn.id} />
                  <button type="submit" className="text-red-600 hover:underline text-sm">Disconnect</button>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500">No stores connected yet.</div>
        )}
      </div>

      <div className="rounded-lg bg-white shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Connect a New Store</h2>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setModalOpen(true)}
        >
          Connect a Store
        </button>
      </div>
      <ConnectStoreModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        connectedPlatforms={connectedPlatforms}
      />
    </div>
  );
} 