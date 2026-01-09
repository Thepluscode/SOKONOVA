
import { useState } from 'react';

interface EnhancedPriceAlertProps {
  productId: string;
  productName: string;
  currentPrice: number;
  onClose: () => void;
}

export default function EnhancedPriceAlert({
  productId,
  productName,
  currentPrice,
  onClose
}: EnhancedPriceAlertProps) {
  const [alertType, setAlertType] = useState<'percentage' | 'fixed'>('percentage');
  const [percentageValue, setPercentageValue] = useState(10);
  const [fixedValue, setFixedValue] = useState(currentPrice * 0.9);
  const [email, setEmail] = useState('');
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState(false);

  const targetPrice = alertType === 'percentage'
    ? currentPrice * (1 - percentageValue / 100)
    : fixedValue;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const alert = {
      productId,
      productName,
      currentPrice,
      targetPrice,
      alertType,
      email,
      smsEnabled,
      phone: smsEnabled ? phone : null,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const alerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
    alerts.push(alert);
    localStorage.setItem('priceAlerts', JSON.stringify(alerts));

    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-check-line text-3xl text-green-600"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Alert Set!</h3>
          <p className="text-gray-600">
            We'll notify you when the price drops to ${targetPrice.toFixed(2)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Price Drop Alert</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors whitespace-nowrap"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-2">{productName}</p>
          <p className="text-2xl font-bold text-gray-900">
            Current Price: ${currentPrice.toFixed(2)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Alert Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Alert me when price drops by:
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setAlertType('percentage')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors whitespace-nowrap ${
                  alertType === 'percentage'
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                Percentage
              </button>
              <button
                type="button"
                onClick={() => setAlertType('fixed')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors whitespace-nowrap ${
                  alertType === 'fixed'
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                Fixed Price
              </button>
            </div>
          </div>

          {/* Value Input */}
          {alertType === 'percentage' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Percentage Drop
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={percentageValue}
                  onChange={(e) => setPercentageValue(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-2xl font-bold text-teal-600 w-16">
                  {percentageValue}%
                </span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={fixedValue}
                  onChange={(e) => setFixedValue(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          )}

          {/* Target Price Display */}
          <div className="bg-teal-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">You'll be notified when price reaches:</p>
            <p className="text-3xl font-bold text-teal-600">
              ${targetPrice.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Save ${(currentPrice - targetPrice).toFixed(2)} ({percentageValue}% off)
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* SMS Option */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={smsEnabled}
                onChange={(e) => setSmsEnabled(e.target.checked)}
                className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Also send SMS notifications
              </span>
            </label>
            {smsEnabled && (
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors font-medium whitespace-nowrap"
          >
            Set Price Alert
          </button>
        </form>
      </div>
    </div>
  );
}
