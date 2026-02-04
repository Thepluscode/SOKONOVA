import { auth } from "@/auth";
import AdminTrustDashboardPage from "./page-content";

export default async function AdminTrustPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="text-xl font-semibold mb-2">Access denied</div>
        <div className="text-muted-foreground text-sm">Admins only.</div>
      </div>
    );
  }

  return <AdminTrustDashboardPage adminId={session.user.id} />;
}
