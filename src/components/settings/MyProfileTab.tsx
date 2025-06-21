import React, { useState } from 'react';
import SettingsBlock from './SettingsBlock';

export default function MyProfileTab() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email] = useState('user@example.com');
  const [password, setPassword] = useState('');

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Save logic
    alert('Profile saved!');
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <SettingsBlock title="My Profile" description="Update your personal information.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mt-1"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mt-1"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed"
              value={email}
              readOnly
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Change Password</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2 mt-1"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="New password"
            />
          </div>
        </div>
      </SettingsBlock>
      <div className="flex justify-end gap-2 mt-8">
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
} 