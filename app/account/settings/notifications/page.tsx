import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Settings, Bell, Mail, MessageSquare, Moon, Globe } from "lucide-react";

/**
 * Notification Preferences Page
 *
 * Allows users to configure their notification settings:
 * - Email notifications on/off
 * - SMS notifications on/off
 * - Push notifications on/off
 * - Weekly digest emails on/off
 * - Quiet hours (start and end time)
 * - Timezone selection
 * - Phone number for SMS
 */

interface UserPreferences {
  phone?: string;
  timezone: string;
  notifyEmail: boolean;
  notifySms: boolean;
  notifyPush: boolean;
  digestWeekly: boolean;
  quietHoursStart?: number;
  quietHoursEnd?: number;
}

async function getUserPreferences(userId: string): Promise<UserPreferences> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  try {
    const res = await fetch(`${baseUrl}/users/${userId}`, {
      cache: "no-store",
      credentials: "include",
    });

    if (!res.ok) {
      return {
        timezone: "Africa/Lagos",
        notifyEmail: true,
        notifySms: false,
        notifyPush: true,
        digestWeekly: true,
      };
    }

    const user = await res.json();
    return {
      phone: user.phone,
      timezone: user.timezone || "Africa/Lagos",
      notifyEmail: user.notifyEmail ?? true,
      notifySms: user.notifySms ?? false,
      notifyPush: user.notifyPush ?? true,
      digestWeekly: user.digestWeekly ?? true,
      quietHoursStart: user.quietHoursStart,
      quietHoursEnd: user.quietHoursEnd,
    };
  } catch (error) {
    console.error("Failed to load preferences:", error);
    return {
      timezone: "Africa/Lagos",
      notifyEmail: true,
      notifySms: false,
      notifyPush: true,
      digestWeekly: true,
    };
  }
}

async function updatePreferences(formData: FormData) {
  "use server";

  const cookieStore = await cookies();
  const userId = cookieStore.get("uid")?.value;

  if (!userId) {
    redirect("/login");
  }

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  const preferences: Partial<UserPreferences> = {
    phone: formData.get("phone") as string || undefined,
    timezone: formData.get("timezone") as string,
    notifyEmail: formData.get("notifyEmail") === "on",
    notifySms: formData.get("notifySms") === "on",
    notifyPush: formData.get("notifyPush") === "on",
    digestWeekly: formData.get("digestWeekly") === "on",
    quietHoursStart: formData.get("quietHoursStart")
      ? parseInt(formData.get("quietHoursStart") as string)
      : undefined,
    quietHoursEnd: formData.get("quietHoursEnd")
      ? parseInt(formData.get("quietHoursEnd") as string)
      : undefined,
  };

  try {
    await fetch(`${baseUrl}/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(preferences),
    });
  } catch (error) {
    console.error("Failed to update preferences:", error);
  }

  redirect("/account/settings/notifications?saved=true");
}

export default async function NotificationSettingsPage({
  searchParams,
}: {
  searchParams: { saved?: string };
}) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("uid")?.value;

  if (!userId) {
    redirect("/login");
  }

  const preferences = await getUserPreferences(userId);

  const africanTimezones = [
    { value: "Africa/Lagos", label: "Lagos (WAT)" },
    { value: "Africa/Nairobi", label: "Nairobi (EAT)" },
    { value: "Africa/Cairo", label: "Cairo (EET)" },
    { value: "Africa/Johannesburg", label: "Johannesburg (SAST)" },
    { value: "Africa/Accra", label: "Accra (GMT)" },
    { value: "Africa/Addis_Ababa", label: "Addis Ababa (EAT)" },
    { value: "Africa/Algiers", label: "Algiers (CET)" },
    { value: "Africa/Dar_es_Salaam", label: "Dar es Salaam (EAT)" },
    { value: "Africa/Kampala", label: "Kampala (EAT)" },
    { value: "Africa/Kigali", label: "Kigali (CAT)" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10">
          <Settings className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Notification Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage how and when you receive notifications
          </p>
        </div>
      </div>

      {/* Success message */}
      {searchParams.saved && (
        <div className="rounded-xl border border-green-200 bg-green-50 dark:bg-green-950 p-4 text-sm text-green-800 dark:text-green-200">
          ✓ Your notification preferences have been saved successfully.
        </div>
      )}

      {/* Settings form */}
      <form action={updatePreferences} className="space-y-6">
        {/* Notification Channels */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Channels
          </h2>

          <div className="space-y-4">
            {/* Email notifications */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="notifyEmail"
                defaultChecked={preferences.notifyEmail}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="font-medium">Email Notifications</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receive order updates, payment confirmations, and shipping notifications via email
                </p>
              </div>
            </label>

            {/* SMS notifications */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="notifySms"
                defaultChecked={preferences.notifySms}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-medium">SMS Notifications</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get urgent updates via SMS (shipping confirmations, disputes)
                </p>
              </div>
            </label>

            {/* Push notifications */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="notifyPush"
                defaultChecked={preferences.notifyPush}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  <span className="font-medium">Push Notifications</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receive real-time alerts in your browser
                </p>
              </div>
            </label>

            {/* Weekly digest */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="digestWeekly"
                defaultChecked={preferences.digestWeekly}
                className="mt-1"
              />
              <div className="flex-1">
                <span className="font-medium">Weekly Digest Email</span>
                <p className="text-sm text-muted-foreground">
                  Get a weekly summary of your sales, ratings, and activity
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Phone number */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Phone Number for SMS</h2>
          <div>
            <label className="block text-sm font-medium mb-2">
              Phone Number (with country code)
            </label>
            <input
              type="tel"
              name="phone"
              defaultValue={preferences.phone || ""}
              placeholder="+234 800 123 4567"
              className="w-full px-4 py-2 rounded-xl border border-border bg-background"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Include country code (e.g., +234 for Nigeria, +254 for Kenya)
            </p>
          </div>
        </div>

        {/* Timezone */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Timezone
          </h2>
          <div>
            <label className="block text-sm font-medium mb-2">
              Your Timezone
            </label>
            <select
              name="timezone"
              defaultValue={preferences.timezone}
              className="w-full px-4 py-2 rounded-xl border border-border bg-background"
            >
              {africanTimezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-2">
              Used to calculate quiet hours and send timely notifications
            </p>
          </div>
        </div>

        {/* Quiet hours */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Moon className="w-5 h-5" />
            Quiet Hours
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Don&apos;t send email or SMS notifications during these hours. In-app notifications will still be saved.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Start Time
              </label>
              <select
                name="quietHoursStart"
                defaultValue={preferences.quietHoursStart?.toString() || ""}
                className="w-full px-4 py-2 rounded-xl border border-border bg-background"
              >
                <option value="">None</option>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {i.toString().padStart(2, "0")}:00
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                End Time
              </label>
              <select
                name="quietHoursEnd"
                defaultValue={preferences.quietHoursEnd?.toString() || ""}
                className="w-full px-4 py-2 rounded-xl border border-border bg-background"
              >
                <option value="">None</option>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {i.toString().padStart(2, "0")}:00
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            Example: Set 22:00 to 08:00 to avoid notifications at night
          </p>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Info box */}
      <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm">
        <p className="font-medium mb-2">About Your Notifications</p>
        <ul className="space-y-1 text-muted-foreground">
          <li>• In-app notifications are always saved and can be viewed anytime</li>
          <li>• Email and SMS respect your quiet hours settings</li>
          <li>• Critical security alerts may bypass quiet hours</li>
          <li>• You can change these settings at any time</li>
        </ul>
      </div>
    </div>
  );
}
