'use client'

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { submitSellerApplication, getMySellerApplication } from "@/lib/api/seller-applications";

interface SellerApplication {
  id: string;
  businessName: string;
  phone: string;
  country: string;
  city: string;
  storefrontDesc: string;
  status: string;
  adminNote?: string;
  createdAt: string;
}

export default function SellerApplicationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [existing, setExisting] = useState<SellerApplication | null>(null);
  const [form, setForm] = useState({
    businessName: "",
    phone: "",
    country: "",
    city: "",
    storefrontDesc: "",
  });

  // Load existing application on mount
  useEffect(() => {
    async function load() {
      if (status === "loading") return;
      setLoading(true);

      if (!session?.user) {
        setLoading(false);
        return;
      }

      const userId = session.user.id;
      if (!userId) {
        setLoading(false);
        return;
      }

      const mine = await getMySellerApplication(userId);
      setExisting(mine);
      setLoading(false);
    }
    load();
  }, [session?.user, status]);

  // Handle submission
  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const userId = session?.user?.id;
    if (!userId) return;

    setSubmitting(true);
    try {
      await submitSellerApplication({
        userId,
        businessName: form.businessName,
        phone: form.phone,
        country: form.country,
        city: form.city,
        storefrontDesc: form.storefrontDesc,
      });
      setSent(true);

      // Refresh application status
      const mine = await getMySellerApplication(userId);
      setExisting(mine);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Show sign in prompt if not authenticated
  if (!session?.user && !loading) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-3 text-foreground">
          Become a Seller
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          Please sign in to apply.
        </p>
        <button
          onClick={() => router.push("/auth/login?callbackUrl=/sell/apply")}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="text-muted-foreground">Loading…</div>
      </div>
    );
  }

  // If we already have an application, show status
  if (existing) {
    const statusColors = {
      PENDING: "text-yellow-600 dark:text-yellow-400",
      APPROVED: "text-green-600 dark:text-green-400",
      REJECTED: "text-red-600 dark:text-red-400",
    };

    return (
      <div className="mx-auto max-w-md px-4 py-16 space-y-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Application Status
          </h1>
          <div
            className={`text-2xl font-bold ${
              statusColors[existing.status as keyof typeof statusColors] ||
              "text-foreground"
            }`}
          >
            {existing.status}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Business Name
            </div>
            <div className="font-medium text-foreground">
              {existing.businessName}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Location</div>
              <div className="text-sm text-foreground">
                {existing.city}, {existing.country}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Phone</div>
              <div className="text-sm text-foreground">{existing.phone}</div>
            </div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1">
              What You Sell
            </div>
            <div className="text-sm text-foreground">
              {existing.storefrontDesc}
            </div>
          </div>

          {existing.status === "APPROVED" && (
            <div className="pt-4 border-t border-border">
              <div className="text-sm text-green-600 dark:text-green-400 mb-3">
                ✓ Congratulations! You are approved as a Seller.
              </div>
              <button
                onClick={() => router.push("/seller")}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90"
              >
                Go to Seller Dashboard →
              </button>
            </div>
          )}

          {existing.status === "REJECTED" && (
            <div className="pt-4 border-t border-border">
              <div className="text-sm text-red-600 dark:text-red-400 mb-3">
                Unfortunately this application was rejected. You may revise and
                submit again.
              </div>
              <button
                onClick={() => {
                  setExisting(null);
                  setSent(false);
                }}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90"
              >
                Submit New Application
              </button>
            </div>
          )}

          {existing.status === "PENDING" && (
            <div className="pt-4 border-t border-border">
              <div className="text-sm text-muted-foreground">
                {"Your application is under review. We'll notify you after verification."}
              </div>
            </div>
          )}

          {existing.adminNote && (
            <div className="pt-4 border-t border-border">
              <div className="text-xs text-muted-foreground mb-1">
                Note from Review Team
              </div>
              <div className="text-sm text-foreground italic">
                {`"${existing.adminNote}"`}
              </div>
            </div>
          )}

          <div className="pt-2 text-[11px] text-muted-foreground">
            Applied on{" "}
            {new Date(existing.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>
    );
  }

  // Otherwise show the application form
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Become a Seller
        </h1>
        <p className="text-muted-foreground text-sm">
          Join our marketplace to sell your products
        </p>
      </div>

      <form onSubmit={submit} className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            Business Name
          </label>
          <input
            type="text"
            value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Country
            </label>
            <input
              type="text"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              City
            </label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            What do you sell?
          </label>
          <textarea
            value={form.storefrontDesc}
            onChange={(e) => setForm({ ...form, storefrontDesc: e.target.value })}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm h-24 resize-none"
            placeholder="Describe the products or categories you plan to sell"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </button>

        <div className="text-[10px] text-muted-foreground text-center">
          {"Applications are reviewed within 1-2 business days. You'll receive an email when your status changes."}
        </div>
      </form>
    </div>
  );
}
