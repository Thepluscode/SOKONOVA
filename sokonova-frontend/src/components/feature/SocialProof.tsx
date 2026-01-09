import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  userName: string;
  userLocation: string;
  productName: string;
  action: 'purchased' | 'reviewed' | 'wishlisted';
  timeAgo: string;
}

export default function SocialProof() {
  // TODO: Fetch real purchase notifications from backend API
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % notifications.length);
        setIsVisible(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [notifications.length]);

  const currentNotification = notifications[currentIndex];

  // Don't render if no notifications
  if (notifications.length === 0) {
    return null;
  }

  const getActionText = (action: string) => {
    switch (action) {
      case 'purchased':
        return 'just purchased';
      case 'reviewed':
        return 'just reviewed';
      case 'wishlisted':
        return 'added to wishlist';
      default:
        return 'interacted with';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'purchased':
        return 'ri-shopping-bag-line';
      case 'reviewed':
        return 'ri-star-line';
      case 'wishlisted':
        return 'ri-heart-line';
      default:
        return 'ri-notification-line';
    }
  };

  return (
    <div
      className={`fixed bottom-6 left-6 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm z-40 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
          <i className={`${getActionIcon(currentNotification.action)} text-emerald-600 text-lg`}></i>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 mb-1">
            <span className="font-semibold">{currentNotification.userName}</span> from{' '}
            <span className="font-medium">{currentNotification.userLocation}</span>
          </p>
          <p className="text-sm text-gray-600 mb-1">
            {getActionText(currentNotification.action)}{' '}
            <span className="font-medium text-gray-900">{currentNotification.productName}</span>
          </p>
          <p className="text-xs text-gray-500">{currentNotification.timeAgo}</p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="w-6 h-6 hover:bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-close-line text-gray-400"></i>
        </button>
      </div>
    </div>
  );
}
