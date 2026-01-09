import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { User, Bell, Clock, Smartphone, Mail } from "lucide-react";
import { getUserNotificationPreferences, updateUserNotificationPreferences } from "@/lib/api/notifications";

/**
 * Notification Settings Page
 *
 * Allows users to manage their notification preferences including:
 * - Email notifications toggle
 * - SMS notifications toggle
 * - Quiet hours configuration
 * - Timezone selection
 */

interface UserPreferences {
  id: string;
  email: string;
  phone?: string;
  notifyEmail: boolean;
  notifySms: boolean;
  quietHoursStart: number | null;
  quietHoursEnd: number | null;
  timezone: string;
}

export default async function NotificationSettingsPage() {
  // Get user ID from session cookie
  const cookieStore = await cookies();
  const userId = cookieStore.get("uid")?.value;

  if (!userId) {
    redirect("/login");
  }

  // Fetch user notification preferences
  let user: UserPreferences;
  try {
    const userData = await getUserNotificationPreferences(userId);
    user = {
      id: userId,
      email: userData.email,
      phone: userData.phone,
      notifyEmail: userData.notifyEmail,
      notifySms: userData.notifySms,
      quietHoursStart: userData.quietHoursStart,
      quietHoursEnd: userData.quietHoursEnd,
      timezone: userData.timezone,
    };
  } catch (error) {
    console.error("Failed to load user preferences:", error);
    // Redirect to a error page or show error message
    redirect("/account/settings");
    return null;
  }

  // Generate time options for quiet hours
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const period = hour < 12 ? "AM" : "PM";
    return { value: hour, label: `${displayHour}:00 ${period}` };
  });

  // Timezone options for African markets
  const timezoneOptions = [
    { value: "Africa/Lagos", label: "Nigeria (WAT)" },
    { value: "Africa/Nairobi", label: "Kenya (EAT)" },
    { value: "Africa/Accra", label: "Ghana (GMT)" },
    { value: "Africa/Johannesburg", label: "South Africa (SAST)" },
    { value: "Africa/Cairo", label: "Egypt (EET)" },
    { value: "Africa/Casablanca", label: "Morocco (WET)" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10">
          <Bell className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Notification Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage how you receive notifications
          </p>
        </div>
      </div>

      <form
        action={async (formData) => {
          "use server";
          const notifyEmail = formData.get("notifyEmail") === "on";
          const notifySms = formData.get("notifySms") === "on";
          const quietHoursStart = formData.get("quietHoursStart")
            ? Number(formData.get("quietHoursStart"))
            : null;
          const quietHoursEnd = formData.get("quietHoursEnd")
            ? Number(formData.get("quietHoursEnd"))
            : null;
          const timezone = formData.get("timezone") as string;

          try {
            await updateUserNotificationPreferences(userId, {
              notifyEmail,
              notifySms,
              quietHoursStart,
              quietHoursEnd,
              timezone,
            });
            
            // Redirect back to settings with success message
            redirect("/account/settings?updated=true");
          } catch (error) {
            console.error("Failed to update preferences:", error);
            // In a real app, you'd show an error message to the user
          }
        }}
        className="space-y-8"
      >
        {/* Notification Channels */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Notification Channels</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Choose how you want to receive notifications
          </p>

          <div className="space-y-4">
            {/* Email Notifications */}
            <div className="flex items-start gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors">
              <div className="mt-1 p-2 rounded-lg bg-blue-500/10">
                <Mail className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Send notifications to {user.email}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="notifyEmail"
                      defaultChecked={user.notifyEmail}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* SMS Notifications */}
            <div className="flex items-start gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors">
              <div className="mt-1 p-2 rounded-lg bg-green-500/10">
                <Smartphone className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">SMS Notifications</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Send text messages to {user.phone || "not provided"}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="notifySms"
                      defaultChecked={user.notifySms}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Quiet Hours</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Pause notifications during specific hours
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Start Time
              </label>
              <select
                name="quietHoursStart"
                defaultValue={user.quietHoursStart ?? ""}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">No quiet hours</option>
                {timeOptions.map((time) => (
                  <option key={time.value} value={time.value}>
                    {time.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">End Time</label>
              <select
                name="quietHoursEnd"
                defaultValue={user.quietHoursEnd ?? ""}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">No quiet hours</option>
                {timeOptions.map((time) => (
                  <option key={time.value} value={time.value}>
                    {time.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-muted/50">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">How it works</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {"During quiet hours, you'll only receive critical notifications. Non-urgent emails and SMS will be delayed until after your quiet hours end."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timezone */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Timezone</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Your local timezone for scheduling notifications
          </p>

          <div>
            <select
              name="timezone"
              defaultValue={user.timezone}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {timezoneOptions.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
