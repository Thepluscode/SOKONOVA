
import { useState } from 'react';

interface StockNotificationProps {
  productId: string;
  productName: string;
  productImage: string;
}

export default function StockNotification({
  productId,
  productName,
  productImage,
}: StockNotificationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;

    // Save notification request to localStorage
    const notifications = JSON.parse(localStorage.getItem('sokonova_stock_notifications') || '[]');
    notifications.push({
      productId,
      productName,
      productImage,
      email,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('sokonova_stock_notifications', JSON.stringify(notifications));

    setIsSubscribed(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsSubscribed(false);
      setEmail('');
    }, 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
      >
        <i className="ri-notification-line mr-2"></i>
        Notify When Available
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            {!isSubscribed ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Back in Stock Alert</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 hover:bg-gray-100 rounded-full flex items-center justify-center cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-close-line text-gray-600"></i>
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={productImage}
                      alt={productName}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 line-clamp-2">{productName}</p>
                    <p className="text-sm text-red-600 mt-1">
                      <i className="ri-close-circle-line mr-1"></i>
                      Out of Stock
                    </p>
                  </div>
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

                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <i className="ri-information-line text-emerald-600 mt-0.5"></i>
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          We'll notify you when it's back
                        </p>
                        <p className="text-sm text-gray-700">
                          Get an email as soon as this product is available again. No spam, just the notification you want.
                        </p>
                      </div>
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
                      Notify Me
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-checkbox-circle-fill text-4xl text-green-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">You're on the list!</h3>
                <p className="text-gray-600">
                  We'll send an email to <span className="font-semibold">{email}</span> when this product is back in stock.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
