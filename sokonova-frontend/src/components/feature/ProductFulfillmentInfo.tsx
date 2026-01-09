"use client";

import { DeliveryPromise } from '@/components/DeliveryPromise';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Truck, Shield, RotateCcw } from 'lucide-react';

interface ProductFulfillmentInfoProps {
  productId: string;
  location?: string;
}

export function ProductFulfillmentInfo({ productId, location }: ProductFulfillmentInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Shipping & Returns
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Delivery Promise</h3>
          <DeliveryPromise productId={productId} location={location} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
          <div className="flex items-start gap-2">
            <Shield className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <div className="text-sm font-medium">Secure Shipping</div>
              <div className="text-xs text-muted-foreground">
                Fully insured delivery
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <RotateCcw className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <div className="text-sm font-medium">Easy Returns</div>
              <div className="text-xs text-muted-foreground">
                30-day return policy
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Truck className="h-5 w-5 text-purple-500 mt-0.5" />
            <div>
              <div className="text-sm font-medium">Fast Delivery</div>
              <div className="text-xs text-muted-foreground">
                Same-day processing
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}