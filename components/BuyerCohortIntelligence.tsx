"use client";

import { useState, useEffect, useCallback } from 'react';
import { getBuyerCohorts, getBuyerSegments, generateDiscountCampaign } from '@/lib/api/analytics';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import type { PieLabelRenderProps } from 'recharts';

interface CohortData {
  period: string;
  buyerCount: number;
  totalRevenue: number;
  repeatBuyers: number;
  orders: any[];
}

interface SegmentData {
  name: string;
  buyers: any[];
  criteria: string;
}

export function BuyerCohortIntelligence({ sellerId }: { sellerId: string }) {
  const [cohorts, setCohorts] = useState<CohortData[]>([]);
  const [segments, setSegments] = useState<SegmentData[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<string>('');
  const [discountPercentage, setDiscountPercentage] = useState<number>(10);
  const [durationDays, setDurationDays] = useState<number>(7);
  const [maxUses, setMaxUses] = useState<number>(100);
  const [loading, setLoading] = useState<boolean>(true);
  const [creatingCampaign, setCreatingCampaign] = useState<boolean>(false);

  const loadCohortData = useCallback(async () => {
    try {
      const data = await getBuyerCohorts(sellerId);
      setCohorts(data);
    } catch (error) {
      console.error('Failed to load cohort data:', error);
    }
  }, [sellerId]);

  const loadSegmentData = useCallback(async () => {
    try {
      const data = await getBuyerSegments(sellerId);
      setSegments(data);
      if (data.length > 0) {
        setSelectedSegment(data[0].name);
      }
    } catch (error) {
      console.error('Failed to load segment data:', error);
    } finally {
      setLoading(false);
    }
  }, [sellerId]);

  useEffect(() => {
    loadCohortData();
    loadSegmentData();
  }, [loadCohortData, loadSegmentData]);

  const createDiscountCampaign = async () => {
    if (!selectedSegment) return;
    
    setCreatingCampaign(true);
    try {
      // Find the segment ID (in a real implementation, this would be an actual ID)
      const segment = segments.find(s => s.name === selectedSegment);
      if (!segment) return;
      
      const result = await generateDiscountCampaign(sellerId, selectedSegment, {
        discountPercentage,
        durationDays,
        maxUses,
      });
      
      alert(`Discount campaign created successfully! Campaign ID: ${result.id}`);
    } catch (error) {
      console.error('Failed to create discount campaign:', error);
      alert('Failed to create discount campaign');
    } finally {
      setCreatingCampaign(false);
    }
  };

  if (loading) {
    return <div>Loading buyer intelligence data...</div>;
  }

  // Data for charts
  const cohortChartData = cohorts.map(cohort => ({
    period: cohort.period,
    buyers: cohort.buyerCount,
    revenue: cohort.totalRevenue,
    retention: cohort.buyerCount > 0 ? (cohort.repeatBuyers / cohort.buyerCount) * 100 : 0,
  }));

  const segmentChartData = segments.map(segment => ({
    name: segment.name,
    buyers: segment.buyers.length,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Buyer Cohort Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cohortChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="buyers" stroke="#8884d8" name="New Buyers" />
                <Line yAxisId="right" type="monotone" dataKey="retention" stroke="#82ca9d" name="Retention %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Buyer Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={segmentChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="buyers"
                  label={renderPieLabel}
                >
                  {segmentChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Buyers']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Segment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Segment</TableHead>
                <TableHead>Buyers</TableHead>
                <TableHead>Criteria</TableHead>
                <TableHead>Avg. Order Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {segments.map((segment, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{segment.name}</TableCell>
                  <TableCell>{segment.buyers.length}</TableCell>
                  <TableCell>{segment.criteria}</TableCell>
                  <TableCell>
                    {segment.buyers.length > 0 
                      ? `$${(segment.buyers.reduce((sum, buyer) => sum + buyer.totalSpent, 0) / segment.buyers.length).toFixed(2)}`
                      : '$0.00'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Targeted Discount Campaign</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Target Segment</Label>
              <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select segment" />
                </SelectTrigger>
                <SelectContent>
                  {segments.map((segment, index) => (
                    <SelectItem key={index} value={segment.name}>
                      {segment.name} ({segment.buyers.length} buyers)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Discount Percentage</Label>
              <Input
                type="number"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                min="0"
                max="100"
              />
            </div>
            
            <div>
              <Label>Campaign Duration (Days)</Label>
              <Input
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                min="1"
                max="365"
              />
            </div>
            
            <div>
              <Label>Maximum Uses</Label>
              <Input
                type="number"
                value={maxUses}
                onChange={(e) => setMaxUses(Number(e.target.value))}
                min="1"
              />
            </div>
          </div>
          
          <Button onClick={createDiscountCampaign} disabled={creatingCampaign || !selectedSegment}>
            {creatingCampaign ? 'Creating Campaign...' : 'Launch Discount Campaign'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
