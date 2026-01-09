import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'system' | 'price_drop' | 'stock';
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
  image?: string;
}

interface NotificationCenterProps {
  onClose: () => void;
  onUpdateCount: (count: number) => void;
}

export default function NotificationCenter({ onClose, onUpdateCount }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'Order Shipped',
      message: 'Your order #12345 has been shipped and is on its way!',
      time: '5 minutes ago',
      read: false,
      link: '/buyer-orders',
    },
    {
      id: '2',
      type: 'price_drop',
      title: 'Price Drop Alert',
      message: 'Wireless Headphones dropped to $79.99 (20% off)',
      time: '1 hour ago',
      read: false,
      link: '/products/1',
      image: 'https://readdy.ai/api/search-image?query=modern%20wireless%20headphones%20with%20sleek%20black%20design%20on%20white%20background%20product%20photography&width=80&height=80&seq=notif1&orientation=squarish',
    },
    {
      id: '3',
      type: 'stock',
      title: 'Back in Stock',
      message: 'Smart Watch Pro is now available!',
      time: '3 hours ago',
      read: false,
      link: '/products/2',
      image: 'https://readdy.ai/api/search-image?query=elegant%20smart%20watch%20with%20black%20band%20on%20white%20background%20product%20photography&width=80&height=80&seq=notif2&orientation=squarish',
    },
    {
      id: '4',
      type: 'promotion',
      title: 'Flash Sale Starting',
      message: 'Up to 50% off on Electronics - Starts in 30 minutes',
      time: '2 hours ago',
      read: true,
    },
    {
      id: '5',
      type: 'system',
      title: 'Account Security',
      message: 'New login detected from Chrome on Windows',
      time: '1 day ago',
      read: true,
    },
  ]);

  useEffect(() => {
    const unreadCount = notifications.filter(n => !n.read).length;
    onUpdateCount(unreadCount);
  }, [notifications, onUpdateCount]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return 'ri-shopping-bag-line';
      case 'promotion':
        return 'ri-price-tag-3-line';
      case 'price_drop':
        return 'ri-arrow-down-circle-line';
      case 'stock':
        return 'ri-stock-line';
      case 'system':
        return 'ri-information-line';
      default:
        return 'ri-notification-3-line';
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-teal-100 text-teal-600';
      case 'promotion':
        return 'bg-orange-100 text-orange-600';
      case 'price_drop':
        return 'bg-green-100 text-green-600';
      case 'stock':
        return 'bg-blue-100 text-blue-600';
      case 'system':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      ></div>

      {/* Notification Panel */}
      <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
            <p className="text-sm text-gray-500">
              {notifications.filter(n => !n.read).length} unread
            </p>
          </div>
          <button
            onClick={markAllAsRead}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium whitespace-nowrap"
          >
            Mark all read
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i className="ri-notification-off-line text-3xl text-gray-400"></i>
              </div>
              <p className="text-gray-500 text-center">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-teal-50/30' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Icon or Image */}
                    {notification.image ? (
                      <img
                        src={notification.image}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getColor(notification.type)}`}>
                        <i className={`${getIcon(notification.type)} text-xl`}></i>
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{notification.time}</span>
                        <div className="flex items-center gap-2">
                          {notification.link && (
                            <Link
                              to={notification.link}
                              onClick={() => {
                                markAsRead(notification.id);
                                onClose();
                              }}
                              className="text-xs text-teal-600 hover:text-teal-700 font-medium whitespace-nowrap"
                            >
                              View
                            </Link>
                          )}
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-gray-500 hover:text-gray-700 whitespace-nowrap"
                            >
                              Mark read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-gray-400 hover:text-red-600 whitespace-nowrap"
                          >
                            <i className="ri-close-line"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200">
          <Link
            to="/account/notifications"
            onClick={onClose}
            className="block text-center text-sm text-teal-600 hover:text-teal-700 font-medium whitespace-nowrap"
          >
            View all notifications
          </Link>
        </div>
      </div>
    </>
  );
}
