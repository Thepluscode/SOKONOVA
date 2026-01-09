import { useState } from 'react';

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  verified: boolean;
  comment: string;
  images?: string[];
  helpful: number;
}

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      userName: 'Sarah Johnson',
      userAvatar: 'https://readdy.ai/api/search-image?query=professional%20woman%20portrait%20with%20warm%20smile%20wearing%20casual%20business%20attire%20against%20soft%20neutral%20background%20studio%20lighting&width=100&height=100&seq=review1&orientation=squarish',
      rating: 5,
      date: '2024-01-15',
      verified: true,
      comment: 'Absolutely love this product! The quality exceeded my expectations and delivery was super fast. Highly recommend to anyone looking for great value.',
      images: [
        'https://readdy.ai/api/search-image?query=high%20quality%20product%20photography%20showing%20detailed%20close%20up%20view%20with%20professional%20lighting%20and%20clean%20white%20background%20showcasing%20premium%20craftsmanship&width=400&height=400&seq=review1img1&orientation=squarish',
        'https://readdy.ai/api/search-image?query=product%20in%20use%20lifestyle%20photography%20showing%20real%20world%20application%20with%20natural%20lighting%20and%20authentic%20setting%20demonstrating%20functionality&width=400&height=400&seq=review1img2&orientation=squarish',
      ],
      helpful: 24,
    },
    {
      id: '2',
      userName: 'Michael Chen',
      userAvatar: 'https://readdy.ai/api/search-image?query=professional%20man%20portrait%20with%20friendly%20expression%20wearing%20smart%20casual%20attire%20against%20soft%20neutral%20background%20studio%20lighting&width=100&height=100&seq=review2&orientation=squarish',
      rating: 4,
      date: '2024-01-10',
      verified: true,
      comment: 'Great product overall. Works exactly as described. Only minor issue was the packaging could be better, but the product itself is excellent.',
      helpful: 15,
    },
    {
      id: '3',
      userName: 'Emily Rodriguez',
      userAvatar: 'https://readdy.ai/api/search-image?query=professional%20woman%20portrait%20with%20confident%20smile%20wearing%20modern%20casual%20outfit%20against%20soft%20neutral%20background%20studio%20lighting&width=100&height=100&seq=review3&orientation=squarish',
      rating: 5,
      date: '2024-01-05',
      verified: true,
      comment: 'Best purchase I\'ve made this year! The seller was very responsive and the product quality is outstanding. Will definitely buy again.',
      images: [
        'https://readdy.ai/api/search-image?query=detailed%20product%20photography%20showing%20multiple%20angles%20and%20features%20with%20professional%20studio%20lighting%20and%20clean%20white%20background&width=400&height=400&seq=review3img1&orientation=squarish',
      ],
      helpful: 31,
    },
  ]);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
  });

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100,
  }));

  const handleSubmitReview = () => {
    // Submit review logic
    alert('Review submitted successfully!');
    setShowReviewModal(false);
    setNewReview({ rating: 5, comment: '' });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
        <button
          onClick={() => setShowReviewModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
        >
          Write a Review
        </button>
      </div>

      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-200">
        <div className="flex flex-col items-center justify-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`ri-star-${i < Math.floor(averageRating) ? 'fill' : 'line'} text-yellow-400 text-xl`}
              ></i>
            ))}
          </div>
          <p className="text-gray-600">Based on {reviews.length} reviews</p>
        </div>

        <div className="space-y-2">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-20">
                <span className="text-sm font-medium text-gray-700">{rating}</span>
                <i className="ri-star-fill text-yellow-400 text-sm"></i>
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
            <div className="flex items-start gap-4">
              <img
                src={review.userAvatar}
                alt={review.userName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                      {review.verified && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`ri-star-${i < review.rating ? 'fill' : 'line'} text-yellow-400 text-sm`}
                          ></i>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-3">{review.comment}</p>

                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {review.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                      >
                        <img
                          src={img}
                          alt={`Review ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors cursor-pointer whitespace-nowrap">
                    <i className="ri-thumb-up-line"></i>
                    <span>Helpful ({review.helpful})</span>
                  </button>
                  <button className="text-sm text-gray-600 hover:text-emerald-600 transition-colors cursor-pointer whitespace-nowrap">
                    Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="w-8 h-8 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setNewReview({ ...newReview, rating })}
                      className="w-10 h-10 flex items-center justify-center cursor-pointer whitespace-nowrap"
                    >
                      <i
                        className={`ri-star-${rating <= newReview.rating ? 'fill' : 'line'} text-3xl text-yellow-400`}
                      ></i>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  rows={6}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="Share your experience with this product..."
                ></textarea>
                <p className="text-sm text-gray-500 mt-1">
                  {newReview.comment.length}/500 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Photos (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                  <i className="ri-image-add-line text-4xl text-gray-400 mb-2"></i>
                  <p className="text-sm text-gray-600">Click to upload photos</p>
                </div>
              </div>

              <button
                onClick={handleSubmitReview}
                disabled={!newReview.comment.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
