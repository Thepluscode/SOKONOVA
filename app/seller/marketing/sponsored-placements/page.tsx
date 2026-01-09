import { getSellerSponsoredPlacements } from "@/lib/api/sponsored-placements";
import { SponsoredPlacementsManager } from "@/components/SponsoredPlacementsManager";

export default async function SponsoredPlacementsPage({ 
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

  // Fetch seller's sponsored placements
  const placements = await getSellerSponsoredPlacements(sellerId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Sponsored Placements</h1>
        <p className="text-muted-foreground">
          Promote your products in search results and category pages
        </p>
      </div>

      <SponsoredPlacementsManager 
        sellerId={sellerId} 
        initialPlacements={placements || []} 
      />
    </div>
  );
}