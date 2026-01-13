import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../../../components/feature/Header';
import Footer from '../../../../components/feature/Footer';
import Button from '../../../../components/base/Button';
import { useToast } from '../../../../contexts/ToastContext';
import { disputesService, fulfillmentService, reviewsService } from '../../../../lib/services';
import { useRequireAuth } from '../../../../lib/auth';

const formatDate = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatDateTime = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const mapDisputeReason = (value: string) => {
  switch (value) {
    case 'not_received':
      return 'NOT_DELIVERED';
    case 'damaged':
      return 'DAMAGED';
    case 'wrong_item':
      return 'WRONG_ITEM';
    case 'not_as_described':
    case 'quality_issue':
      return 'OTHER';
    case 'other':
    default:
      return 'OTHER';
  }
};

const parseShippingAddress = (raw: string | null | undefined, order: any) => {
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          name: parsed.name || order?.buyerName || order?.user?.name || 'Buyer',
          street: parsed.street || parsed.address || '',
          city: parsed.city || '',
          state: parsed.state || '',
          country: parsed.country || '',
          postalCode: parsed.postalCode || parsed.zip || '',
          phone: parsed.phone || order?.buyerPhone || order?.user?.phone || '',
        };
      }
    } catch {
      return {
        name: order?.buyerName || order?.user?.name || 'Buyer',
        street: raw,
        city: '',
        state: '',
        country: '',
        postalCode: '',
        phone: order?.buyerPhone || order?.user?.phone || '',
      };
    }
  }

  return {
    name: order?.buyerName || order?.user?.name || 'Buyer',
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    phone: order?.buyerPhone || order?.user?.phone || '',
  };
};

const buildTimeline = (order: any) => {
  if (!order) return [];

  const status = (order.status || 'pending').toLowerCase();
  const statusMap: Record<string, number> = {
    pending: 0,
    paid: 1,
    shipped: 2,
    delivered: 3,
    cancelled: 0,
  };

  const progress = statusMap[status] ?? 0;
  const baseDate = formatDateTime(order.date);
  const shippedDate = formatDateTime(order.items?.find((item: any) => item.shippedAt)?.shippedAt);
  const deliveredDate = formatDateTime(order.items?.find((item: any) => item.deliveredDate)?.deliveredDate);

  return [
    {
      status: 'Order Placed',
      date: baseDate,
      description: 'Your order has been confirmed',
      icon: 'ri-checkbox-circle-fill',
      completed: progress >= 0,
    },
    {
      status: 'Processing',
      date: baseDate,
      description: 'Seller is preparing your items',
      icon: 'ri-box-3-fill',
      completed: progress >= 1,
    },
    {
      status: 'Shipped',
      date: shippedDate,
      description: 'Package handed to carrier',
      icon: 'ri-truck-fill',
      completed: progress >= 2,
    },
    {
      status: 'In Transit',
      date: shippedDate,
      description: 'Package is on the way',
      icon: 'ri-map-pin-fill',
      completed: progress >= 2,
    },
    {
      status: 'Delivered',
      date: deliveredDate,
      description: 'Package delivered successfully',
      icon: 'ri-home-smile-fill',
      completed: progress >= 3,
    },
  ];
};

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  useRequireAuth();

  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeDescription, setDisputeDescription] = useState('');
  const [disputeError, setDisputeError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState('');
  const [order, setOrder] = useState<any | null>(null);
  const [trackingEvents, setTrackingEvents] = useState<Record<string, any[]>>({});
  const [loadingTracking, setLoadingTracking] = useState<Record<string, boolean>>({});
  const [trackingUpdatedAt, setTrackingUpdatedAt] = useState<Record<string, string>>({});
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);
  const [expandedTracking, setExpandedTracking] = useState<Record<string, boolean>>({});
  const [trackingErrors, setTrackingErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;

      setLoading(true);
      setError(null);

      try {
        const response: any = await fulfillmentService.getOrderTracking(orderId);
        const shipping = parseShippingAddress(response?.shippingAddress, response);
        const items = (response?.items || []).map((item: any) => ({
          id: item.orderItemId,
          name: item.productTitle || 'Product',
          price: Number(item.price || 0),
          quantity: Number(item.qty || 0),
          seller: item.sellerName || 'Seller',
          image: item.productImage || '',
          status: item.fulfillmentStatus?.toLowerCase() || 'processing',
          trackingCode: item.trackingCode || '',
          carrier: item.carrier || '',
          shippedAt: item.shippedAt || null,
          deliveredDate: item.deliveredAt || null,
          deliveryProofUrl: item.deliveryProofUrl || null,
        }));

        setOrder({
          id: response.orderId,
          date: response.createdAt,
          status: (response.status || 'PENDING').toLowerCase(),
          total: Number(response.total || 0),
          currency: response.currency || 'USD',
          items,
          shippingAddress: shipping,
        });

        if (!selectedOrderItemId && items.length > 0) {
          setSelectedOrderItemId(items[0].id);
        }
      } catch (err) {
        console.error('Failed to load order:', err);
        setError('Could not load order details.');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (!autoRefreshEnabled || !order?.items?.length) return undefined;

    const refreshInterval = setInterval(() => {
      order.items.forEach((item: any) => {
        if (item.trackingCode) {
          loadTrackingEvents(item.id, item.trackingCode, true, false);
        }
      });
    }, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [autoRefreshEnabled, order]);

  const trackingTimeline = buildTimeline(order);

  const orderStatusClass = (() => {
    switch (order?.status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'paid':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  })();

  const orderStatusLabel = order?.status
    ? order.status.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
    : 'Pending';

  const handleDisputeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderItemId) {
      setDisputeError('Select an item to dispute.');
      return;
    }
    if (!disputeReason || !disputeDescription.trim()) {
      setDisputeError('Provide a reason and description.');
      return;
    }

    setSubmitting(true);
    setDisputeError(null);
    try {
      await disputesService.open({
        orderItemId: selectedOrderItemId,
        reasonCode: mapDisputeReason(disputeReason),
        description: disputeDescription.trim(),
      });
      showToast({
        message: 'Dispute submitted. We will review it within 24 hours.',
        type: 'success',
      });
      setShowDisputeModal(false);
      setDisputeReason('');
      setDisputeDescription('');
      setDisputeError(null);
    } catch (err) {
      console.error('Failed to submit dispute:', err);
      setDisputeError('Could not submit dispute. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderItemId) {
      setReviewError('Select an item to review.');
      return;
    }
    if (rating < 1 || !reviewText.trim()) {
      setReviewError('Select a rating and write a review.');
      return;
    }

    setSubmitting(true);
    setReviewError(null);
    try {
      await reviewsService.create({
        orderItemId: selectedOrderItemId,
        rating,
        comment: reviewText.trim(),
      });
      showToast({
        message: 'Review submitted. Thank you.',
        type: 'success',
      });
      setShowReviewModal(false);
      setRating(0);
      setReviewText('');
      setReviewError(null);
    } catch (err) {
      console.error('Failed to submit review:', err);
      setReviewError('Could not submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const loadTrackingEvents = async (
    itemId: string,
    trackingCode?: string | null,
    forceRefresh: boolean = false,
    notifyOnError: boolean = false,
  ) => {
    if (!trackingCode) {
      setTrackingErrors((prev) => ({
        ...prev,
        [itemId]: 'Tracking number not available yet.',
      }));
      setTrackingUpdatedAt((prev) => ({
        ...prev,
        [itemId]: new Date().toISOString(),
      }));
      return;
    }

    if (!forceRefresh && trackingEvents[itemId]?.length) {
      return;
    }

    if (loadingTracking[itemId]) {
      return;
    }

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const withJitter = (ms: number) => Math.round(ms * (0.7 + Math.random() * 0.6));
    const maxAttempts = 3;
    const baseDelayMs = 500;

    setLoadingTracking((prev) => ({ ...prev, [itemId]: true }));
    setTrackingErrors((prev) => ({ ...prev, [itemId]: '' }));
    try {
      let info: any = null;

      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
          info = await fulfillmentService.trackShipment(trackingCode);
          break;
        } catch (err) {
          if (attempt === maxAttempts) {
            throw err;
          }
          await sleep(withJitter(baseDelayMs * attempt));
        }
      }

      const sortedEvents = (info?.events || []).slice().sort((a: any, b: any) => {
        const aTime = new Date(a?.timestamp || 0).getTime();
        const bTime = new Date(b?.timestamp || 0).getTime();
        return bTime - aTime;
      });

      setTrackingEvents((prev) => ({
        ...prev,
        [itemId]: sortedEvents,
      }));
      setTrackingUpdatedAt((prev) => ({
        ...prev,
        [itemId]: new Date().toISOString(),
      }));
    } catch (err) {
      console.error('Failed to load tracking events:', err);
      setTrackingErrors((prev) => ({
        ...prev,
        [itemId]: 'Tracking is temporarily unavailable. Please try again in a few minutes.',
      }));
      if (notifyOnError) {
        showToast({
          message: 'Tracking is temporarily unavailable.',
          type: 'error',
          actionLabel: 'Retry now',
          onAction: () => loadTrackingEvents(itemId, trackingCode, true, true),
        });
      }
    } finally {
      setLoadingTracking((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const deriveTrackingStatus = (events: any[]) => {
    if (!events || events.length === 0) {
      return { label: 'No updates', style: 'bg-gray-100 text-gray-600' };
    }

    const latest = events[0]?.description?.toLowerCase?.() || '';
    if (latest.includes('out for delivery')) {
      return { label: 'Out for Delivery', style: 'bg-blue-100 text-blue-700' };
    }
    if (latest.includes('delivered')) {
      return { label: 'Delivered', style: 'bg-green-100 text-green-700' };
    }
    if (latest.includes('in transit') || latest.includes('transit')) {
      return { label: 'In Transit', style: 'bg-yellow-100 text-yellow-700' };
    }
    if (latest.includes('picked up') || latest.includes('shipped')) {
      return { label: 'Shipped', style: 'bg-purple-100 text-purple-700' };
    }
    if (latest.includes('exception') || latest.includes('failed')) {
      return { label: 'Exception', style: 'bg-red-100 text-red-700' };
    }

    return { label: 'Update Available', style: 'bg-gray-100 text-gray-600' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-gray-600">Loading order...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-red-600">{error || 'Order not found.'}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-emerald-600">Home</Link>
            <i className="ri-arrow-right-s-line"></i>
            <Link to="/buyer-orders" className="hover:text-emerald-600">My Orders</Link>
            <i className="ri-arrow-right-s-line"></i>
            <span className="text-gray-900">Order #{order.id}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Order #{order.id}</h1>
                  <p className="text-gray-600">
                    Placed on {formatDate(order.date)}
                  </p>
                </div>
                <span className={`px-4 py-2 ${orderStatusClass} rounded-full font-medium whitespace-nowrap`}>
                  <i className="ri-checkbox-circle-fill mr-1"></i>
                  {orderStatusLabel}
                </span>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <h2 className="text-xl font-bold text-gray-900">Tracking Timeline</h2>
                <label className="inline-flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={autoRefreshEnabled}
                    onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  Auto-refresh tracking (5 min)
                </label>
              </div>
              <div className="space-y-6">
                {trackingTimeline.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <i className={`${step.icon} text-xl`}></i>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                          {step.status}
                        </h3>
                        <span className="text-sm text-gray-500">{step.date || '-'}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Items</h2>
              <div className="space-y-6">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-start space-x-4 pb-6 border-b border-gray-200 last:border-0">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image.</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        <i className="ri-store-2-line mr-1"></i>
                        {item.seller}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span>Qty: {item.quantity}</span>
                        <span className="font-semibold text-gray-900">${item.price}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium whitespace-nowrap">
                          {item.status}
                        </span>
                        {item.deliveredDate ? (
                          <span className="text-xs text-gray-500">
                            Delivered on {formatDate(item.deliveredDate)}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">
                            Tracking in progress
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                        <i className="ri-truck-line"></i>
                        <span>{item.carrier || 'Carrier pending'}</span>
                        <span className="text-emerald-600 font-medium">
                          {item.trackingCode || 'Tracking pending'}
                        </span>
                      </div>
                      {item.deliveryProofUrl && (
                        <div className="mb-3">
                          <a
                            href={item.deliveryProofUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-emerald-700 hover:text-emerald-800 underline"
                          >
                            View delivery proof
                          </a>
                        </div>
                      )}
                      <div className="mb-3">
                        <button
                          type="button"
                          onClick={() => loadTrackingEvents(item.id, item.trackingCode, false, true)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                          disabled={loadingTracking[item.id]}
                        >
                          {loadingTracking[item.id] ? 'Loading tracking...' : 'View tracking events'}
                        </button>
                        {trackingEvents[item.id]?.length > 0 && (
                          <button
                            type="button"
                            onClick={() => loadTrackingEvents(item.id, item.trackingCode, true, true)}
                            className="ml-3 text-sm text-gray-600 hover:text-gray-800"
                            disabled={loadingTracking[item.id]}
                          >
                            Refresh
                          </button>
                        )}
                        {loadingTracking[item.id] && (
                          <span className="ml-3 inline-flex items-center gap-1 text-xs text-gray-500">
                            <i className="ri-loader-4-line animate-spin"></i>
                            Loading...
                          </span>
                        )}
                        {trackingErrors[item.id] && !loadingTracking[item.id] && (
                          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                            <div className="flex items-start justify-between gap-3">
                              <span>{trackingErrors[item.id]}</span>
                              <button
                                type="button"
                                onClick={() => loadTrackingEvents(item.id, item.trackingCode, true, true)}
                                className="text-xs font-semibold text-red-700 hover:text-red-800"
                              >
                                Retry now
                              </button>
                            </div>
                          </div>
                        )}
                        {trackingEvents[item.id]?.length > 0 && (
                          <div className="mt-3 space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
                            {trackingUpdatedAt[item.id] && (
                              <div className="flex items-center justify-between text-[11px] text-gray-500">
                                <span>Last updated</span>
                                <span>{formatDateTime(trackingUpdatedAt[item.id])}</span>
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-gray-500">Latest status</span>
                              <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full ${deriveTrackingStatus(trackingEvents[item.id]).style}`}>
                                {deriveTrackingStatus(trackingEvents[item.id]).label}
                              </span>
                            </div>
                            {(expandedTracking[item.id] ? trackingEvents[item.id] : trackingEvents[item.id].slice(0, 3)).map((event: any, index: number) => (
                              <div key={index} className="flex items-start justify-between gap-3">
                                <span>{event.description}</span>
                                <span className="text-gray-500 whitespace-nowrap">
                                  {formatDateTime(event.timestamp)}
                                </span>
                              </div>
                            ))}
                            {trackingEvents[item.id].length > 3 && (
                              <button
                                type="button"
                                onClick={() => setExpandedTracking((prev) => ({
                                  ...prev,
                                  [item.id]: !prev[item.id],
                                }))}
                                className="text-[11px] text-blue-600 hover:text-blue-800 text-left"
                              >
                                {expandedTracking[item.id] ? 'Show less' : `Show ${trackingEvents[item.id].length - 3} more`}
                              </button>
                            )}
                          </div>
                        )}
                        {trackingEvents[item.id] && trackingEvents[item.id].length === 0 && !loadingTracking[item.id] && (
                          <div className="mt-3 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-3 text-xs text-gray-500">
                            {trackingUpdatedAt[item.id] && (
                              <div className="flex items-center justify-between text-[11px] text-gray-500 mb-2">
                                <span>Last updated</span>
                                <span>{formatDateTime(trackingUpdatedAt[item.id])}</span>
                              </div>
                            )}
                            <span>No tracking events yet. Check back soon.</span>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedOrderItemId(item.id);
                            setReviewError(null);
                            setShowReviewModal(true);
                          }}
                          className="whitespace-nowrap"
                        >
                          <i className="ri-star-line mr-2"></i>
                          Write Review
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedOrderItemId(item.id);
                            setDisputeError(null);
                            setShowDisputeModal(true);
                          }}
                          className="whitespace-nowrap"
                        >
                          <i className="ri-error-warning-line mr-2"></i>
                          Report Issue
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium">{order.shippingAddress.name}</p>
                {order.shippingAddress.street && <p>{order.shippingAddress.street}</p>}
                <p>
                  {[order.shippingAddress.city, order.shippingAddress.state].filter(Boolean).join(', ')}
                </p>
                <p>
                  {[order.shippingAddress.country, order.shippingAddress.postalCode].filter(Boolean).join(' ')}
                </p>
                {order.shippingAddress.phone && <p className="pt-2">{order.shippingAddress.phone}</p>}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">${order.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900 text-lg">${order.total}</span>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                <i className="ri-customer-service-line text-emerald-600 mr-2"></i>
                Need Help?
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Our support team is here to assist you with any questions or concerns.
              </p>
              <Button variant="outline" className="w-full whitespace-nowrap">
                <i className="ri-message-3-line mr-2"></i>
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Report an Issue</h2>
              <button
                onClick={() => {
                  setShowDisputeModal(false);
                  setDisputeError(null);
                }}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            <form onSubmit={handleDisputeSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item *
                  </label>
                  <select
                    value={selectedOrderItemId}
                    onChange={(e) => {
                      setSelectedOrderItemId(e.target.value);
                      setDisputeError(null);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    {order.items.map((item: any) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Type *
                  </label>
                  <select
                    value={disputeReason}
                    onChange={(e) => {
                      setDisputeReason(e.target.value);
                      setDisputeError(null);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    <option value="">Select an issue</option>
                    <option value="not_received">Item not received</option>
                    <option value="damaged">Item damaged</option>
                    <option value="wrong_item">Wrong item received</option>
                    <option value="not_as_described">Not as described</option>
                    <option value="quality_issue">Quality issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={disputeDescription}
                    onChange={(e) => {
                      setDisputeDescription(e.target.value);
                      setDisputeError(null);
                    }}
                    placeholder="Please describe the issue in detail..."
                    rows={6}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">{disputeDescription.length}/500 characters</p>
                </div>
              </div>
              {disputeError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {disputeError}
                </div>
              )}
              <div className="flex space-x-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowDisputeModal(false);
                    setDisputeError(null);
                  }}
                  className="flex-1 whitespace-nowrap"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 whitespace-nowrap" disabled={submitting}>
                  Submit Issue
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewError(null);
                }}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            <form onSubmit={handleReviewSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item *
                  </label>
                  <select
                    value={selectedOrderItemId}
                    onChange={(e) => {
                      setSelectedOrderItemId(e.target.value);
                      setReviewError(null);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    {order.items.map((item: any) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating *
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          setRating(star);
                          setReviewError(null);
                        }}
                        className="cursor-pointer"
                      >
                        <i
                          className={`${
                            star <= rating ? 'ri-star-fill text-yellow-400' : 'ri-star-line text-gray-300'
                          } text-3xl`}
                        ></i>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => {
                      setReviewText(e.target.value);
                      setReviewError(null);
                    }}
                    placeholder="Share your experience with this product..."
                    rows={6}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">{reviewText.length}/500 characters</p>
                </div>
              </div>
              {reviewError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {reviewError}
                </div>
              )}
              <div className="flex space-x-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewError(null);
                  }}
                  className="flex-1 whitespace-nowrap"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 whitespace-nowrap" disabled={rating === 0 || submitting}>
                  Submit Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
