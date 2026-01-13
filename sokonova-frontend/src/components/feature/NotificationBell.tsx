"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { notificationsService } from "../../lib/services";
import { useAuth } from "../../lib/auth";

/**
 * NotificationBell Component
 *
 * Displays a bell icon with unread notification count badge.
 * Polls the backend every 30 seconds to update the count.
 *
 * Features:
 * - Real-time unread count updates
 * - Visual badge for unread notifications
 * - Links to notifications inbox
 * - Responsive design
 *
 * @param userId - The current user's ID
 */
export function NotificationBell() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadUnreadCount() {
      try {
        if (!user?.id) {
          if (active) setCount(0);
          return;
        }
        const data = await notificationsService.getUnreadCount();
        if (!active) return;
        setCount(data.count || 0);
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    // Load immediately
    loadUnreadCount();

    // Poll every 30 seconds
    const interval = setInterval(loadUnreadCount, 30_000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [user?.id]);

  return (
    <Link
      to="/account/notifications"
      className="relative inline-flex items-center justify-center p-2 rounded-xl border border-border hover:bg-card transition-colors"
      aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ""}`}
    >
      <Bell className="w-5 h-5" />

      {!isLoading && count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center shadow-sm">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
