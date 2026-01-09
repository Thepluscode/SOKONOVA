
import React, { useState } from 'react';

interface GiftOptionsProps {
  onGiftOptionChange?: (options: GiftOption) => void;
}

interface GiftOption {
  isGift: boolean;
  giftWrap: boolean;
  giftMessage: string;
  giftWrapType?: string;
}

const giftWrapTypes = [
  { id: 'classic', name: 'Classic Wrap', price: 5, image: 'https://readdy.ai/api/search-image?query=elegant%20classic%20gift%20wrapping%20paper%20with%20ribbon%20and%20bow%20on%20white%20background%20minimalist%20product%20photography%20studio%20lighting&width=200&height=200&seq=giftwrap1&orientation=squarish' },
  { id: 'premium', name: 'Premium Wrap', price: 10, image: 'https://readdy.ai/api/search-image?query=luxury%20premium%20gift%20wrapping%20with%20gold%20foil%20and%20silk%20ribbon%20on%20white%20background%20high%20end%20product%20photography&width=200&height=200&seq=giftwrap2&orientation=squarish' },
  { id: 'eco', name: 'Eco-Friendly', price: 7, image: 'https://readdy.ai/api/search-image?query=sustainable%20eco%20friendly%20gift%20wrapping%20with%20recycled%20kraft%20paper%20and%20natural%20twine%20on%20white%20background%20organic%20product%20photography&width=200&height=200&seq=giftwrap3&orientation=squarish' },
  { id: 'festive', name: 'Festive Wrap', price: 8, image: 'https://readdy.ai/api/search-image?query=colorful%20festive%20gift%20wrapping%20with%20holiday%20patterns%20and%20decorative%20elements%20on%20white%20background%20cheerful%20product%20photography&width=200&height=200&seq=giftwrap4&orientation=squarish' }
];

const GiftOptions: React.FC<GiftOptionsProps> = ({ onGiftOptionChange }) => {
  const [isGift, setIsGift] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);
  const [selectedWrapType, setSelectedWrapType] = useState('');
  const [giftMessage, setGiftMessage] = useState('');

  const handleIsGiftChange = (value: boolean) => {
    setIsGift(value);
    if (!value) {
      setGiftWrap(false);
      setSelectedWrapType('');
      setGiftMessage('');
    }
    notifyChange({ isGift: value, giftWrap: false, giftMessage: '', giftWrapType: '' });
  };

  const handleGiftWrapChange = (value: boolean) => {
    setGiftWrap(value);
    if (!value) {
      setSelectedWrapType('');
    }
    notifyChange({ isGift, giftWrap: value, giftMessage, giftWrapType: value ? selectedWrapType : '' });
  };

  const handleWrapTypeChange = (type: string) => {
    setSelectedWrapType(type);
    notifyChange({ isGift, giftWrap, giftMessage, giftWrapType: type });
  };

  const handleMessageChange = (message: string) => {
    setGiftMessage(message);
    notifyChange({ isGift, giftWrap, giftMessage: message, giftWrapType: selectedWrapType });
  };

  const notifyChange = (options: GiftOption) => {
    if (onGiftOptionChange) {
      onGiftOptionChange(options);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
          <i className="ri-gift-line text-rose-600 text-xl"></i>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gift Options</h3>
          <p className="text-sm text-gray-500">Make this order extra special</p>
        </div>
      </div>

      {/* Is this a gift? */}
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isGift}
            onChange={(e) => handleIsGiftChange(e.target.checked)}
            className="w-5 h-5 text-teal-600 rounded border-gray-300 focus:ring-2 focus:ring-teal-500 cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-700">This is a gift</span>
        </label>
      </div>

      {isGift && (
        <div className="space-y-6 pl-8 border-l-2 border-gray-100">
          {/* Gift Wrap Option */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={giftWrap}
                onChange={(e) => handleGiftWrapChange(e.target.checked)}
                className="w-5 h-5 text-teal-600 rounded border-gray-300 focus:ring-2 focus:ring-teal-500 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700">Add gift wrapping</span>
            </label>

            {giftWrap && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {giftWrapTypes.map((wrap) => (
                  <button
                    key={wrap.id}
                    onClick={() => handleWrapTypeChange(wrap.id)}
                    className={`relative p-3 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedWrapType === wrap.id
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-full h-24 bg-gray-100 rounded-lg mb-2 overflow-hidden">
                      <img src={wrap.image} alt={wrap.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{wrap.name}</p>
                    <p className="text-xs text-gray-500">+${wrap.price}</p>
                    {selectedWrapType === wrap.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                        <i className="ri-check-line text-white text-sm"></i>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Gift Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gift Message (Optional)
            </label>
            <textarea
              value={giftMessage}
              onChange={(e) => handleMessageChange(e.target.value)}
              maxLength={200}
              placeholder="Write a personal message for the recipient..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-sm"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">{giftMessage.length}/200 characters</p>
          </div>

          {/* Gift Summary */}
          {(giftWrap || giftMessage) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900 mb-2">Gift Summary:</p>
              <ul className="space-y-1 text-sm text-gray-600">
                {giftWrap && selectedWrapType && (
                  <li className="flex items-center gap-2">
                    <i className="ri-check-line text-teal-600"></i>
                    {giftWrapTypes.find(w => w.id === selectedWrapType)?.name} (+${giftWrapTypes.find(w => w.id === selectedWrapType)?.price})
                  </li>
                )}
                {giftMessage && (
                  <li className="flex items-center gap-2">
                    <i className="ri-check-line text-teal-600"></i>
                    Personal message included
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GiftOptions;
