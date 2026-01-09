import Image from "next/image";
import Link from "next/link";

interface StoryCardProps {
  story: any;
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-card transition-shadow">
      {story.imageUrl && (
        <div className="relative aspect-video bg-muted">
          <Image
            src={story.imageUrl}
            alt={story.product?.title || "Story image"}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full border border-border bg-background overflow-hidden flex-shrink-0">
            {story.user?.shopLogoUrl ? (
              <Image
                src={story.user.shopLogoUrl}
                alt={story.user.shopName || story.user.name || "User"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                {(story.user?.shopName || story.user?.name || "U")[0]?.toUpperCase()}
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-medium text-sm">
              {story.user?.shopName || story.user?.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {story.user?.city && `${story.user.city}, ${story.user.country}`}
            </p>
          </div>
        </div>
        
        <div>
          <p className="text-sm line-clamp-3">{story.content}</p>
        </div>
        
        {story.product && (
          <Link 
            href={`/products/${story.product.id}`}
            className="flex items-center gap-3 p-2 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors"
          >
            {story.product.imageUrl && (
              <div className="relative w-12 h-12 rounded-md overflow-hidden">
                <Image
                  src={story.product.imageUrl}
                  alt={story.product.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm line-clamp-1">{story.product.title}</h4>
              <p className="text-xs text-muted-foreground">
                {story.product.currency} {story.product.price?.toFixed(2)}
              </p>
            </div>
          </Link>
        )}
        
        <div className="text-xs text-muted-foreground">
          {new Date(story.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}