import { User, Bell, Shield, Palette } from "lucide-react";
import Link from "next/link";

/**
 * Account Settings Page
 *
 * Main hub for all account settings including profile, notifications, security, and preferences.
 */

export default function AccountSettingsPage() {
  const settingsSections = [
    {
      id: "profile",
      title: "Profile",
      description: "Update your personal information and profile picture",
      icon: User,
      href: "/account/settings/profile",
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Manage how you receive notifications and alerts",
      icon: Bell,
      href: "/account/settings/notifications",
    },
    {
      id: "security",
      title: "Security",
      description: "Update your password and manage security settings",
      icon: Shield,
      href: "/account/settings/security",
    },
    {
      id: "appearance",
      title: "Appearance",
      description: "Customize the look and feel of the platform",
      icon: Palette,
      href: "/account/settings/appearance",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Account Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account preferences and settings
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.id}
              href={section.href}
              className="flex items-start gap-4 p-5 rounded-2xl border border-border hover:bg-card hover:shadow-sm transition-all"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{section.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {section.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}