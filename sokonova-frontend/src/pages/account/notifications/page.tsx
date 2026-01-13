import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import SkeletonLoader from '../../../components/base/SkeletonLoader';
import { notificationsService } from '../../../lib/services';
import { useAuth } from '../../../lib/auth';

type NotificationType = 'all' | 'orders' | 'promotions' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
  iconColor: string;
  orderId?: string;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<NotificationType>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from API
  useEffect(() => {
    async function fetchNotifications() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const apiNotifications = await notificationsService.list();

        // Transform API response
        setNotifications(apiNotifications.map((n: any) => ({
          id: n.id,
          type: getCategoryForType(n.type),
          title: n.title || 'Notification',
          message: n.body || n.message || '',
          time: formatTimeAgo(n.createdAt),
          read: n.readAt !== null,
          icon: getIconForType(n.type),
          iconColor: getColorForType(n.type),
          orderId: n.data?.orderId,
        })));
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, [user?.id]);

  function formatTimeAgo(date: string): string {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  }

  function getCategoryForType(type: string): NotificationType {
    const normalized = type?.toLowerCase() || '';
    if (normalized.startsWith('order_') || normalized === 'new_review') {
      return 'orders';
    }
    if (normalized.startsWith('payout') || normalized.startsWith('dispute')) {
      return 'system';
    }
    if (normalized.includes('promotion')) {
      return 'promotions';
    }
    return 'system';
  }

  function getIconForType(type: string): string {
    const normalized = type?.toLowerCase() || '';
    if (normalized.startsWith('order_')) return 'ri-truck-line';
    if (normalized.startsWith('payout')) return 'ri-money-dollar-circle-line';
    if (normalized.startsWith('dispute')) return 'ri-error-warning-line';
    if (normalized === 'new_review') return 'ri-star-line';
    if (normalized.includes('promotion')) return 'ri-fire-line';
    return 'ri-notification-line';
  }

  function getColorForType(type: string): string {
    const normalized = type?.toLowerCase() || '';
    if (normalized.startsWith('order_')) return 'text-emerald-600';
    if (normalized.startsWith('payout')) return 'text-green-600';
    if (normalized.startsWith('dispute')) return 'text-red-600';
    if (normalized === 'new_review') return 'text-amber-600';
    if (normalized.includes('promotion')) return 'text-orange-600';
    return 'text-blue-600';
  }

  const filterCounts = {
    all: notifications.length,
    orders: notifications.filter(n => n.type === 'orders').length,
    promotions: notifications.filter(n => n.type === 'promotions').length,
    system: notifications.filter(n => n.type === 'system').length
  };

  const filteredNotifications = activeFilter === 'all'
    ? notifications
    : notifications.filter(n => n.type === activeFilter);

  const markAsRead = async (id: string) => {
    try {
      await notificationsService.markRead(id);
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationsService.delete(id);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Notifications</h1>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <SkeletonLoader key={i} type="text" />)}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <button
              onClick={markAllAsRead}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium whitespace-nowrap"
            >
              Mark all as read
            </button>
          </div>
          <p className="text-gray-600">Stay updated with your orders and promotions</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            {(['all', 'orders', 'promotions', 'system'] as NotificationType[]).map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeFilter === filter
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)} ({filterCounts[filter]})
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <i className="ri-notification-off-line text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">No notifications in this category.</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-sm p-4 transition-all hover:shadow-md ${!notification.read ? 'border-l-4 border-emerald-600' : ''
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <i className={`${notification.icon} text-xl ${notification.iconColor}`}></i>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{notification.message}</p>

                    <div className="flex items-center gap-4">
                      {notification.orderId && (
                        <Link
                          to={`/orders/${notification.orderId}/tracking`}
                          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium whitespace-nowrap"
                        >
                          View order
                        </Link>
                      )}
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium whitespace-nowrap"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-xs text-red-600 hover:text-red-700 font-medium whitespace-nowrap"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Settings Link */}
        <div className="mt-8 text-center">
          <Link
            to="/account/settings/notifications"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            <i className="ri-settings-3-line"></i>
            Notification Settings
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
