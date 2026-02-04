import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SellerDashboard } from "./seller-inner";
import Link from "next/link";

/**
 * Seller Portal - Main Page
 *
 * This page is protected and requires authentication
 */
export default async function SellerPage() {
  const session = await getServerSession(authOptions);

  // Auth guard: redirect to login if not authenticated
  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/seller");
  }

  const userId = session.user.id;

  if (!userId) {
    redirect("/auth/login?callbackUrl=/seller");
  }

  if (session.user.role !== "SELLER" && session.user.role !== "ADMIN") {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-4">You need seller access to view this page.</p>
        <Link href="/seller/apply" className="text-blue-600 underline">
          Apply to become a seller
        </Link>
      </div>
    );
  }

  return <SellerDashboard userId={userId} userName={session.user.name || "Seller"} />;
}
