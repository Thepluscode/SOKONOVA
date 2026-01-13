"use client";

import { useState, useEffect } from 'react';
import { 
  getMicroFulfillmentMetrics, 
  getFulfillmentPartners, 
  optInToMicroFulfillment 
} from '@/lib/api/fulfillment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { CheckCircle, Clock, Package, TrendingUp } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  description: string;
  locations: string[];
  pricing: {
    pickPack: number;
    storage: number;
  };
  capabilities: string[];
  rating: number;
}

interface MicroFulfillmentMetrics {
  optedIn: boolean;
  partners?: Array<{
    id: string;
    name: string;
    performance: {
      onTimeRate: number;
      avgProcessingTime: number;
      accuracyRate: number;
      costPerItem: number;
    };
    capacity: {
      available: number;
      total: number;
    };
  }>;
  sellerMetrics?: {
    fulfillmentRate: number;
    avgTurnaround: number;
    costSavings: number;
  };
}

export function MicroFulfillmentDashboard({ sellerId }: { sellerId: string }) {
  const [metrics, setMetrics] = useState<MicroFulfillmentMetrics | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [optingIn, setOptingIn] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMicroFulfillmentData();
  }, [sellerId]);

  const loadMicroFulfillmentData = async () => {
    try {
      setLoading(true);
      const [metricsData, partnersData] = await Promise.all([
        getMicroFulfillmentMetrics(sellerId),
        getFulfillmentPartners(sellerId)
      ]);
      
      setMetrics(metricsData);
      setPartners(partnersData);
      
      if (partnersData.length > 0) {
        setSelectedPartner(partnersData[0].id);
      }
    } catch (err) {
      setError('Could not load micro-fulfillment data.');
      console.error('Error loading micro-fulfillment data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptIn = async () => {
    if (!selectedPartner) return;
    
    try {
      setOptingIn(true);
      await optInToMicroFulfillment(sellerId, selectedPartner);
      // Refresh data after opt-in
      await loadMicroFulfillmentData();
    } catch (err) {
      setError('Could not opt in to micro-fulfillment service.');
      console.error('Error opting in:', err);
    } finally {
      setOptingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500">{error}</div>
        <Button onClick={loadMicroFulfillmentData} className="mt-4">Retry</Button>
      </div>
    );
  }

  if (!metrics) {
    return <div>No data available.</div>;
  }

  return (
    <div className="space-y-6">
      {!metrics.optedIn ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Micro-Fulfillment Partnerships
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-muted-foreground">
              <p>
                Opt into our micro-fulfillment network to improve your shipping speed and reduce costs.
                Our partners handle picking, packing, and shipping your products from strategically 
                located warehouses.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {partners.slice(0, 3).map((partner) => (
                <Card key={partner.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-base">{partner.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        {partner.description}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs">Rating:</span>
                        <Badge variant="secondary">{partner.rating}/5</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Locations: {partner.locations.join(', ')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Select a Partner</label>
                <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {partners.map((partner) => (
                      <SelectItem key={partner.id} value={partner.id}>
                        {partner.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleOptIn} 
                disabled={optingIn || !selectedPartner}
                className="whitespace-nowrap"
              >
                {optingIn ? "Opting In..." : "Opt In to Service"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Micro-Fulfillment Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Fulfillment Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {metrics.sellerMetrics?.fulfillmentRate ? 
                        `${(metrics.sellerMetrics.fulfillmentRate * 100).toFixed(0)}%` : 'N/A'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      On-time deliveries
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Avg. Turnaround
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {metrics.sellerMetrics?.avgTurnaround?.toFixed(1) || 'N/A'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Hours to process
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${metrics.sellerMetrics?.costSavings?.toFixed(2) || '0.00'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This month
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Partner Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partner</TableHead>
                    <TableHead>On-Time Rate</TableHead>
                    <TableHead>Avg. Processing</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Capacity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.partners?.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell className="font-medium">{partner.name}</TableCell>
                      <TableCell>{(partner.performance.onTimeRate * 100).toFixed(0)}%</TableCell>
                      <TableCell>{partner.performance.avgProcessingTime.toFixed(1)} hrs</TableCell>
                      <TableCell>{(partner.performance.accuracyRate * 100).toFixed(0)}%</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ 
                                width: `${(partner.capacity.available / partner.capacity.total) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-xs">
                            {partner.capacity.available}/{partner.capacity.total}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
