
import React, { useState } from 'react';

interface QuickReorderProps {
  orderId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  onReorder?: () => void;
}

const QuickReorder: React.FC<QuickReorderProps> = ({ orderId, items, onReorder }) => {
  const [isReordering, setIsReordering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleReorder = () => {
    setIsReordering(true);

    // Add all items to cart
    setTimeout(() => {
      items.forEach(item => {
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cartItems.find((i: any) => i.id === item.id);

        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          cartItems.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          });
        }

        localStorage.setItem('cart', JSON.stringify(cartItems));
      });

      setIsReordering(false);
      setShowSuccess(true);

      // Dispatch cart update event
      window.dispatchEvent(new Event('cartUpdated'));

      if (onReorder) {
        onReorder();
      }

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <>
      <button
        onClick={handleReorder}
        disabled={isReordering}
        className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
      >
        {isReordering ? (
          <>
            <i className="ri-loader-4-line animate-spin"></i>
            Adding to Cart...
          </>
        ) : (
          <>
            <i className="ri-shopping-cart-line"></i>
            Reorder
          </>
        )}
      </button>

      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-lg z-50 animate-slide-up">
          <div className="flex items-center gap-3">
            <i className="ri-checkbox-circle-fill text-2xl"></i>
            <div>
              <p className="font-semibold">Items added to cart!</p>
              <p className="text-sm text-emerald-100">{items.length} items from order #{orderId}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickReorder;
