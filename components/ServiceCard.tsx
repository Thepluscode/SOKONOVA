import Image from "next/image";
import Link from "next/link";

interface ServiceCardProps {
  service: any;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-card transition-shadow">
      <div className="p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className="relative w-12 h-12 rounded-full border border-border bg-background overflow-hidden flex-shrink-0">
            {service.seller?.shopLogoUrl ? (
              <Image
                src={service.seller.shopLogoUrl}
                alt={service.seller.shopName || "Seller"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                {(service.seller?.shopName || "S")[0]?.toUpperCase()}
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{service.title}</h3>
            <p className="text-sm text-muted-foreground">
              by {service.seller?.shopName || "Seller"}
            </p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {service.description}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {service.currency} {service.price.toFixed(2)}
            </span>
            <span className="text-muted-foreground text-sm">
              ({service.deliveryTime} days)
            </span>
          </div>
          
          {service.seller?.ratingAvg && (
            <div className="flex items-center gap-1 text-sm">
              <span className="text-yellow-500">★</span>
              <span className="font-medium">{service.seller.ratingAvg.toFixed(1)}</span>
              <span className="text-muted-foreground">
                ({service.seller.ratingCount})
              </span>
            </div>
          )}
        </div>
        
        <Link
          href={`/services/${service.id}`}
          className="block w-full py-2 text-center text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}