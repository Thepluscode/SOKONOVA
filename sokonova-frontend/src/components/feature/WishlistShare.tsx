
import { useState } from 'react';

interface WishlistShareProps {
  wishlistId: string;
  wishlistName: string;
  itemCount: number;
  onClose: () => void;
}

export default function WishlistShare({
  wishlistId,
  wishlistName,
  itemCount,
  onClose
}: WishlistShareProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/wishlist/shared/${wishlistId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const text = `Check out my wishlist "${wishlistName}" with ${itemCount} items on SOKONOVA!`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(shareUrl);

    const urls: { [key: string]: string } = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      email: `mailto:?subject=${encodeURIComponent(wishlistName)}&body=${encodedText}%20${encodedUrl}`
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Share Wishlist</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors whitespace-nowrap"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-2">Share "{wishlistName}"</p>
          <p className="text-sm text-gray-500">{itemCount} items in this wishlist</p>
        </div>

        {/* Copy Link */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Share Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors whitespace-nowrap"
            >
              {copied ? (
                <i className="ri-check-line"></i>
              ) : (
                <i className="ri-file-copy-line"></i>
              )}
            </button>
          </div>
          {copied && (
            <p className="text-sm text-teal-600 mt-2">Link copied to clipboard!</p>
          )}
        </div>

        {/* Social Share */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Share on Social Media
          </label>
          <div className="grid grid-cols-5 gap-3">
            <button
              onClick={() => handleShare('facebook')}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <i className="ri-facebook-fill text-xl text-white"></i>
              </div>
              <span className="text-xs text-gray-600">Facebook</span>
            </button>

            <button
              onClick={() => handleShare('twitter')}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center">
                <i className="ri-twitter-fill text-xl text-white"></i>
              </div>
              <span className="text-xs text-gray-600">Twitter</span>
            </button>

            <button
              onClick={() => handleShare('whatsapp')}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <i className="ri-whatsapp-fill text-xl text-white"></i>
              </div>
              <span className="text-xs text-gray-600">WhatsApp</span>
            </button>

            <button
              onClick={() => handleShare('telegram')}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <div className="w-12 h-12 bg-sky-400 rounded-full flex items-center justify-center">
                <i className="ri-telegram-fill text-xl text-white"></i>
              </div>
              <span className="text-xs text-gray-600">Telegram</span>
            </button>

            <button
              onClick={() => handleShare('email')}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                <i className="ri-mail-fill text-xl text-white"></i>
              </div>
              <span className="text-xs text-gray-600">Email</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
