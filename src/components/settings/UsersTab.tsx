import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: string;
}

export default function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Fetch users
  useEffect(() => {
    setLoading(true);
    fetch('/api/store/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load users');
        setLoading(false);
      });
  }, []);

  // Invite user
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setError(null);
    try {
      const res = await fetch('/api/store/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail }),
      });
      if (!res.ok) throw new Error('Failed to invite');
      setInviteEmail('');
      // Refetch users
      const usersRes = await fetch('/api/store/users');
      const usersData = await usersRes.json();
      setUsers(usersData.users || []);
    } catch {
      setError('Failed to invite user');
    } finally {
      setInviting(false);
    }
  };

  // Remove user
  const handleRemove = async (userId: string) => {
    setRemovingId(userId);
    setError(null);
    try {
      const res = await fetch(`/api/store/users/${userId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove');
      // Refetch users
      const usersRes = await fetch('/api/store/users');
      const usersData = await usersRes.json();
      setUsers(usersData.users || []);
    } catch {
      setError('Failed to remove user');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Users with access to this store</h2>
      <form onSubmit={handleInvite} className="flex items-center gap-2 mb-6">
        <input
          type="email"
          value={inviteEmail}
          onChange={e => setInviteEmail(e.target.value)}
          placeholder="Invite user by email"
          className="border rounded px-3 py-2 w-64"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={inviting}
        >
          {inviting ? 'Inviting...' : 'Invite'}
        </button>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div>Loading users...</div>
      ) : (
        <div className="border rounded-lg divide-y">
          {users.map(user => (
            <div key={user.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <span className="font-medium">{user.email}</span>
                <span className="ml-2 text-xs text-gray-500">({user.role})</span>
              </div>
              {user.role !== 'Owner' && (
                <button
                  className="text-red-600 hover:underline text-sm disabled:opacity-50"
                  onClick={() => handleRemove(user.id)}
                  disabled={removingId === user.id}
                >
                  {removingId === user.id ? 'Removing...' : 'Remove'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 