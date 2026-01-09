import Image from "next/image";
import Link from "next/link";

interface InfluencerCardProps {
  influencer: any;
}

export function InfluencerCard({ influencer }: InfluencerCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-card transition-shadow">
      {/* Banner */}
      {influencer.shopBannerUrl ? (
        <div className="relative h-32 bg-muted">
          <Image
            src={influencer.shopBannerUrl}
            alt={influencer.shopName || influencer.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-32 bg-gradient-to-r from-primary/10 to-secondary/10" />
      )}
      
      {/* Profile */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3 -mt-10">
          <div className="relative w-16 h-16 rounded-full border-4 border-background bg-background overflow-hidden">
            {influencer.shopLogoUrl ? (
              <Image
                src={influencer.shopLogoUrl}
                alt={influencer.shopName || influencer.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-semibold">
                {(influencer.shopName || influencer.name || "I")[0]?.toUpperCase()}
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg">
            {influencer.shopName || influencer.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {influencer.city && `${influencer.city}, ${influencer.country}`}
          </p>
        </div>
        
        {influencer.bio && (
          <p className="text-sm line-clamp-2">{influencer.bio}</p>
        )}
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="font-medium">
              {influencer.ratingAvg?.toFixed(1) || 'N/A'}
            </span>
            <span className="text-muted-foreground">
              ({influencer.ratingCount || 0})
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">
              {influencer.products?.length || 0} products
            </span>
          </div>
        </div>
        
        {/* Featured Products */}
        {influencer.products && influencer.products.length > 0 && (
          <div className="pt-2">
            <div className="flex -space-x-2">
              {influencer.products.slice(0, 4).map((product: any) => (
                <div 
                  key={product.id}
                  className="relative w-12 h-12 rounded-md border border-border bg-background overflow-hidden flex-shrink-0"
                >
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[8px] text-muted-foreground">
                      {product.title?.[0] || "P"}
                    </div>
                  )}
                </div>
              ))}
              {influencer.products.length > 4 && (
                <div className="relative w-12 h-12 rounded-md border border-border bg-background flex items-center justify-center text-[10px] text-muted-foreground flex-shrink-0">
                  +{influencer.products.length - 4}
                </div>
              )}
            </div>
          </div>
        )}
        
        <Link
          href={`/store/${influencer.sellerHandle}`}
          className="block w-full py-2 text-center text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          View Storefront
        </Link>
      </div>
    </div>
  );
}