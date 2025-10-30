"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  getAdminPendingApplications,
  adminApproveApplication,
  adminRejectApplication,
} from "@/lib/api";

export default function AdminApplicationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const userId = (session?.user as any)?.id;
  const userRole = (session?.user as any)?.role;

  useEffect(() => {
    async function load() {
      if (status === "loading") return;

      if (!session?.user) {
        router.push("/auth/login?callbackUrl=/admin/applications");
        return;
      }

      // Check if user is admin
      if (userRole !== "ADMIN") {
        router.push("/");
        return;
      }

      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const apps = await getAdminPendingApplications(userId);
        setApplications(apps || []);
      } catch (error) {
        console.error("Error loading applications:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [session?.user, status, userId, userRole, router]);

  async function handleApprove(appId: string) {
    if (!userId) return;

    const note = prompt(
      "Optional note for the applicant (e.g., 'Welcome to SokoNova!'):"
    );

    setProcessing(appId);
    try {
      await adminApproveApplication(appId, userId, note || undefined);
      // Remove from list
      setApplications((prev) => prev.filter((app) => app.id !== appId));
      alert("Application approved! User promoted to SELLER.");
    } catch (error) {
      console.error("Error approving application:", error);
      alert("Failed to approve application");
    } finally {
      setProcessing(null);
    }
  }

  async function handleReject(appId: string) {
    if (!userId) return;

    const note = prompt(
      "Optional note for the applicant (explain why rejected):"
    );

    const confirmed = confirm(
      "Are you sure you want to reject this application?"
    );
    if (!confirmed) return;

    setProcessing(appId);
    try {
      await adminRejectApplication(appId, userId, note || undefined);
      // Remove from list
      setApplications((prev) => prev.filter((app) => app.id !== appId));
      alert("Application rejected.");
    } catch (error) {
      console.error("Error rejecting application:", error);
      alert("Failed to reject application");
    } finally {
      setProcessing(null);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="text-muted-foreground">Loading applications…</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Seller Applications
        </h1>
        <p className="text-muted-foreground">
          Review and approve new seller applications
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">✓</div>
          <div className="text-lg font-medium text-foreground mb-2">
            All caught up!
          </div>
          <div className="text-sm text-muted-foreground">
            No pending applications at the moment.
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-card border border-border rounded-xl p-6 space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {app.businessName}
                  </h2>
                  <div className="text-sm text-muted-foreground mt-1">
                    Applied{" "}
                    {new Date(app.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-medium">
                  PENDING
                </div>
              </div>

              {/* User Info */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Applicant Email
                    </div>
                    <div className="font-medium text-foreground">
                      {app.user?.email || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Applicant Name
                    </div>
                    <div className="font-medium text-foreground">
                      {app.user?.name || "Not provided"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Location
                  </div>
                  <div className="text-foreground">
                    {app.city}, {app.country}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Phone / WhatsApp
                  </div>
                  <div className="text-foreground">{app.phone}</div>
                </div>
              </div>

              {/* Storefront Description */}
              <div>
                <div className="text-xs text-muted-foreground mb-2">
                  What They Sell
                </div>
                <div className="text-sm text-foreground bg-muted/30 rounded-lg p-3 border border-border">
                  {app.storefrontDesc}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => handleApprove(app.id)}
                  disabled={processing === app.id}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {processing === app.id ? "Processing..." : "✓ Approve"}
                </button>
                <button
                  onClick={() => handleReject(app.id)}
                  disabled={processing === app.id}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {processing === app.id ? "Processing..." : "✕ Reject"}
                </button>
              </div>

              {/* User ID for reference */}
              <div className="text-[10px] text-muted-foreground">
                User ID: {app.userId} | App ID: {app.id}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {applications.length > 0 && (
        <div className="mt-8 p-4 bg-muted/50 rounded-xl text-center text-sm text-muted-foreground">
          {applications.length} application
          {applications.length === 1 ? "" : "s"} pending review
        </div>
      )}
    </div>
  );
}
