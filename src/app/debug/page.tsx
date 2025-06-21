"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function DebugPage() {
  const { data: session, status } = useSession();
  const [debugData, setDebugData] = useState<any>(null);

  useEffect(() => {
    const fetchDebugData = async () => {
      try {
        const response = await fetch('/api/debug/user');
        const data = await response.json();
        setDebugData(data);
      } catch (error) {
        console.error('Failed to fetch debug data:', error);
      }
    };

    if (session) {
      fetchDebugData();
    }
  }, [session]);

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Debug Information</h1>
      
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Session Status</h2>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Authenticated:</strong> {session ? 'Yes' : 'No'}</p>
        </div>

        {session && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Session Data</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        )}

        {debugData && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Debug API Response</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(debugData, null, 2)}
            </pre>
          </div>
        )}

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Checks</h2>
          <p><strong>Email:</strong> {session?.user?.email || 'Not logged in'}</p>
          <p><strong>Role:</strong> {session?.user?.role || 'No role'}</p>
          <p><strong>Is Admin:</strong> {session?.user?.role === 'admin' ? 'Yes' : 'No'}</p>
          <p><strong>Email Domain:</strong> {session?.user?.email?.split('@')[1] || 'N/A'}</p>
          <p><strong>Should Be Admin:</strong> {session?.user?.email?.toLowerCase().endsWith('@shipsquared.com') ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
} 