import React, { useState } from 'react';
import SettingsBlock from './SettingsBlock';

export default function ReturnsTab() {
  const [allowReturns, setAllowReturns] = useState(false);
  const [returnDays, setReturnDays] = useState('30');
  const [shippingCost, setShippingCost] = useState('8');
  const [returnAddress, setReturnAddress] = useState('');
  const [countries, setCountries] = useState(['United States of America']);
  const [countryInput, setCountryInput] = useState('');

  function handleAddCountry() {
    if (countryInput && !countries.includes(countryInput)) {
      setCountries([...countries, countryInput]);
      setCountryInput('');
    }
  }
  function handleRemoveCountry(country: string) {
    setCountries(countries.filter(c => c !== country));
  }
  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Save logic
    alert('Returns settings saved!');
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <SettingsBlock title="Returns" description="Configure your store's return policy and workflow.">
        <div className="mb-6">
          <label className="block font-medium mb-2">Do you want to allow returns?</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={!allowReturns}
                onChange={() => setAllowReturns(false)}
                className="accent-blue-600"
              />
              <span>Don't allow returns</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={allowReturns}
                onChange={() => setAllowReturns(true)}
                className="accent-blue-600"
              />
              <span>Allow returns</span>
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block font-medium mb-1">For how long after shipping will you accept items to be returned? (days)</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 mt-1"
              value={returnDays}
              onChange={e => setReturnDays(e.target.value)}
              min="1"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Flat rate shipping cost ($)</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 mt-1"
              value={shippingCost}
              onChange={e => setShippingCost(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block font-medium mb-1">Return address</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mt-1"
              value={returnAddress}
              onChange={e => setReturnAddress(e.target.value)}
              placeholder="Enter return address"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block font-medium mb-1">Countries you accept returns from</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {countries.map(country => (
                <span key={country} className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {country}
                  <button type="button" className="ml-2 text-blue-500 hover:text-blue-700" onClick={() => handleRemoveCountry(country)}>&times;</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="border rounded px-3 py-2 w-64"
                value={countryInput}
                onChange={e => setCountryInput(e.target.value)}
                placeholder="Add country"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCountry();
                  }
                }}
              />
              <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700" onClick={handleAddCountry}>Add country</button>
            </div>
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