"use client";

import { useState, useEffect } from 'react';
import { getExceptionStatus } from '@/lib/api/fulfillment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { AlertCircle, CheckCircle, Clock, Truck } from 'lucide-react';

interface ExceptionData {
  orderItemId: string;
  exceptionType: string | null;
  exceptionSeverity: string;
  nextAction: string | null;
  slaDeadline: string | null;
  orderDetails: {
    orderId: string;
    productTitle: string;
    buyerName: string;
    buyerEmail: string;
    sellerName: string;
    fulfillmentStatus: string;
    shippedAt: string | null;
    expectedDelivery: string | null;
  };
}

export function ExceptionWorkflowDashboard({ sellerId }: { sellerId: string }) {
  const [exceptions, setExceptions] = useState<ExceptionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExceptionData();
  }, [sellerId]);

  const loadExceptionData = async () => {
    try {
      setLoading(true);
      // In a real implementation, we would fetch all order items with exceptions
      // For now, we'll mock this with sample data
      const mockExceptions: ExceptionData[] = [
        {
          orderItemId: "item-1",
          exceptionType: "delivery_delay",
          exceptionSeverity: "high",
          nextAction: "seller_notification",
          slaDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          orderDetails: {
            orderId: "order-123",
            productTitle: "Wireless Headphones",
            buyerName: "John Doe",
            buyerEmail: "john@example.com",
            sellerName: "Tech Gadgets Store",
            fulfillmentStatus: "SHIPPED",
            shippedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            expectedDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          }
        },
        {
          orderItemId: "item-2",
          exceptionType: "tracking_issue",
          exceptionSeverity: "medium",
          nextAction: "seller_reminder",
          slaDeadline: null,
          orderDetails: {
            orderId: "order-124",
            productTitle: "Smart Watch",
            buyerName: "Jane Smith",
            buyerEmail: "jane@example.com",
            sellerName: "Tech Gadgets Store",
            fulfillmentStatus: "SHIPPED",
            shippedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            expectedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          }
        },
        {
          orderItemId: "item-3",
          exceptionType: "reported_issue",
          exceptionSeverity: "high",
          nextAction: "seller_resolution_required",
          slaDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          orderDetails: {
            orderId: "order-125",
            productTitle: "Bluetooth Speaker",
            buyerName: "Bob Johnson",
            buyerEmail: "bob@example.com",
            sellerName: "Tech Gadgets Store",
            fulfillmentStatus: "ISSUE",
            shippedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            expectedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          }
        }
      ];
      setExceptions(mockExceptions);
    } catch (err) {
      setError('Could not load exception data.');
      console.error('Error loading exception data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getExceptionIcon = (type: string | null) => {
    switch (type) {
      case 'delivery_delay':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'tracking_issue':
        return <Truck className="h-4 w-4 text-yellow-500" />;
      case 'reported_issue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNextActionText = (action: string | null) => {
    switch (action) {
      case 'seller_notification':
        return 'Notify Seller';
      case 'seller_reminder':
        return 'Remind Seller';
      case 'seller_resolution_required':
        return 'Resolve Issue';
      case 'review_required':
        return 'Review Status';
      default:
        return 'No action required';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-500">{error}</p>
        <Button onClick={loadExceptionData} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Exception Workflow Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {exceptions.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-muted-foreground">No active exceptions.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order/Product</TableHead>
                <TableHead>Exception</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Next Action</TableHead>
                <TableHead>SLA Deadline</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exceptions.map((exception) => (
                <TableRow key={exception.orderItemId}>
                  <TableCell>
                    <div className="font-medium">{exception.orderDetails.orderId}</div>
                    <div className="text-sm text-muted-foreground">{exception.orderDetails.productTitle}</div>
                    <div className="text-xs text-muted-foreground">{exception.orderDetails.buyerName}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getExceptionIcon(exception.exceptionType)}
                      <span className="capitalize">
                        {exception.exceptionType?.replace('_', ' ') || 'No exception'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getSeverityBadge(exception.exceptionSeverity)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      {getNextActionText(exception.nextAction)}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {exception.slaDeadline ? (
                      <div>
                        <div>{new Date(exception.slaDeadline).toLocaleDateString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(exception.slaDeadline).toLocaleTimeString()}
                        </div>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{exception.orderDetails.fulfillmentStatus}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
