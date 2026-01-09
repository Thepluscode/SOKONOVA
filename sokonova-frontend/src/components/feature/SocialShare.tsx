
import { useState } from 'react';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
}

export default function SocialShare({ url, title, description, image }: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    pinterest: image
      ? `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodeURIComponent(image)}&description=${encodedTitle}`
      : '',
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (platform: string) => {
    const link = shareLinks[platform as keyof typeof shareLinks];
    if (link) {
      window.open(link, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
      >
        <i className="ri-share-line"></i>
        <span className="text-sm font-medium">Share</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Share this product</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 hover:bg-gray-100 rounded-full flex items-center justify-center cursor-pointer whitespace-nowrap"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-4">
              <button
                onClick={() => handleShare('facebook')}
                className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <i className="ri-facebook-fill text-white text-xl"></i>
                </div>
                <span className="text-xs text-gray-600">Facebook</span>
              </button>

              <button
                onClick={() => handleShare('twitter')}
                className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center">
                  <i className="ri-twitter-x-fill text-white text-xl"></i>
                </div>
                <span className="text-xs text-gray-600">Twitter</span>
              </button>

              <button
                onClick={() => handleShare('whatsapp')}
                className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <i className="ri-whatsapp-fill text-white text-xl"></i>
                </div>
                <span className="text-xs text-gray-600">WhatsApp</span>
              </button>

              <button
                onClick={() => handleShare('linkedin')}
                className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center">
                  <i className="ri-linkedin-fill text-white text-xl"></i>
                </div>
                <span className="text-xs text-gray-600">LinkedIn</span>
              </button>

              {image && (
                <button
                  onClick={() => handleShare('pinterest')}
                  className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                    <i className="ri-pinterest-fill text-white text-xl"></i>
                  </div>
                  <span className="text-xs text-gray-600">Pinterest</span>
                </button>
              )}

              <button
                onClick={() => handleShare('email')}
                className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                  <i className="ri-mail-fill text-white text-xl"></i>
                </div>
                <span className="text-xs text-gray-600">Email</span>
              </button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={url}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <i className="ri-check-line mr-1"></i>
                      Copied
                    </>
                  ) : (
                    <>
                      <i className="ri-file-copy-line mr-1"></i>
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
