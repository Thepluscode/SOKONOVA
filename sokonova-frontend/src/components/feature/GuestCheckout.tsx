import { useState } from 'react';

interface GuestCheckoutProps {
  onContinue: (guestInfo: GuestInfo) => void;
}

interface GuestInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export default function GuestCheckout({ onContinue }: GuestCheckoutProps) {
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Partial<GuestInfo>>({});

  const validateForm = () => {
    const newErrors: Partial<GuestInfo> = {};

    if (!guestInfo.email) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(guestInfo.email)) {
      newErrors.email = 'Email address is invalid.';
    }

    if (!guestInfo.firstName) {
      newErrors.firstName = 'First name is required.';
    }

    if (!guestInfo.lastName) {
      newErrors.lastName = 'Last name is required.';
    }

    if (!guestInfo.phone) {
      newErrors.phone = 'Phone number is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onContinue(guestInfo);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
          <i className="ri-user-line text-emerald-600 text-xl"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Guest Checkout</h2>
          <p className="text-sm text-gray-600">No account needed - checkout quickly.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={guestInfo.firstName}
              onChange={(e) => setGuestInfo({ ...guestInfo, firstName: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="John"
            />
            {errors.firstName && (
              <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={guestInfo.lastName}
              onChange={(e) => setGuestInfo({ ...guestInfo, lastName: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={guestInfo.email}
            onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="john.doe@example.com"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            We'll send your order confirmation here
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={guestInfo.phone}
            onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+234 800 000 0000"
          />
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <i className="ri-information-line text-emerald-600 text-xl flex-shrink-0 mt-0.5"></i>
            <div>
              <h4 className="font-medium text-emerald-900 mb-1">Why create an account?</h4>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• Track your orders easily</li>
                <li>• Save addresses for faster checkout</li>
                <li>• Get exclusive deals and rewards</li>
                <li>• View your order history</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap"
        >
          Continue to Shipping
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => window.REACT_APP_NAVIGATE('/login')}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer whitespace-nowrap"
          >
            Already have an account? Sign in
          </button>
        </div>
      </form>
    </div>
  );
}
