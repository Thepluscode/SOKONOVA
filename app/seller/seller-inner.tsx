"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  getSellerProducts,
  createSellerProduct,
  updateSellerProduct,
  updateSellerInventory,
  sellerGetPendingPayout,
  sellerPayoutCsvUrl,
  sellerGetOpenFulfillment,
  sellerMarkShipped,
  sellerMarkDelivered,
  sellerGetDisputes,
  resolveDispute,
  updateStorefront,
  getSellerAnalyticsSummary,
} from "@/lib/api";

type Product = {
  id: string;
  title: string;
  description: string;
  price: string | number;
  currency: string;
  imageUrl?: string | null;
  createdAt: string;
  inventory?: {
    quantity: number;
  };
  orderItems?: Array<{
    id: string;
    qty: number;
    order: {
      id: string;
      status: string;
      createdAt: string;
    };
  }>;
};

type DashboardProps = {
  userId: string;
  userName: string;
};

type PayoutInfo = {
  currency: string;
  totalGross: number;
  totalFees: number;
  totalNet: number;
  count: number;
  items: any[];
};

export function SellerDashboard({ userId, userName }: DashboardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [payout, setPayout] = useState<PayoutInfo | null>(null);
  const [shipQueue, setShipQueue] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    currency: "USD",
    imageUrl: "",
  });
  const [storefrontData, setStorefrontData] = useState({
    shopName: "",
    sellerHandle: "",
    shopLogoUrl: "",
    shopBannerUrl: "",
    shopBio: "",
    country: "",
    city: "",
  });
  const [storefrontSaving, setStorefrontSaving] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);

  // Load seller's products, payout info, fulfillment queue, disputes, and analytics
  const loadProducts = async () => {
    setLoading(true);
    try {
      const [productsData, payoutData, fulfillmentData, issuesData, analyticsData] = await Promise.all([
        getSellerProducts(userId),
        sellerGetPendingPayout(userId),
        sellerGetOpenFulfillment(userId),
        sellerGetDisputes(userId),
        getSellerAnalyticsSummary(userId),
      ]);
      setProducts(productsData || []);
      setPayout(payoutData || null);
      setShipQueue(fulfillmentData || []);
      setIssues(issuesData || []);
      setAnalytics(analyticsData || null);
    } catch (error) {
      console.error("Error loading seller data:", error);
    } finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [userId]);

  // Create new product
  const handleCreate = async () => {
    if (!formData.title || !formData.price) {
      alert("Title and price are required");
      return;
    }

    try {
      await createSellerProduct({
        sellerId: userId,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        currency: formData.currency,
        imageUrl: formData.imageUrl || undefined,
      });

      // Reset form and reload
      setFormData({ title: "", description: "", price: "", currency: "USD", imageUrl: "" });
      setCreatingProduct(false);
      await loadProducts();
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product");
    }
  };

  // Update product details
  const handleUpdate = async () => {
    if (!editingProduct) return;

    try {
      await updateSellerProduct(userId, editingProduct.id, {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        currency: formData.currency,
        imageUrl: formData.imageUrl || undefined,
      });

      setEditingProduct(null);
      setFormData({ title: "", description: "", price: "", currency: "USD", imageUrl: "" });
      await loadProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  // Update inventory
  const handleInventoryUpdate = async (productId: string, newQty: number) => {
    if (newQty < 0) {
      alert("Quantity cannot be negative");
      return;
    }

    try {
      await updateSellerInventory(userId, productId, newQty);
      await loadProducts();
    } catch (error) {
      console.error("Error updating inventory:", error);
      alert("Failed to update inventory");
    }
  };

  // Start editing
  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      currency: product.currency,
      imageUrl: product.imageUrl || "",
    });
    setCreatingProduct(false);
  };

  // Start creating
  const startCreate = () => {
    setCreatingProduct(true);
    setEditingProduct(null);
    setFormData({ title: "", description: "", price: "", currency: "USD", imageUrl: "" });
  };

  // Cancel editing/creating
  const cancelForm = () => {
    setEditingProduct(null);
    setCreatingProduct(false);
    setFormData({ title: "", description: "", price: "", currency: "USD", imageUrl: "" });
  };

  // Save storefront profile
  const handleStorefrontSave = async () => {
    setStorefrontSaving(true);
    try {
      await updateStorefront(userId, storefrontData);
      alert("Storefront updated! Your shop is now live at /store/" + storefrontData.sellerHandle);
    } catch (error) {
      console.error("Error updating storefront:", error);
      alert("Failed to update storefront. Handle may already be taken.");
    } finally {
      setStorefrontSaving(false);
    }
  };

  // Calculate total orders for a product
  const getTotalOrders = (product: Product) => {
    return product.orderItems?.length || 0;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <p>Loading seller dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {userName}</p>
        </div>
        <Button onClick={startCreate} disabled={creatingProduct || editingProduct !== null}>
          + New Product
        </Button>
      </div>

      {/* ANALYTICS OVERVIEW */}
      {analytics && (
        <section className="rounded-2xl border border-border bg-card p-6 space-y-6 mb-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h2 className="text-xl font-medium">Business Overview</h2>
              <p className="text-muted-foreground text-xs">Last 7 days performance</p>
            </div>
            <div className="text-[11px] text-muted-foreground">
              @{analytics.sellerMeta?.sellerHandle || "your-shop"}
            </div>
          </div>

          {/* KPI GRID */}
          <div className="grid gap-4 md:grid-cols-4">
            {/* Revenue last 7 days */}
            <div className="rounded-xl border border-border bg-background p-4 flex flex-col gap-1">
              <div className="text-[11px] text-muted-foreground uppercase font-medium">
                Revenue (7d)
              </div>
              <div className="text-xl font-semibold">
                {analytics.revenue7d.currency}{" "}
                {Number(analytics.revenue7d.amount).toFixed(2)}
              </div>
              <div className="text-[11px] text-muted-foreground">
                After marketplace fees
              </div>
            </div>

            {/* Dispute rate */}
            <div className="rounded-xl border border-border bg-background p-4 flex flex-col gap-1">
              <div className="text-[11px] text-muted-foreground uppercase font-medium">
                Dispute Rate (30d)
              </div>
              <div className="text-xl font-semibold">
                {analytics.dispute.disputeRatePct.toFixed(1)}%
              </div>
              <div className="text-[11px] text-muted-foreground">
                {analytics.dispute.disputesWindow} issues /{" "}
                {analytics.dispute.soldWindow} items
              </div>
            </div>

            {/* Rating */}
            <div className="rounded-xl border border-border bg-background p-4 flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase font-medium">
                    Rating
                  </div>
                  <div className="text-xl font-semibold flex items-center gap-1">
                    {Number(analytics.rating.avg || 0).toFixed(1)}★
                    <span className="text-[11px] text-muted-foreground font-normal">
                      ({analytics.rating.count} reviews)
                    </span>
                  </div>
                </div>
                {/* Tiny sparkline */}
                <RatingSparkline points={analytics.rating.trend || []} />
              </div>
              <div className="text-[11px] text-muted-foreground">
                Recent buyer feedback
              </div>
            </div>

            {/* Top SKU summary */}
            <div className="rounded-xl border border-border bg-background p-4 flex flex-col gap-1">
              <div className="text-[11px] text-muted-foreground uppercase font-medium">
                Top Product (7d)
              </div>
              {analytics.topSkus.length === 0 ? (
                <div className="text-sm text-muted-foreground">No sales yet</div>
              ) : (
                <>
                  <div className="text-sm font-semibold leading-tight">
                    {analytics.topSkus[0].title}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {analytics.topSkus[0].qty} sold
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Top SKUs list */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-foreground">Top Products (7d)</div>
            {analytics.topSkus.length === 0 ? (
              <div className="text-[11px] text-muted-foreground">No sales data.</div>
            ) : (
              <div className="text-[11px] grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {analytics.topSkus.map((sku: any) => (
                  <div
                    key={sku.productId}
                    className="rounded-xl border border-border bg-background p-3"
                  >
                    <div className="font-medium text-[12px] leading-tight">
                      {sku.title}
                    </div>
                    <div className="text-muted-foreground">{sku.qty} sold (7d)</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-muted-foreground">Total Products</p>
          <p className="text-3xl font-bold mt-2">{products.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-3xl font-bold mt-2">
            {products.reduce((sum, p) => sum + getTotalOrders(p), 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-muted-foreground">Total Inventory</p>
          <p className="text-3xl font-bold mt-2">
            {products.reduce((sum, p) => sum + (p.inventory?.quantity || 0), 0)}
          </p>
        </div>
      </div>

      {/* Earnings & Payouts Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Earnings & Payouts</h2>

        {!payout ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <p className="text-muted-foreground text-sm">Loading earnings data...</p>
          </div>
        ) : payout.count === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <p className="text-muted-foreground">No pending earnings yet. Start selling to earn!</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-6">
            {/* Earnings Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase mb-1">
                  Gross Sales
                </div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {payout.currency} {payout.totalGross.toFixed(2)}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Total sales revenue
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <div className="text-xs text-orange-600 dark:text-orange-400 font-medium uppercase mb-1">
                  Marketplace Fees
                </div>
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {payout.currency} {payout.totalFees.toFixed(2)}
                </div>
                <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  10% commission (SokoNova)
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="text-xs text-green-600 dark:text-green-400 font-medium uppercase mb-1">
                  Your Net Earnings
                </div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {payout.currency} {payout.totalNet.toFixed(2)}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Pending payout
                </div>
              </div>
            </div>

            {/* Payout Details */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium">
                    {payout.count} unpaid order {payout.count === 1 ? 'item' : 'items'} awaiting payout
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Payouts are typically processed weekly via bank transfer or mobile money
                  </p>
                </div>
                <a
                  href={sellerPayoutCsvUrl(userId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                >
                  Download CSV
                </a>
              </div>

              <div className="text-xs text-muted-foreground space-y-1 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                <p className="font-medium">About CSV Export:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li>Use for bank transfer batch processing</li>
                  <li>Upload to mobile money platforms (M-Pesa, MoMo)</li>
                  <li>Keep for accounting and tax records</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Shipments & Fulfillment Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Shipments & Fulfillment</h2>

        {shipQueue.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <p className="text-muted-foreground">
              🎉 No items waiting to ship! All orders are fulfilled.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {shipQueue.map((item) => (
              <ShipmentCard
                key={item.id}
                item={item}
                sellerId={userId}
                onChange={loadProducts}
              />
            ))}
          </div>
        )}
      </div>

      {/* Issues & Disputes Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Issues & Disputes</h2>

        {issues.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <p className="text-muted-foreground">
              💚 No active disputes. Great job!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {issues.map((dispute) => (
              <DisputeCard
                key={dispute.id}
                dispute={dispute}
                sellerId={userId}
                onResolved={loadProducts}
              />
            ))}
          </div>
        )}
      </div>

      {/* Store Settings Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Store Settings</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Shop Name
                </label>
                <input
                  type="text"
                  value={storefrontData.shopName}
                  onChange={(e) =>
                    setStorefrontData({ ...storefrontData, shopName: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Mama Ade Fashion"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Shop Handle (URL) *
                </label>
                <input
                  type="text"
                  value={storefrontData.sellerHandle}
                  onChange={(e) =>
                    setStorefrontData({
                      ...storefrontData,
                      sellerHandle: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  placeholder="mama-ade-fashion"
                />
                {storefrontData.sellerHandle && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Your shop: /store/{storefrontData.sellerHandle}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <input
                  type="text"
                  value={storefrontData.country}
                  onChange={(e) =>
                    setStorefrontData({ ...storefrontData, country: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Nigeria"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  value={storefrontData.city}
                  onChange={(e) =>
                    setStorefrontData({ ...storefrontData, city: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Lagos"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Shop Bio</label>
              <textarea
                value={storefrontData.shopBio}
                onChange={(e) =>
                  setStorefrontData({ ...storefrontData, shopBio: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                placeholder="Affordable Ankara fits from Lagos 🇳🇬"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Shop Logo URL
              </label>
              <input
                type="text"
                value={storefrontData.shopLogoUrl}
                onChange={(e) =>
                  setStorefrontData({ ...storefrontData, shopLogoUrl: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Shop Banner URL
              </label>
              <input
                type="text"
                value={storefrontData.shopBannerUrl}
                onChange={(e) =>
                  setStorefrontData({ ...storefrontData, shopBannerUrl: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                placeholder="https://..."
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleStorefrontSave} disabled={storefrontSaving || !storefrontData.sellerHandle}>
                {storefrontSaving ? "Saving..." : "Save Storefront"}
              </Button>
              {storefrontData.sellerHandle && (
                <a
                  href={`/store/${storefrontData.sellerHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted"
                >
                  View Shop →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Form */}
      {(creatingProduct || editingProduct) && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {creatingProduct ? "Create New Product" : "Edit Product"}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Product title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Product description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="NGN">NGN</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
              <input
                type="text"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={creatingProduct ? handleCreate : handleUpdate}>
                {creatingProduct ? "Create Product" : "Save Changes"}
              </Button>
              <Button onClick={cancelForm} className="bg-gray-500 hover:bg-gray-600">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">My Products</h2>
        </div>
        {products.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No products yet. Click "New Product" to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Inventory</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <div className="font-medium">{product.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">
                        {Number(product.price).toFixed(2)} {product.currency}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={product.inventory?.quantity || 0}
                          onChange={(e) =>
                            handleInventoryUpdate(product.id, parseInt(e.target.value) || 0)
                          }
                          className="w-20 px-2 py-1 border rounded text-sm"
                        />
                        <span className="text-sm text-muted-foreground">units</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{getTotalOrders(product)} orders</div>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        onClick={() => startEdit(product)}
                        className="text-sm py-1 px-3"
                        disabled={editingProduct !== null || creatingProduct}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Shipment Card Component
function ShipmentCard({
  item,
  sellerId,
  onChange,
}: {
  item: any;
  sellerId: string;
  onChange: () => Promise<void>;
}) {
  const [carrier, setCarrier] = useState(item.carrier || "");
  const [tracking, setTracking] = useState(item.trackingCode || "");
  const [proof, setProof] = useState(item.deliveryProofUrl || "");
  const [note, setNote] = useState(item.notes || "");
  const [busy, setBusy] = useState(false);

  const ship = async () => {
    setBusy(true);
    try {
      await sellerMarkShipped(item.id, sellerId, carrier, tracking, note);
      await onChange();
    } catch (error) {
      console.error("Error marking as shipped:", error);
      alert("Failed to mark as shipped");
    } finally {
      setBusy(false);
    }
  };

  const deliver = async () => {
    setBusy(true);
    try {
      await sellerMarkDelivered(item.id, sellerId, proof, note);
      await onChange();
    } catch (error) {
      console.error("Error marking as delivered:", error);
      alert("Failed to mark as delivered");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Product Info */}
        <div>
          <div className="flex items-start gap-4 mb-4">
            {item.product?.imageUrl && (
              <img
                src={item.product.imageUrl}
                alt={item.product?.title || "Product"}
                className="w-20 h-20 object-cover rounded-lg"
              />
            )}
            <div>
              <h3 className="font-semibold text-lg">{item.product?.title || "Product"}</h3>
              <p className="text-sm text-muted-foreground">Quantity: {item.qty}</p>
              <p className="text-sm text-muted-foreground">Order: {item.orderId}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                item.fulfillmentStatus === 'PACKED' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                item.fulfillmentStatus === 'SHIPPED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {item.fulfillmentStatus}
              </span>
            </div>

            {item.trackingCode && (
              <div>
                <span className="font-medium">Tracking:</span>{" "}
                <span className="font-mono">{item.trackingCode}</span> ({item.carrier || "carrier"})
              </div>
            )}

            {item.shippedAt && (
              <div className="text-xs text-muted-foreground">
                Shipped: {new Date(item.shippedAt).toLocaleString()}
              </div>
            )}

            {item.order?.shippingAddress && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="font-medium text-xs text-muted-foreground mb-1">Shipping To:</p>
                <p className="text-sm">{item.order.buyerName || "Customer"}</p>
                <p className="text-sm text-muted-foreground">{item.order.shippingAddress}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="space-y-4">
          {/* Mark Shipped */}
          <div className="border border-border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/10">
            <h4 className="text-sm font-semibold mb-3 text-blue-900 dark:text-blue-200">
              Mark as Shipped
            </h4>
            <div className="space-y-2">
              <input
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="Carrier (e.g. DHL, FedEx)"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
              />
              <input
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="Tracking code"
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
              />
              <input
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="Note to buyer (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <Button
                className="w-full text-sm"
                disabled={busy}
                onClick={ship}
              >
                {busy ? "Updating..." : "Confirm Shipped"}
              </Button>
            </div>
          </div>

          {/* Mark Delivered */}
          <div className="border border-border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
            <h4 className="text-sm font-semibold mb-3 text-green-900 dark:text-green-200">
              Mark as Delivered
            </h4>
            <div className="space-y-2">
              <input
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="Proof URL (photo, receipt)"
                value={proof}
                onChange={(e) => setProof(e.target.value)}
              />
              <input
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="Delivery note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <Button
                className="w-full text-sm bg-green-600 hover:bg-green-700"
                disabled={busy}
                onClick={deliver}
              >
                {busy ? "Updating..." : "Confirm Delivered"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dispute Card Component
function DisputeCard({
  dispute,
  sellerId,
  onResolved,
}: {
  dispute: any;
  sellerId: string;
  onResolved: () => Promise<void>;
}) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  // Helper for resolving
  async function doResolve(status: string) {
    setBusy(true);
    try {
      await resolveDispute(dispute.id, sellerId, status, note);
      await onResolved();
    } catch (error) {
      console.error("Error resolving dispute:", error);
      alert("Failed to resolve dispute");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-xs flex flex-col gap-3">
      <div className="flex flex-wrap justify-between gap-2">
        <div className="font-semibold text-sm text-foreground">
          {dispute.orderItem?.product?.title || "Product"}
        </div>
        <div className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
          {dispute.reasonCode}
        </div>
      </div>

      <div className="text-muted-foreground">
        <span className="font-medium">Buyer says:</span> {dispute.description}
      </div>

      {dispute.photoProofUrl && (
        <div className="text-[11px] break-all text-muted-foreground">
          <span className="font-medium">Proof:</span>{" "}
          <a
            href={dispute.photoProofUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            {dispute.photoProofUrl}
          </a>
        </div>
      )}

      <div className="text-[11px] text-muted-foreground">
        Order: {dispute.orderItem?.order?.id} • Placed{" "}
        {new Date(dispute.orderItem?.order?.createdAt).toLocaleDateString()}
      </div>

      <div className="text-[11px] text-muted-foreground">
        Buyer: {dispute.buyer?.name || dispute.buyer?.email || dispute.buyerId}
      </div>

      <div>
        <textarea
          className="w-full rounded-lg border border-border bg-background px-2 py-1 text-[11px] h-16 text-foreground resize-none"
          placeholder="Resolution note (refund, resend, no issue...)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          className="text-[11px] px-2 py-1 h-auto"
          disabled={busy}
          onClick={() => doResolve("RESOLVED_REDELIVERED")}
        >
          Send Replacement
        </Button>
        <Button
          className="text-[11px] px-2 py-1 h-auto"
          disabled={busy}
          onClick={() => doResolve("RESOLVED_BUYER_COMPENSATED")}
        >
          Refund Buyer
        </Button>
        <Button
          className="text-[11px] px-2 py-1 h-auto"
          disabled={busy}
          onClick={() => doResolve("REJECTED")}
        >
          Reject Claim
        </Button>
      </div>

      <div className="text-[10px] text-muted-foreground">
        Choosing an action will update the dispute status and (depending on the action) update the item's fulfillment status. Refunds keep the item marked as ISSUE. Replacement can close it as DELIVERED.
      </div>
    </div>
  );
}

// Rating Sparkline Component - shows mini trend graph for seller ratings
function RatingSparkline({ points }: { points: { rating: number; ts: string }[] }) {
  if (!points || points.length === 0) {
    return <div className="text-[10px] text-muted-foreground">—</div>;
  }

  // normalize ratings 1–5 into [0..1] for tiny sparkline height
  const vals = points.map((p) => p.rating);
  const max = 5;
  const min = 1;
  const range = max - min || 1;
  const norm = vals.map((v) => (v - min) / range); // 0..1

  const width = 60;
  const height = 24;
  const stepX = width / Math.max(1, norm.length - 1);

  const pathD = norm
    .map((yNorm, i) => {
      const x = i * stepX;
      const y = height - yNorm * height; // invert (higher rating = higher line)
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="text-foreground/60" aria-label="rating trend">
      <path d={pathD} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
