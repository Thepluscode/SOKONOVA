
import React from 'react';

interface SellerBadgesProps {
  isVerified?: boolean;
  isPowerSeller?: boolean;
  responseTime?: string;
  completionRate?: number;
  rating?: number;
  className?: string;
}

const SellerBadges: React.FC<SellerBadgesProps> = ({
  isVerified,
  isPowerSeller,
  responseTime,
  completionRate,
  rating,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {isVerified && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 text-sm font-medium rounded-lg border border-teal-200">
            <i className="ri-shield-check-fill text-base"></i>
            Verified Seller
          </span>
        )}
        {isPowerSeller && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-sm font-medium rounded-lg border border-amber-200">
            <i className="ri-vip-crown-fill text-base"></i>
            Power Seller
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        {responseTime && (
          <div className="flex items-center gap-1.5">
            <i className="ri-time-line text-gray-400"></i>
            <span>Responds in <strong className="text-gray-900">{responseTime}</strong></span>
          </div>
        )}
        {completionRate !== undefined && (
          <div className="flex items-center gap-1.5">
            <i className="ri-checkbox-circle-line text-gray-400"></i>
            <span><strong className="text-gray-900">{completionRate}%</strong> completion rate</span>
          </div>
        )}
        {rating !== undefined && (
          <div className="flex items-center gap-1.5">
            <i className="ri-star-fill text-amber-400"></i>
            <span><strong className="text-gray-900">{rating.toFixed(1)}</strong> rating</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerBadges;
