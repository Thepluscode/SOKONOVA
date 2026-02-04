import { getProductById } from "@/lib/api/products";
import { auth } from "@/auth";
import Image from "next/image";
import { AddToCartClient } from "./AddToCartClient";
import { trackProductView } from "@/lib/api/productViews";
import { ChatAssistant } from "@/components/ChatAssistant";
import { ShareProduct } from "@/components/ShareProduct";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const product = await getProductById(params.id);
  
  // Track product view for personalized recommendations if user is logged in
  if (session?.user?.id) {
    try {
      await trackProductView(session.user.id, params.id);
    } catch (error) {
      console.error("Failed to track product view:", error);
    }
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="text-muted-foreground mt-2">
          {"The product you're looking for doesn't exist or has been removed."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square rounded-2xl bg-muted overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image available
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-2xl font-semibold">
                {product.currency} {product.price.toFixed(2)}
              </span>
              {product.inventory?.quantity !== undefined && (
                <span className="text-sm text-muted-foreground">
                  ({product.inventory.quantity} in stock)
                </span>
              )}
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div className="pt-4">
            <AddToCartClient id={product.id} />
          </div>
          
          {/* Chat Assistant - only show for logged in users */}
          {session?.user?.id && (
            <ChatAssistant 
              userId={session.user.id} 
              productId={product.id} 
              productName={product.title} 
            />
          )}
          
          {/* Share Product - only show for logged in users */}
          {session?.user?.id && (
            <ShareProduct
              userId={session.user.id}
              productId={product.id}
              productName={product.title}
            />
          )}
        </div>
      </div>
    </div>
  );
}
