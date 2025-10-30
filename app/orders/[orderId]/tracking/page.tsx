import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DisputeButtonClient } from "../DisputeButtonClient";
import { ReviewFormClient } from "../ReviewFormClient";

/**
 * Order Tracking Page
 *
 * Shows shipping timeline and status for all items in an order.
 * Only accessible to the buyer who placed the order.
 */
export default async function TrackingPage({
  params,
}: {
  params: { orderId: string };
}) {
  // Get authenticated user
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/orders/" + params.orderId + "/tracking");
  }

  const userId = (session.user as any)?.id;

  if (!userId) {
    redirect("/auth/login?callbackUrl=/orders/" + params.orderId + "/tracking");
  }

  // Fetch tracking data from backend
  const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  const u = new URLSearchParams({ userId });

  let tracking;
  try {
    const res = await fetch(
      `${apiBase}/fulfillment/tracking/${params.orderId}?${u.toString()}`,
      { cache: "no-store", credentials: "include" }
    );

    if (!res.ok) {
      return (
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find this order or you don't have access to view it.
          </p>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Return to Home
          </Link>
        </div>
      );
    }

    tracking = await res.json();
  } catch (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-4">Error Loading Tracking</h1>
        <p className="text-muted-foreground mb-6">
          There was an error loading your order tracking information.
        </p>
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-700 underline"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-blue-600 hover:text-blue-700 mb-4 inline-block"
        >
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Order Tracking</h1>
        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
          <span>Order ID: <span className="font-mono">{tracking.orderId}</span></span>
          <span>•</span>
          <span>Placed: {new Date(tracking.createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <span className="font-semibold text-foreground">{tracking.status}</span>
        </div>
        {tracking.shippingAddress && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-sm font-medium mb-1">Shipping Address:</p>
            <p className="text-sm text-muted-foreground">{tracking.shippingAddress}</p>
          </div>
        )}
      </div>

      {/* Items List */}
      <div className="space-y-6">
        {tracking.items.map((item: any) => (
          <div
            key={item.orderItemId}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            {/* Product Info */}
            <div className="flex items-start gap-4 mb-4 pb-4 border-b">
              {item.productImage && (
                <img
                  src={item.productImage}
                  alt={item.productTitle}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.productTitle}</h2>
                <p className="text-sm text-muted-foreground">Quantity: {item.qty}</p>
                <p className="text-sm text-muted-foreground">
                  Price: ${Number(item.price).toFixed(2)}
                </p>
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.fulfillmentStatus === "PACKED"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : item.fulfillmentStatus === "SHIPPED"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : item.fulfillmentStatus === "DELIVERED"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {item.fulfillmentStatus}
                </span>
              </div>
            </div>

            {/* Shipping Timeline */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase">
                Shipping Timeline
              </h3>

              {/* Packed */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Order Placed</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(tracking.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Shipped */}
              {item.shippedAt ? (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Shipped</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.shippedAt).toLocaleString()}
                    </p>
                    {item.trackingCode && (
                      <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <p className="text-xs font-medium mb-1">Tracking Information:</p>
                        <p className="text-sm">
                          <span className="font-semibold">{item.carrier || "Carrier"}:</span>{" "}
                          <span className="font-mono">{item.trackingCode}</span>
                        </p>
                      </div>
                    )}
                    {item.notes && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Note: {item.notes}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 opacity-50">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium">Awaiting Shipment</p>
                    <p className="text-sm text-muted-foreground">
                      Your item is being prepared for shipping
                    </p>
                  </div>
                </div>
              )}

              {/* Delivered */}
              {item.deliveredAt ? (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Delivered</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.deliveredAt).toLocaleString()}
                    </p>
                    {item.deliveryProofUrl && (
                      <a
                        href={item.deliveryProofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 underline mt-1 inline-block"
                      >
                        View delivery proof
                      </a>
                    )}
                    {item.notes && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Note: {item.notes}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 opacity-50">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium">Out for Delivery</p>
                    <p className="text-sm text-muted-foreground">
                      Your item will be delivered soon
                    </p>
                  </div>
                </div>
              )}

              {/* Issue Status */}
              {item.fulfillmentStatus === "ISSUE" && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="font-medium text-red-900 dark:text-red-200">Issue Reported</p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    There is an issue with this item. Our team will contact you shortly.
                  </p>
                  {item.notes && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Details: {item.notes}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Dispute Button */}
            {item.fulfillmentStatus !== "ISSUE" && item.shippedAt && (
              <div className="mt-4 pt-4 border-t border-border">
                <DisputeButtonClient orderItemId={item.orderItemId} />
              </div>
            )}

            {/* Review Form - Only for delivered items */}
            {item.fulfillmentStatus === "DELIVERED" && (
              <div className="mt-4 pt-4 border-t border-border">
                <ReviewFormClient
                  orderItemId={item.orderItemId}
                  canReview={true}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Help Section */}
      <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h3 className="font-semibold mb-2">Need Help?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          If you have questions about your order or need assistance, please contact our support team.
        </p>
        <Link
          href="/support"
          className="text-sm text-blue-600 hover:text-blue-700 underline"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
