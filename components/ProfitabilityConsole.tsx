"use client";

import { useState, useEffect } from 'react';
import { getSellerProfitability, simulatePricingScenario } from '@/lib/api/analytics';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

interface ProfitabilityData {
  totalRevenue: number;
  totalCost: number;
  totalFees: number;
  totalShipping: number;
  totalPromos: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  orderCount: number;
}

interface SimulationResult {
  current: ProfitabilityData;
  simulated: ProfitabilityData;
  difference: {
    totalRevenue: number;
    netProfit: number;
    profitMargin: number;
  };
}

// Add type for the recharts label function
interface PieLabelProps {
  name: string;
  percent?: number;
}

export function ProfitabilityConsole({ sellerId }: { sellerId: string }) {
  const [profitabilityData, setProfitabilityData] = useState<ProfitabilityData | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [feeChange, setFeeChange] = useState<number>(10);
  const [bundleDiscount, setBundleDiscount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [simulating, setSimulating] = useState<boolean>(false);

  useEffect(() => {
    loadProfitabilityData();
  }, [sellerId]);

  const loadProfitabilityData = async () => {
    try {
      const data = await getSellerProfitability(sellerId);
      setProfitabilityData(data);
    } catch (error) {
      console.error('Failed to load profitability data:', error);
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async () => {
    if (!profitabilityData) return;
    
    setSimulating(true);
    try {
      const result = await simulatePricingScenario(sellerId, {
        feeChange,
        bundleDiscount,
      });
      setSimulationResult(result);
    } catch (error) {
      console.error('Failed to run simulation:', error);
    } finally {
      setSimulating(false);
    }
  };

  if (loading) {
    return <div>Loading profitability data...</div>;
  }

  if (!profitabilityData) {
    return <div>Failed to load profitability data</div>;
  }

  // Data for charts
  const revenueData = [
    { name: 'Revenue', value: profitabilityData.totalRevenue },
    { name: 'Cost', value: profitabilityData.totalCost },
    { name: 'Fees', value: profitabilityData.totalFees },
    { name: 'Shipping', value: profitabilityData.totalShipping },
    { name: 'Promos', value: profitabilityData.totalPromos },
  ];

  const profitData = [
    { name: 'Gross Profit', value: profitabilityData.grossProfit },
    { name: 'Net Profit', value: profitabilityData.netProfit },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${profitabilityData.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${profitabilityData.netProfit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {profitabilityData.netProfit > 0 ? 'Positive' : 'Negative'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profitabilityData.profitMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {profitabilityData.profitMargin > 15 ? 'Healthy' : 'Needs attention'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profitabilityData.orderCount}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="simulation">What-If Simulation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={(props) => `${props.name}: ${(((props.percent as number) || 0) * 100).toFixed(0)}%`}
                    >
                      {revenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Profit Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={profitData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="simulation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What-If Scenario Planning</CardTitle>
              <p className="text-sm text-muted-foreground">
                Adjust parameters to see how changes would affect your profitability
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Marketplace Fee Percentage</Label>
                  <Slider
                    value={[feeChange]}
                    onValueChange={(value: number[]) => setFeeChange(value[0])}
                    max={20}
                    step={0.5}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>5%</span>
                    <span className="font-medium">{feeChange}%</span>
                    <span>20%</span>
                  </div>
                </div>
                
                <div>
                  <Label>Bundle Discount Percentage</Label>
                  <Slider
                    value={[bundleDiscount]}
                    onValueChange={(value: number[]) => setBundleDiscount(value[0])}
                    max={50}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>0%</span>
                    <span className="font-medium">{bundleDiscount}%</span>
                    <span>50%</span>
                  </div>
                </div>
              </div>
              
              <Button onClick={runSimulation} disabled={simulating}>
                {simulating ? 'Simulating...' : 'Run Simulation'}
              </Button>
              
              {simulationResult && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Simulation Results</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="font-medium">
                        ${simulationResult.simulated.totalRevenue.toFixed(2)}
                        <span className={`ml-2 ${simulationResult.difference.totalRevenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ({simulationResult.difference.totalRevenue >= 0 ? '+' : ''}{simulationResult.difference.totalRevenue.toFixed(2)})
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Net Profit</p>
                      <p className="font-medium">
                        ${simulationResult.simulated.netProfit.toFixed(2)}
                        <span className={`ml-2 ${simulationResult.difference.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ({simulationResult.difference.netProfit >= 0 ? '+' : ''}{simulationResult.difference.netProfit.toFixed(2)})
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Profit Margin</p>
                      <p className="font-medium">
                        {simulationResult.simulated.profitMargin.toFixed(1)}%
                        <span className={`ml-2 ${simulationResult.difference.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ({simulationResult.difference.profitMargin >= 0 ? '+' : ''}{simulationResult.difference.profitMargin.toFixed(1)}%)
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}