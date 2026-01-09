import { useState } from 'react';

interface Address {
  id: string;
  label: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface SavedAddressesProps {
  onSelectAddress: (address: Address) => void;
}

export default function SavedAddresses({ onSelectAddress }: SavedAddressesProps) {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      label: 'Home',
      name: 'John Doe',
      street: '123 Main Street, Apt 4B',
      city: 'Lagos',
      state: 'Lagos State',
      zipCode: '100001',
      country: 'Nigeria',
      phone: '+234 800 000 0000',
      isDefault: true,
    },
    {
      id: '2',
      label: 'Office',
      name: 'John Doe',
      street: '456 Business Avenue, Floor 5',
      city: 'Lagos',
      state: 'Lagos State',
      zipCode: '100002',
      country: 'Nigeria',
      phone: '+234 800 000 0001',
      isDefault: false,
    },
  ]);

  const [selectedId, setSelectedId] = useState(addresses.find((a) => a.isDefault)?.id || '');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSelect = (address: Address) => {
    setSelectedId(address.id);
    onSelectAddress(address);
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    })));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter((addr) => addr.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line"></i>
          Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedId === address.id
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-gray-200 hover:border-emerald-300'
            }`}
            onClick={() => handleSelect(address)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedId === address.id
                    ? 'border-emerald-600 bg-emerald-600'
                    : 'border-gray-300'
                }`}>
                  {selectedId === address.id && (
                    <i className="ri-check-line text-white text-xs"></i>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{address.label}</h3>
                  {address.isDefault && (
                    <span className="text-xs text-emerald-600 font-medium">Default</span>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAddModal(true);
                  }}
                  className="w-8 h-8 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-edit-line text-gray-600"></i>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(address.id);
                  }}
                  className="w-8 h-8 hover:bg-red-50 rounded-full flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-delete-bin-line text-red-600"></i>
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">{address.name}</p>
              <p>{address.street}</p>
              <p>{address.city}, {address.state} {address.zipCode}</p>
              <p>{address.country}</p>
              <p className="flex items-center gap-2 mt-2">
                <i className="ri-phone-line"></i>
                {address.phone}
              </p>
            </div>

            {!address.isDefault && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSetDefault(address.id);
                }}
                className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer whitespace-nowrap"
              >
                Set as Default
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Add New Address</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Home, Office, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP/Postal Code
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm">
                      <option>Nigeria</option>
                      <option>Kenya</option>
                      <option>Ghana</option>
                      <option>South Africa</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">Set as default address</span>
                </label>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
