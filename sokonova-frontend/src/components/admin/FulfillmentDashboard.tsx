"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DeliveryPromise } from '@/components/DeliveryPromise';
import { ExceptionWorkflowDashboard } from '@/components/ExceptionWorkflowDashboard';
import { MicroFulfillmentDashboard } from '@/components/MicroFulfillmentDashboard';
import { 
  Package, 
  AlertTriangle, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';

interface FulfillmentStats {
  packed: number;
  shipped: number;
  delivered: number;
  issue: number;
  total: number;
}

export function FulfillmentDashboard({ sellerId }: { sellerId: string }) {
  const [stats, setStats] = useState<FulfillmentStats>({
    packed: 12,
    shipped: 24,
    delivered: 156,
    issue: 3,
    total: 195
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Fulfillment Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your shipping, delivery promises, and fulfillment partnerships
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Packed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.packed}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Shipped
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.shipped}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Delivered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.delivered}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.issue}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="promises">
        <TabsList>
          <TabsTrigger value="promises" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Delivery Promises
          </TabsTrigger>
          <TabsTrigger value="exceptions" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Exception Workflow
          </TabsTrigger>
          <TabsTrigger value="micro-fulfillment" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Micro-Fulfillment
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="promises" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Promise Engine</CardTitle>
              <p className="text-sm text-muted-foreground">
                Show trustworthy delivery windows on PDP/checkout, boosting conversion
              </p>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4">
                <DeliveryPromise productId="sample-product-id" />
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  The Delivery Promise Engine combines courier SLAs, historical routes, and order 
                  metadata to provide accurate delivery estimates. This increases buyer confidence 
                  and reduces support inquiries.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="exceptions" className="space-y-6 mt-6">
          <ExceptionWorkflowDashboard sellerId={sellerId} />
          <Card>
            <CardHeader>
              <CardTitle>Exception Workflow Automation</CardTitle>
              <p className="text-sm text-muted-foreground">
                Automatically trigger notifications and resolution flows for shipping issues
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  When shipments encounter issues like carrier delays or damage reports, the system 
                  automatically:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Identifies exceptions based on SLAs and tracking data</li>
                  <li>Notifies relevant parties (buyers, sellers, admins)</li>
                  <li>Creates resolution workflows with clear deadlines</li>
                  <li>Tracks exception status until resolution</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="micro-fulfillment" className="space-y-6 mt-6">
          <MicroFulfillmentDashboard sellerId={sellerId} />
          <Card>
            <CardHeader>
              <CardTitle>Micro-Fulfillment Partnerships</CardTitle>
              <p className="text-sm text-muted-foreground">
                Plug-and-play interface for third-party pick-pack providers
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  Our micro-fulfillment network offers:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Real-time performance metrics for all partners</li>
                  <li>Easy opt-in process with no long-term commitments</li>
                  <li>Cost savings through optimized fulfillment locations</li>
                  <li>Scalable solution for growing sellers</li>
                </ul>
                <p className="pt-2">
                  Enable faster shipping, reduce costs, and improve your seller experience with 
                  our network of local fulfillment partners.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}