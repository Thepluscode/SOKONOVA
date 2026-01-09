import Image from "next/image";
import Link from "next/link";

interface SponsoredProductCardProps {
  product: any;
  placementType: "search" | "category";
}

export function SponsoredProductCard({ product, placementType }: SponsoredProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="rounded-2xl border-2 border-primary bg-card p-4 flex flex-col gap-3 hover:shadow-card transition-shadow relative"
    >
      <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
        Sponsored
      </div>
      
      <div className="relative aspect-square rounded-xl bg-muted overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="font-medium line-clamp-2">{product.title}</h3>
        <div className="flex items-center justify-between">
          <span className="font-semibold">
            {product.currency || "USD"} {product.price?.toFixed(2)}
          </span>
        </div>
        
        {product.seller && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>by {product.seller.shopName || product.seller.sellerHandle}</span>
          </div>
        )}
      </div>
    </Link>
  );
}