import { getAllPartners } from "@/lib/api/api-partner-platform";
import { ApiPartnersDashboard } from "@/components/ApiPartnersDashboard";

export default async function ApiPartnersPage({ 
  searchParams 
}: { 
  searchParams: { adminId: string } 
}) {
  const adminId = searchParams.adminId;
  
  if (!adminId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Admin ID is required to view this page.</p>
        </div>
      </div>
    );
  }

  // Fetch all partners
  const partnersResponse = await getAllPartners(adminId);
  const partners = partnersResponse || [];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">API Partner Platform</h1>
        <p className="text-muted-foreground">
          Manage API partners and webhook integrations
        </p>
      </div>

      <ApiPartnersDashboard 
        partners={partners}
        adminId={adminId}
      />
    </div>
  );
}
