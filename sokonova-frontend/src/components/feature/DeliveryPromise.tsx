"use client";

import { useState, useEffect } from 'react';
import { getDeliveryPromise } from '@/lib/api/fulfillment';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface DeliveryPromiseData {
  productId: string;
  location: string;
  promisedMinDays: number;
  promisedMaxDays: number;
  confidenceLevel: number;
  sellerRating: number;
  deliveryGuarantee: boolean;
  message: string;
}

export function DeliveryPromise({ productId, location }: { productId: string; location?: string }) {
  const [deliveryPromise, setDeliveryPromise] = useState<DeliveryPromiseData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDeliveryPromise();
  }, [productId, location]);

  const loadDeliveryPromise = async () => {
    try {
      setLoading(true);
      const data = await getDeliveryPromise(productId, location);
      setDeliveryPromise(data);
    } catch (err) {
      setError('Failed to load delivery promise information');
      console.error('Error loading delivery promise:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error || !deliveryPromise) {
    return (
      <div className="text-sm text-muted-foreground">
        Delivery information unavailable
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          Delivery Promise
          {deliveryPromise.deliveryGuarantee && (
            <Badge variant="secondary" className="text-xs">
              Guaranteed
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {deliveryPromise.promisedMinDays}-{deliveryPromise.promisedMaxDays} business days
            </span>
            <span className="text-xs text-muted-foreground">
              ({Math.round(deliveryPromise.confidenceLevel * 100)}% confidence)
            </span>
          </div>

          <div className="text-sm text-muted-foreground">
            {deliveryPromise.message}
          </div>

          {deliveryPromise.sellerRating && (
            <div className="flex items-center gap-1 text-xs">
              <span>Seller rating:</span>
              <span className="font-medium">{deliveryPromise.sellerRating.toFixed(1)}/5</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default DeliveryPromise;