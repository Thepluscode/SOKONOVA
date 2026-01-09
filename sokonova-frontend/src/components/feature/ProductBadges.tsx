
import React from 'react';

interface ProductBadgesProps {
  isVerified?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  discount?: number;
  className?: string;
}

const ProductBadges: React.FC<ProductBadgesProps> = ({
  isVerified,
  isFeatured,
  isBestseller,
  isNew,
  discount,
  className = ''
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {isVerified && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-500 text-white text-xs font-medium rounded-full">
          <i className="ri-verified-badge-fill"></i>
          Verified
        </span>
      )}
      {isFeatured && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
          <i className="ri-star-fill"></i>
          Featured
        </span>
      )}
      {isBestseller && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-500 text-white text-xs font-medium rounded-full">
          <i className="ri-fire-fill"></i>
          Bestseller
        </span>
      )}
      {isNew && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
          <i className="ri-sparkle-fill"></i>
          New
        </span>
      )}
      {discount && discount > 0 && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
          -{discount}% OFF
        </span>
      )}
    </div>
  );
};

export default ProductBadges;
