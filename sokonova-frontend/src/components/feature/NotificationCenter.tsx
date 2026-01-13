import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationsService } from '../../lib/services';
import { useAuth } from '../../lib/auth';

interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'system' | 'price_drop' | 'stock';
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
  image?: string;
  orderId?: string;
}

interface NotificationCenterProps {
  onClose: () => void;
  onUpdateCount: (count: number) => void;
}

export default function NotificationCenter({ onClose, onUpdateCount }: NotificationCenterProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unreadCount = notifications.filter(n => !n.read).length;
    onUpdateCount(unreadCount);
  }, [notifications, onUpdateCount]);

  useEffect(() => {
    let active = true;

    async function fetchNotifications() {
      if (!user?.id) {
        if (active) {
          setNotifications([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const apiNotifications = await notificationsService.list({ limit: 10 });
        if (!active) return;
        setNotifications(
          apiNotifications.map((n: any) => ({
            id: n.id,
            type: mapCategory(n.type),
            title: n.title || 'Notification',
            message: n.body || n.message || '',
            time: formatTimeAgo(n.createdAt),
            read: n.readAt !== null,
            orderId: n.data?.orderId,
          })),
        );
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchNotifications();
    return () => {
      active = false;
    };
  }, [user?.id]);

  const markAsRead = async (id: string) => {
    try {
      await notificationsService.markRead(id);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationsService.delete(id);
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const mapCategory = (type: string): Notification['type'] => {
    const normalized = type?.toLowerCase() || '';
    if (normalized.startsWith('order_') || normalized === 'new_review') return 'order';
    if (normalized.includes('promotion')) return 'promotion';
    if (normalized === 'price_drop') return 'price_drop';
    if (normalized === 'stock') return 'stock';
    return 'system';
  };

  const formatTimeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
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
          {loading ? (
            <div className="p-4 text-sm text-gray-500">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i className="ri-notification-off-line text-3xl text-gray-400"></i>
              </div>
              <p className="text-gray-500 text-center">No notifications yet.</p>
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
                          {notification.orderId && (
                            <Link
                              to={`/orders/${notification.orderId}/tracking`}
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
