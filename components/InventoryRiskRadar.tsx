"use client";

import React, { useState, useEffect } from 'react';
import { 
  getInventoryRiskAnalysis, 
  getAgingInventory, 
  getStockoutPredictions, 
  generateInventoryRecommendations 
} from '@/lib/api/analytics';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell
} from 'recharts';
import type { PieLabelRenderProps } from 'recharts';

interface RiskMetric {
  productId: string;
  productName: string;
  currentInventory: number;
  daysOfSupply: number;
  avgRating: number;
  riskScore: number;
  riskLevel: 'high' | 'medium' | 'low';
  riskFactors: {
    aging: number;
    velocity: number;
    rating: number;
  };
}

interface AgingItem {
  productId: string;
  productName: string;
  currentInventory: number;
  ageInDays: number;
  status: 'very_old' | 'old' | 'maturing';
}

interface StockoutPrediction {
  productId: string;
  productName: string;
  currentInventory: number;
  dailySalesRate: number;
  daysUntilStockout: number;
  riskOfStockout: 'high' | 'medium' | 'low';
  recommendedRestock: number;
}

interface Recommendation {
  type: 'markdown' | 'restock' | 'bundle';
  productId: string;
  productName: string;
  action: string;
  reason: string;
  discountPercentage?: number;
  quantity?: number;
}

// Define proper types for the API responses
interface RiskAnalysisResponse {
  products: RiskMetric[];
  aggregate: {
    riskDistribution: {
      high: number;
      medium: number;
      low: number;
    };
    highRiskItems: number;
  };
}

interface AgingInventoryResponse extends Array<AgingItem> {}

interface StockoutPredictionsResponse extends Array<StockoutPrediction> {}

interface RecommendationResponse extends Array<Recommendation> {}

export function InventoryRiskRadar({ sellerId }: { sellerId: string }) {
  const [riskMetrics, setRiskMetrics] = useState<RiskAnalysisResponse | null>(null);
  const [agingInventory, setAgingInventory] = useState<AgingItem[]>([]);
  const [stockoutPredictions, setStockoutPredictions] = useState<StockoutPrediction[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [generatingRecommendations, setGeneratingRecommendations] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, [sellerId]);

  const loadData = async () => {
    try {
      const [riskData, agingData, stockoutData] = await Promise.all([
        getInventoryRiskAnalysis(sellerId),
        getAgingInventory(sellerId),
        getStockoutPredictions(sellerId),
      ]);
      
      setRiskMetrics(riskData);
      setAgingInventory(agingData);
      setStockoutPredictions(stockoutData);
    } catch (error) {
      console.error('Failed to load inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    setGeneratingRecommendations(true);
    try {
      const recs: RecommendationResponse = await generateInventoryRecommendations(sellerId);
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    } finally {
      setGeneratingRecommendations(false);
    }
  };

  if (loading) {
    return <div>Loading inventory risk data...</div>;
  }

  if (!riskMetrics) {
    return <div>Failed to load inventory risk data</div>;
  }

  // Data for charts
  const riskDistributionData = [
    { name: 'High Risk', value: riskMetrics.aggregate.riskDistribution.high },
    { name: 'Medium Risk', value: riskMetrics.aggregate.riskDistribution.medium },
    { name: 'Low Risk', value: riskMetrics.aggregate.riskDistribution.low },
  ];

  const riskRadarData = riskMetrics.products.slice(0, 5).map(item => ({
    subject: item.productName.length > 15 ? item.productName.substring(0, 15) + '...' : item.productName,
    risk: item.riskScore,
    fullMark: 100,
  }));

  const COLORS = ['#FF4136', '#FF851B', '#2ECC40'];

  // Fix the label function type
  const renderPieLabel = (props: PieLabelRenderProps) => {
    // Safely extract name and percent from props
    const name = (props as any).name || '';
    const percent = (props as any).percent;
    
    // Check if percent is a valid number
    if (typeof percent === 'number' && !isNaN(percent)) {
      return `${name}: ${(percent * 100).toFixed(0)}%`;
    }
    return name;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Risk Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{riskMetrics.aggregate.highRiskItems}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Potential Stockouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockoutPredictions.filter(p => p.riskOfStockout === 'high').length}</div>
            <p className="text-xs text-muted-foreground">Need restocking soon</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aging Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agingInventory.filter(i => i.status === 'old' || i.status === 'very_old').length}</div>
            <p className="text-xs text-muted-foreground">Over 90 days old</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderPieLabel}
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Riskiest Items</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riskRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Risk Score"
                  dataKey="risk"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Risk Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead>Days of Supply</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riskMetrics.products.map((item, index) => (
                <TableRow key={item.productId}>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell>{item.currentInventory}</TableCell>
                  <TableCell>{item.daysOfSupply.toFixed(1)}</TableCell>
                  <TableCell>{item.avgRating.toFixed(1)}</TableCell>
                  <TableCell>{item.riskScore}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={item.riskLevel === 'high' ? 'destructive' : item.riskLevel === 'medium' ? 'default' : 'secondary'}
                    >
                      {item.riskLevel}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aging Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Inventory</TableHead>
                  <TableHead>Age (Days)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agingInventory.map((item, index) => (
                  <TableRow key={item.productId}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell>{item.currentInventory}</TableCell>
                    <TableCell>{item.ageInDays}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.status === 'very_old' ? 'destructive' : item.status === 'old' ? 'default' : 'secondary'}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Stockout Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Inventory</TableHead>
                  <TableHead>Daily Sales</TableHead>
                  <TableHead>Days Until Stockout</TableHead>
                  <TableHead>Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockoutPredictions.map((prediction, index) => (
                  <TableRow key={prediction.productId}>
                    <TableCell className="font-medium">{prediction.productName}</TableCell>
                    <TableCell>{prediction.currentInventory}</TableCell>
                    <TableCell>{prediction.dailySalesRate.toFixed(1)}</TableCell>
                    <TableCell>{prediction.daysUntilStockout}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={prediction.riskOfStockout === 'high' ? 'destructive' : prediction.riskOfStockout === 'medium' ? 'default' : 'secondary'}
                      >
                        {prediction.riskOfStockout}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Inventory Recommendations</CardTitle>
              <p className="text-sm text-muted-foreground">AI-generated suggestions to optimize your inventory</p>
            </div>
            <Button onClick={generateRecommendations} disabled={generatingRecommendations}>
              {generatingRecommendations ? 'Generating...' : 'Generate Recommendations'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <Alert key={index} variant={rec.type === 'markdown' ? 'default' : rec.type === 'restock' ? 'destructive' : 'default'}>
                  <AlertTitle className="flex items-center gap-2">
                    {rec.type === 'markdown' ? '💰' : rec.type === 'restock' ? '📦' : '🔗'}
                    {rec.action}
                  </AlertTitle>
                  <AlertDescription>
                    <p className="font-medium">{rec.productName}</p>
                    <p className="text-sm">{rec.reason}</p>
                    {rec.discountPercentage && (
                      <p className="text-sm mt-1">Suggested discount: {rec.discountPercentage}%</p>
                    )}
                    {rec.quantity && (
                      <p className="text-sm mt-1">Recommended quantity: {rec.quantity}</p>
                    )}
                    <Button variant="outline" size="sm" className="mt-2">
                      Implement Recommendation
                    </Button>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              {'Click "Generate Recommendations" to get AI-powered suggestions for your inventory.'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
