import { useState, useEffect } from 'react';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import { useToast } from '../../../contexts/ToastContext';
import { adminService } from '../../../lib/services';
import { useRequireAuth } from '../../../lib/auth';

interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  rates: {
    name: string;
    price: number;
    estimatedDays: string;
  }[];
}

export default function AdminShippingSettingsPage() {
  useRequireAuth('ADMIN');

  const { showToast } = useToast();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(5000);
  const [localPickupEnabled, setLocalPickupEnabled] = useState(true);

  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([
    {
      id: '1',
      name: 'Kenya',
      countries: ['Kenya'],
      rates: [
        { name: 'Standard Shipping', price: 300, estimatedDays: '3-5' },
        { name: 'Express Shipping', price: 600, estimatedDays: '1-2' },
        { name: 'Free Shipping', price: 0, estimatedDays: '5-7' },
      ],
    },
    {
      id: '2',
      name: 'East Africa',
      countries: ['Uganda', 'Tanzania', 'Rwanda', 'Burundi'],
      rates: [
        { name: 'Regional Shipping', price: 1500, estimatedDays: '5-10' },
        { name: 'Express Regional', price: 2500, estimatedDays: '3-5' },
      ],
    },
    {
      id: '3',
      name: 'Rest of Africa',
      countries: ['Nigeria', 'South Africa', 'Ghana', 'Egypt', 'Other African Countries'],
      rates: [
        { name: 'Continental Shipping', price: 3000, estimatedDays: '10-15' },
      ],
    },
    {
      id: '4',
      name: 'International',
      countries: ['United States', 'United Kingdom', 'Europe', 'Asia', 'Rest of World'],
      rates: [
        { name: 'International Standard', price: 5000, estimatedDays: '15-30' },
        { name: 'International Express', price: 8000, estimatedDays: '7-14' },
      ],
    },
  ]);

  const [pickupLocations] = useState([
    { name: 'Nairobi Hub', address: 'Westlands, Nairobi' },
    { name: 'Mombasa Hub', address: 'Nyali, Mombasa' },
  ]);

  useEffect(() => {
    adminService.getShippingSettings()
      .then(data => {
        if (data) {
          if (data.zones) setShippingZones(data.zones);
          if (data.freeShippingThreshold) setFreeShippingThreshold(data.freeShippingThreshold);
          if (typeof data.localPickupEnabled === 'boolean') setLocalPickupEnabled(data.localPickupEnabled);
        }
      })
      .catch(err => console.error('Failed to fetch shipping settings:', err));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminService.updateShippingSettings({
        zones: shippingZones,
        freeShippingThreshold,
        localPickupEnabled,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      showToast({ message: 'Shipping settings saved!', type: 'success' });
    } catch (err: any) {
      console.error('Failed to save shipping settings:', err);
      showToast({ message: err.message || 'Failed to save settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const updateRate = (zoneId: string, rateIndex: number, field: 'price' | 'estimatedDays', value: string | number) => {
    setShippingZones(zones =>
      zones.map(zone => {
        if (zone.id === zoneId) {
          const newRates = [...zone.rates];
          newRates[rateIndex] = {
            ...newRates[rateIndex],
            [field]: field === 'price' ? Number(value) : value,
          };
          return { ...zone, rates: newRates };
        }
        return zone;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipping Settings</h1>
          <p className="text-gray-600">Configure shipping zones, rates, and delivery options</p>
        </div>

        {saved && (
          <div className="mb-6 bg-teal-50 border border-teal-200 text-teal-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <i className="ri-check-line text-xl"></i>
            <span>Shipping settings saved successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Settings */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i className="ri-settings-3-line text-teal-600"></i>
                General Settings
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Free Shipping Threshold (KES)
                  </label>
                  <input
                    type="number"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="5000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Orders above this amount qualify for free shipping
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Enable Local Pickup</h3>
                    <p className="text-xs text-gray-500 mt-1">Allow customers to pick up orders</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localPickupEnabled}
                      onChange={(e) => setLocalPickupEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Shipping Zones */}
            {shippingZones.map((zone) => (
              <div key={zone.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <i className="ri-map-pin-line text-xl text-teal-600"></i>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{zone.name}</h2>
                    <p className="text-sm text-gray-500">{zone.countries.join(', ')}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {zone.rates.map((rate, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{rate.name}</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Price (KES)
                          </label>
                          <input
                            type="number"
                            value={rate.price}
                            onChange={(e) => updateRate(zone.id, index, 'price', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Delivery Time (days)
                          </label>
                          <input
                            type="text"
                            value={rate.estimatedDays}
                            onChange={(e) => updateRate(zone.id, index, 'estimatedDays', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="3-5"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Pickup Locations */}
            {localPickupEnabled && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <i className="ri-store-3-line text-teal-600"></i>
                  Pickup Locations
                </h2>

                <div className="space-y-3">
                  {pickupLocations.map((location, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{location.name}</h3>
                        <p className="text-sm text-gray-500">{location.address}</p>
                      </div>
                      <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              Save Shipping Settings
            </button>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Info</h2>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <i className="ri-information-line text-blue-600 mt-0.5"></i>
                      <div>
                        <h3 className="text-sm font-semibold text-blue-900 mb-1">Zone Priority</h3>
                        <p className="text-xs text-blue-700">
                          Zones are checked from top to bottom. More specific zones should be listed first.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <i className="ri-truck-line text-amber-600 mt-0.5"></i>
                      <div>
                        <h3 className="text-sm font-semibold text-amber-900 mb-1">Carrier Integration</h3>
                        <p className="text-xs text-amber-700">
                          Connect with DHL, FedEx, or UPS for real-time rates and tracking.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Zones</span>
                    <span className="text-sm font-semibold text-gray-900">{shippingZones.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Shipping Methods</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {shippingZones.reduce((acc, zone) => acc + zone.rates.length, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pickup Locations</span>
                    <span className="text-sm font-semibold text-gray-900">{pickupLocations.length}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Carrier Partners</h3>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer">
                    <i className="ri-add-line mr-2"></i>
                    Connect DHL
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer">
                    <i className="ri-add-line mr-2"></i>
                    Connect FedEx
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer">
                    <i className="ri-add-line mr-2"></i>
                    Connect UPS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
