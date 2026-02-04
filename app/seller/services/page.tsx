import { getMySellerServices, getServiceOrders } from "@/lib/api/seller-services";
import { SellerServicesManager } from "@/components/SellerServicesManager";

export default async function SellerServicesPage({ 
  searchParams 
}: { 
  searchParams: { sellerId: string } 
}) {
  const sellerId = searchParams.sellerId;
  
  if (!sellerId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Seller ID is required to view this page.</p>
        </div>
      </div>
    );
  }

  // Fetch seller's services and orders
  const [servicesResponse, ordersResponse] = await Promise.all([
    getMySellerServices(sellerId),
    getServiceOrders(sellerId)
  ]);

  const services = servicesResponse || [];
  const orders = ordersResponse || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Services</h1>
        <p className="text-muted-foreground">
          Manage the services you offer to other sellers
        </p>
      </div>

      <SellerServicesManager 
        sellerId={sellerId} 
        initialServices={services}
        initialOrders={orders}
      />
    </div>
  );
}
