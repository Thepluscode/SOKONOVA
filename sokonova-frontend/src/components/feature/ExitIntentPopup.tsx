import { useState, useEffect } from 'react';

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('exitIntentSeen');
    if (hasSeenPopup) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isVisible) {
        setIsVisible(true);
        localStorage.setItem('exitIntentSeen', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [isVisible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Save to localStorage
    const subscribers = JSON.parse(localStorage.getItem('exitIntentSubscribers') || '[]');
    subscribers.push({ email, date: new Date().toISOString() });
    localStorage.setItem('exitIntentSubscribers', JSON.stringify(subscribers));

    setIsSubmitted(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fadeIn">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-slideUp">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors z-10"
          aria-label="Close popup"
        >
          <i className="ri-close-line text-xl"></i>
        </button>

        {!isSubmitted ? (
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-gift-line text-3xl text-white"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Wait! Don't Miss Out
              </h2>
              <p className="text-gray-600">
                Get <span className="font-bold text-emerald-600">15% OFF</span> your first order when you subscribe to our newsletter!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all cursor-pointer whitespace-nowrap"
              >
                Get My 15% OFF Code
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
            </p>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-check-line text-3xl text-emerald-600"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Thank You!
            </h3>
            <p className="text-gray-600">
              Check your email for your exclusive 15% discount code!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
