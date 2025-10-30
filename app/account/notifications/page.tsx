import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Bell, CheckCheck, Clock } from "lucide-react";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/lib/api";

/**
 * Notifications Inbox Page
 *
 * Displays all notifications for the logged-in user.
 *
 * Features:
 * - List all notifications (read and unread)
 * - Visual indicator for unread notifications
 * - Mark individual notification as read
 * - Mark all notifications as read
 * - Timestamp display
 * - Type-based styling
 * - Notification data preview
 */

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  data?: any;
  readAt: string | null;
  createdAt: string;
}

async function loadNotifications(userId: string): Promise<Notification[]> {
  try {
    return await getNotifications(userId, 50, false);
  } catch (error) {
    console.error("Failed to load notifications:", error);
    return [];
  }
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "ORDER_PAID":
      return "💰";
    case "SHIPMENT_UPDATE":
      return "📦";
    case "DISPUTE_OPENED":
    case "DISPUTE_RESOLVED":
      return "⚠️";
    case "PAYOUT_RELEASED":
      return "💵";
    case "NEW_REVIEW":
      return "⭐";
    case "RISK_ALERT":
      return "🚨";
    default:
      return "🔔";
  }
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

async function handleMarkRead(notificationId: string, userId: string) {
  "use server";
  try {
    await markNotificationRead(notificationId, userId);
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
}

async function handleMarkAllRead(userId: string) {
  "use server";
  try {
    await markAllNotificationsRead(userId);
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
  }
}

export default async function NotificationsPage() {
  // Get user ID from session cookie
  const cookieStore = await cookies();
  const userId = cookieStore.get("uid")?.value;

  if (!userId) {
    redirect("/login");
  }

  const notifications = await loadNotifications(userId);
  const unreadCount = notifications.filter((n) => !n.readAt).length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Bell className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">
                {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        {/* Mark all read button */}
        {unreadCount > 0 && (
          <form
            action={async () => {
              "use server";
              await handleMarkAllRead(userId);
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-card transition-colors text-sm font-medium"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          </form>
        )}
      </div>

      {/* Notifications list */}
      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">You&apos;re all caught up!</h3>
          <p className="text-sm text-muted-foreground">
            No notifications yet. We&apos;ll notify you about orders, shipments, and more.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`rounded-2xl border border-border p-5 transition-all ${
                notification.readAt
                  ? "opacity-60 hover:opacity-80"
                  : "bg-card shadow-sm hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="text-2xl flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="font-semibold text-sm leading-tight">
                      {notification.title}
                    </h3>
                    {!notification.readAt && (
                      <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5" />
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {notification.body}
                  </p>

                  {/* Metadata footer */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatTimestamp(notification.createdAt)}</span>
                    </div>

                    {/* Mark as read button */}
                    {!notification.readAt && (
                      <form
                        action={async () => {
                          "use server";
                          await handleMarkRead(notification.id, userId);
                        }}
                      >
                        <button
                          type="submit"
                          className="text-xs text-primary hover:underline font-medium"
                        >
                          Mark as read
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Optional: Display notification data */}
                  {notification.data && Object.keys(notification.data).length > 0 && (
                    <details className="mt-3 pt-3 border-t border-border">
                      <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                        View details
                      </summary>
                      <pre className="mt-2 text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                        {JSON.stringify(notification.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
