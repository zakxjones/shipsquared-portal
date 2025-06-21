"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FixSessionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [refreshData, setRefreshData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkSession = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/refresh-session', {
        method: 'POST'
      });
      const data = await response.json();
      setRefreshData(data);
    } catch (error) {
      console.error('Failed to check session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshSession = async () => {
    setLoading(true);
    try {
      // Sign out to clear the session
      await signOut({ redirect: false });
      
      // Redirect to login to get a fresh session
      router.push('/login');
    } catch (error) {
      console.error('Failed to refresh session:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      checkSession();
    }
  }, [session]);

  if (status === "loading") return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Session Fix Tool</h1>
      
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Current Session</h2>
          <p><strong>Email:</strong> {session?.user?.email || 'Not logged in'}</p>
          <p><strong>Role:</strong> {session?.user?.role || 'No role'}</p>
          <p><strong>Should Be Admin:</strong> {session?.user?.email?.toLowerCase().endsWith('@shipsquared.com') ? 'Yes' : 'No'}</p>
        </div>

        {refreshData && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Database Check</h2>
            <p><strong>Database Role:</strong> {refreshData.user?.role}</p>
            <p><strong>Session Role:</strong> {refreshData.currentSession?.role}</p>
            <p><strong>Needs Refresh:</strong> {refreshData.needsRefresh ? 'Yes' : 'No'}</p>
            
            {refreshData.needsRefresh && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-800">
                  ⚠️ Your session has outdated role information. 
                  The database shows you should be an admin, but your session doesn't reflect this.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          
          <div className="space-y-4">
            <button
              onClick={checkSession}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Check Session'}
            </button>

            <button
              onClick={handleRefreshSession}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-4"
            >
              {loading ? 'Refreshing...' : 'Refresh Session (Logout & Login)'}
            </button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-800">
              💡 <strong>How to fix:</strong> If your session shows the wrong role, 
              click "Refresh Session" to log out and log back in. This will give you a fresh session with the correct role.
            </p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify({ session, refreshData }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
} 