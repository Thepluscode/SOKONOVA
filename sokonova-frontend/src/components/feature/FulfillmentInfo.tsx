interface FulfillmentInfoProps {
  sellerId: string;
  sellerName: string;
  fulfillmentType: 'seller' | 'sokonova' | 'dropship';
  shipsFrom: string;
  processingTime: string;
}

export default function FulfillmentInfo({
  sellerId,
  sellerName,
  fulfillmentType,
  shipsFrom,
  processingTime
}: FulfillmentInfoProps) {
  const getFulfillmentBadge = () => {
    switch (fulfillmentType) {
      case 'sokonova':
        return (
          <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
            <i className="ri-verified-badge-line mr-1"></i>
            SOKONOVA Fulfilled
          </span>
        );
      case 'dropship':
        return (
          <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
            <i className="ri-ship-line mr-1"></i>
            Dropship
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">
            <i className="ri-store-line mr-1"></i>
            Seller Fulfilled
          </span>
        );
    }
  };

  const getFulfillmentDescription = () => {
    switch (fulfillmentType) {
      case 'sokonova':
        return 'This item is stored, packed, and shipped by SOKONOVA. Enjoy faster delivery and hassle-free returns.';
      case 'dropship':
        return 'This item ships directly from the manufacturer. Delivery times may vary.';
      default:
        return `This item is fulfilled by ${sellerName}. The seller handles storage, packing, and shipping.`;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Fulfillment Information</h3>
          {getFulfillmentBadge()}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        {getFulfillmentDescription()}
      </p>

      <div className="space-y-3">
        <div className="flex items-start">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <i className="ri-store-2-line text-gray-600"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Sold by</p>
            <p className="text-sm text-emerald-600 hover:text-emerald-700 cursor-pointer">
              {sellerName}
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <i className="ri-map-pin-line text-gray-600"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Ships from</p>
            <p className="text-sm text-gray-600">{shipsFrom}</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <i className="ri-time-line text-gray-600"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Processing time</p>
            <p className="text-sm text-gray-600">{processingTime}</p>
          </div>
        </div>
      </div>

      {fulfillmentType === 'sokonova' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="bg-emerald-50 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <i className="ri-star-line text-emerald-600 mt-0.5"></i>
              <div>
                <p className="text-sm font-medium text-emerald-900">SOKONOVA Fulfilled Benefits</p>
                <ul className="mt-2 space-y-1 text-xs text-emerald-800">
                  <li className="flex items-center">
                    <i className="ri-check-line mr-1"></i>
                    Fast and reliable shipping
                  </li>
                  <li className="flex items-center">
                    <i className="ri-check-line mr-1"></i>
                    Easy returns and refunds
                  </li>
                  <li className="flex items-center">
                    <i className="ri-check-line mr-1"></i>
                    Customer service support
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
