
import { useState } from 'react';

interface PriceDropAlertProps {
  productId: string;
  productName: string;
  currentPrice: number;
}

export default function PriceDropAlert({
  productId,
  productName,
  currentPrice,
}: PriceDropAlertProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !targetPrice) return;

    // Save alert to localStorage
    const alerts = JSON.parse(localStorage.getItem('sokonova_price_alerts') || '[]');
    alerts.push({
      productId,
      productName,
      currentPrice,
      targetPrice: parseFloat(targetPrice),
      email,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('sokonova_price_alerts', JSON.stringify(alerts));

    setIsSubscribed(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsSubscribed(false);
      setEmail('');
      setTargetPrice('');
    }, 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
      >
        <i className="ri-notification-line"></i>
        <span className="text-sm font-medium">Price Drop Alert</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            {!isSubscribed ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Price Drop Alert</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 hover:bg-gray-100 rounded-full flex items-center justify-center cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-close-line text-gray-600"></i>
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Product</p>
                  <p className="font-medium text-gray-900">{productName}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Current price: <span className="font-semibold text-emerald-600">${currentPrice.toFixed(2)}</span>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                      <input
                        type="number"
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        max={currentPrice}
                        required
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      We'll notify you when the price drops to or below this amount
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <i className="ri-information-line text-emerald-600 mt-0.5"></i>
                      <p className="text-sm text-gray-700">
                        You'll receive an email notification when the price drops. You can unsubscribe at any time.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Set Alert
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-checkbox-circle-fill text-4xl text-green-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Alert Set!</h3>
                <p className="text-gray-600">
                  We'll notify you at <span className="font-semibold">{email}</span> when the price drops to ${targetPrice}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
