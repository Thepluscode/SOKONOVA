import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SellerDashboard } from "./seller-inner";

/**
 * Seller Portal - Main Page
 *
 * This page is protected and requires authentication
 * In production, also check if user.role === 'SELLER' or 'ADMIN'
 *
 * For now, we check if user is authenticated and has an ID
 * Later, add role checking when User model includes role field
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

  // TODO: In production, check user role:
  // const user = await prisma.user.findUnique({ where: { id: userId } });
  // if (user?.role !== 'SELLER' && user?.role !== 'ADMIN') {
  //   return (
  //     <div className="container mx-auto px-4 py-10">
  //       <h1 className="text-2xl font-bold">Access Denied</h1>
  //       <p className="mt-4">You need seller access to view this page.</p>
  //       <Link href="/seller/apply" className="text-blue-600 underline">
  //         Apply to become a seller
  //       </Link>
  //     </div>
  //   );
  // }

  return <SellerDashboard userId={userId} userName={session.user.name || "Seller"} />;
}