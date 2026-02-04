import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SellerTrustDashboard from "./page-content";

export default async function SellerTrustDashboardPage() {
  const session = await getServerSession(authOptions);

  // Auth guard: redirect to login if not authenticated
  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/seller/trust");
  }

  const userId = session.user.id;

  if (!userId) {
    redirect("/auth/login?callbackUrl=/seller/trust");
  }

  if (session.user.role !== "SELLER" && session.user.role !== "ADMIN") {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-4">You need seller access to view this page.</p>
      </div>
    );
  }

  return <SellerTrustDashboard userId={userId} />;
}
