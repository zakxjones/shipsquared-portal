import React, { useState } from 'react';
import SettingsBlock from './SettingsBlock';

const initialData = {
  timezone: '',
  companyName: '',
  address1: '',
  address2: '',
  country: '',
  state: '',
  city: '',
  zip: '',
  phone: '',
  supportEmail: '',
  storeLogo: null as File | null,
};

export default function GeneralTab() {
  const [form, setForm] = useState(initialData);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, storeLogo: file }));
      setLogoPreview(URL.createObjectURL(file));
    }
  }

  function handleCancel() {
    setForm(initialData);
    setLogoPreview(null);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Save logic
    alert('Saved!');
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <SettingsBlock
        title="Company Information"
        description="This information is used in invoices sent to your clients."
        actions={
          <a href="#" className="text-blue-600 hover:underline text-sm">Preview invoice</a>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium mb-1">Store Name</label>
            <input
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={handleInputChange}
              placeholder="Enter your store name"
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Store Logo</label>
            <div className="flex items-center gap-3 mt-1">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo Preview" className="h-12 w-12 object-contain border rounded" />
              ) : (
                <div className="h-12 w-12 flex items-center justify-center border bg-gray-100 text-gray-400 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v4a1 1 0 001 1h3m10-5h2a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h2m2 0V5a2 2 0 114 0v2m-4 0h4" /></svg>
                </div>
              )}
              <label className="inline-block">
                <span className="sr-only">Upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                <button type="button" className="ml-2 px-3 py-1 border rounded bg-white text-gray-700 hover:bg-gray-50">Upload</button>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              name="address1"
              value={form.address1}
              onChange={handleInputChange}
              placeholder="Address line 1"
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address 2</label>
            <input
              type="text"
              name="address2"
              value={form.address2}
              onChange={handleInputChange}
              placeholder="Address line 2"
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleInputChange}
              placeholder="Country"
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State / Province</label>
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleInputChange}
              placeholder="State or Province"
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleInputChange}
              placeholder="City"
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Zip</label>
            <input
              type="text"
              name="zip"
              value={form.zip}
              onChange={handleInputChange}
              placeholder="Zip code"
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
              placeholder="Phone number"
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Customer Support Email</label>
            <input
              type="email"
              name="supportEmail"
              value={form.supportEmail}
              onChange={handleInputChange}
              placeholder="Support email"
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
        </div>
      </SettingsBlock>
      <SettingsBlock
        title="Timezone"
        description="Set your store's default timezone."
      >
        <div className="max-w-xs">
          <input
            type="text"
            name="timezone"
            value={form.timezone}
            onChange={handleInputChange}
            placeholder="Select your timezone"
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>
      </SettingsBlock>
      <div className="flex justify-end gap-2 mt-8">
        <button
          type="button"
          className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
          onClick={handleCancel}
        >
          Cancel
        </button>
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