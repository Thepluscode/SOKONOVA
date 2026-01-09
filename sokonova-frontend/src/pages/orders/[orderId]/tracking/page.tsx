import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../../../components/feature/Header';
import Footer from '../../../../components/feature/Footer';
import Button from '../../../../components/base/Button';

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeDescription, setDisputeDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const order = {
    id: orderId || 'ORD-2024-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 189.98,
    items: [
      {
        id: 1,
        name: 'Handwoven Kente Cloth Dress',
        price: 89.99,
        quantity: 1,
        seller: 'Adunni Crafts',
        image: 'https://readdy.ai/api/search-image?query=Beautiful%20traditional%20African%20Kente%20cloth%20dress%20with%20vibrant%20geometric%20patterns%2C%20handwoven%20textile%2C%20professional%20product%20photography%20on%20white%20background&width=150&height=150&seq=order1&orientation=squarish',
        status: 'delivered',
        trackingCode: 'TRK-KE-001',
        carrier: 'DHL Express',
        deliveredDate: '2024-01-22'
      },
      {
        id: 2,
        name: 'Organic Shea Butter Set',
        price: 24.99,
        quantity: 4,
        seller: 'Natural Beauty Co',
        image: 'https://readdy.ai/api/search-image?query=Premium%20organic%20shea%20butter%20skincare%20set%20with%20natural%20ingredients%2C%20elegant%20glass%20jars%2C%20clean%20packaging%20on%20white%20background&width=150&height=150&seq=order2&orientation=squarish',
        status: 'delivered',
        trackingCode: 'TRK-SB-002',
        carrier: 'FedEx',
        deliveredDate: '2024-01-22'
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'Lagos',
      state: 'Lagos State',
      country: 'Nigeria',
      postalCode: '100001',
      phone: '+234 123 456 7890'
    }
  };

  const trackingTimeline = [
    {
      status: 'Order Placed',
      date: '2024-01-15 10:30 AM',
      description: 'Your order has been confirmed',
      icon: 'ri-checkbox-circle-fill',
      completed: true
    },
    {
      status: 'Processing',
      date: '2024-01-16 02:15 PM',
      description: 'Seller is preparing your items',
      icon: 'ri-box-3-fill',
      completed: true
    },
    {
      status: 'Shipped',
      date: '2024-01-18 09:00 AM',
      description: 'Package handed to carrier',
      icon: 'ri-truck-fill',
      completed: true
    },
    {
      status: 'In Transit',
      date: '2024-01-20 03:45 PM',
      description: 'Package is on the way',
      icon: 'ri-map-pin-fill',
      completed: true
    },
    {
      status: 'Delivered',
      date: '2024-01-22 11:20 AM',
      description: 'Package delivered successfully',
      icon: 'ri-home-smile-fill',
      completed: true
    }
  ];

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Dispute submitted successfully. Our team will review it within 24 hours.');
    setShowDisputeModal(false);
    setDisputeReason('');
    setDisputeDescription('');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your review!');
    setShowReviewModal(false);
    setRating(0);
    setReviewText('');
  };

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
                    Placed on {new Date(order.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium whitespace-nowrap">
                  <i className="ri-checkbox-circle-fill mr-1"></i>
                  Delivered
                </span>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Tracking Timeline</h2>
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
                        <span className="text-sm text-gray-500">{step.date}</span>
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
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 pb-6 border-b border-gray-200 last:border-0">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
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
                        <span className="text-xs text-gray-500">
                          Delivered on {new Date(item.deliveredDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                        <i className="ri-truck-line"></i>
                        <span>{item.carrier}</span>
                        <span className="text-emerald-600 font-medium">{item.trackingCode}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowReviewModal(true)}
                          className="whitespace-nowrap"
                        >
                          <i className="ri-star-line mr-2"></i>
                          Write Review
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowDisputeModal(true)}
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
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>{order.shippingAddress.country} {order.shippingAddress.postalCode}</p>
                <p className="pt-2">{order.shippingAddress.phone}</p>
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
                onClick={() => setShowDisputeModal(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            <form onSubmit={handleDisputeSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Type *
                  </label>
                  <select
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
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
                    onChange={(e) => setDisputeDescription(e.target.value)}
                    placeholder="Please describe the issue in detail..."
                    rows={6}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">{disputeDescription.length}/500 characters</p>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDisputeModal(false)}
                  className="flex-1 whitespace-nowrap"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 whitespace-nowrap">
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
                onClick={() => setShowReviewModal(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            <form onSubmit={handleReviewSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating *
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
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
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience with this product..."
                    rows={6}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">{reviewText.length}/500 characters</p>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 whitespace-nowrap"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 whitespace-nowrap" disabled={rating === 0}>
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
