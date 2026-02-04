import { getSellerServiceById, purchaseSellerService } from "@/lib/api/seller-services";
import { ServiceDetail } from "@/components/ServiceDetail";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ServiceDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const serviceId = params.id;
  
  // Fetch service details
  const service = await getSellerServiceById(serviceId);
  
  if (!service) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <p className="text-muted-foreground">The requested service could not be found.</p>
        </div>
      </div>
    );
  }

  // Get user session
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <ServiceDetail 
        service={service} 
        userId={userId}
        onPurchase={async (data) => {
          "use server";
          return purchaseSellerService(serviceId, data);
        }}
      />
    </div>
  );
}
