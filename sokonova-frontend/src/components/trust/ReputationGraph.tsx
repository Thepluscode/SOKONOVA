"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, AreaChart, Area } from "recharts";

interface ReputationGraphProps {
  reputationData: any;
}

export function ReputationGraph({ reputationData }: ReputationGraphProps) {
  // Prepare data for the combined chart
  const chartData = reputationData.history.map((item: any) => {
    const disputeItem = reputationData.disputeHistory.find((d: any) => d.month === item.month) || { disputeCount: 0, resolvedCount: 0 };
    const fulfillmentItem = reputationData.fulfillmentHistory.find((f: any) => f.month === item.month) || { totalItems: 0, deliveredItems: 0, onTimeDeliveries: 0 };
    const refundItem = reputationData.refundHistory?.find((r: any) => r.month === item.month) || { refundCount: 0 };
    const returnItem = reputationData.returnHistory?.find((r: any) => r.month === item.month) || { returnCount: 0 };
    const counterfeitItem = reputationData.counterfeitHistory?.find((c: any) => c.month === item.month) || { reportCount: 0 };
    const responseItem = reputationData.responseHistory?.find((r: any) => r.month === item.month) || { avgResponseTimeHours: 0 };
    
    return {
      month: item.month,
      avgRating: item.avgRating,
      reviewCount: item.reviewCount,
      disputeCount: disputeItem.disputeCount,
      resolvedCount: disputeItem.resolvedCount,
      totalItems: fulfillmentItem.totalItems,
      deliveredItems: fulfillmentItem.deliveredItems,
      onTimeDeliveries: fulfillmentItem.onTimeDeliveries,
      onTimeRate: fulfillmentItem.totalItems > 0 
        ? Math.round((fulfillmentItem.onTimeDeliveries / fulfillmentItem.totalItems) * 100) 
        : 0,
      refundCount: refundItem.refundCount || 0,
      returnCount: returnItem.returnCount || 0,
      counterfeitReports: counterfeitItem.reportCount || 0,
      avgResponseTimeHours: responseItem.avgResponseTimeHours || 0,
    };
  });

  return (
    <div className="space-y-6">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="left"
              domain={[0, 5]} 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="third" 
              orientation="right"
              domain={[0, 24]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'avgRating') return [`${value} stars`, 'Rating'];
                if (name === 'onTimeRate') return [`${value}%`, 'On-time Rate'];
                if (name === 'avgResponseTimeHours') return [`${value} hours`, 'Response Time'];
                return [value, name];
              }}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="avgRating" 
              name="Avg Rating"
              stroke="#8884d8" 
              activeDot={{ r: 8 }} 
              strokeWidth={2}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="onTimeRate" 
              name="On-time Rate"
              stroke="#82ca9d" 
              strokeWidth={2}
              strokeDasharray="3 3"
            />
            <Line 
              yAxisId="third"
              type="monotone" 
              dataKey="avgResponseTimeHours" 
              name="Response Time (hrs)"
              stroke="#ff7300" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-4">Dispute History</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="disputeCount" name="Disputes" fill="#ff6b6b" />
                <Bar dataKey="resolvedCount" name="Resolved" fill="#4ecdc4" />
                <Bar dataKey="refundCount" name="Refunds" fill="#ffa500" />
                <Bar dataKey="returnCount" name="Returns" fill="#9932cc" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-4">Fulfillment Performance</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalItems" name="Total Items" fill="#45b7d1" />
                <Bar dataKey="deliveredItems" name="Delivered" fill="#96ceb4" />
                <Bar dataKey="onTimeDeliveries" name="On-time" fill="#feca57" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-4">Product Quality Metrics</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="counterfeitReports" name="Counterfeit Reports" stroke="#ff0000" fill="#ff0000" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-4">Seller Responsiveness</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} hours`, 'Response Time']}
                />
                <Legend />
                <Line type="monotone" dataKey="avgResponseTimeHours" name="Avg Response Time" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {reputationData.enhancedMetrics && (
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-4">Enhanced Quality Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted p-3 rounded-lg">
              <div className="text-2xl font-bold">
                {reputationData.enhancedMetrics.qualityScore?.toFixed(1) || '0.0'}%
              </div>
              <div className="text-sm text-muted-foreground">
                Overall Quality Score
              </div>
              <div className="text-xs mt-1">
                Level: {reputationData.enhancedMetrics.qualityLevel || 'N/A'}
              </div>
            </div>
            
            <div className="bg-muted p-3 rounded-lg">
              <div className="text-2xl font-bold">
                {reputationData.enhancedMetrics.additionalMetrics?.refundRate?.toFixed(1) || '0.0'}%
              </div>
              <div className="text-sm text-muted-foreground">
                Refund Rate
              </div>
              <div className="text-xs mt-1">
                Total: {reputationData.enhancedMetrics.additionalMetrics?.totalRefunds || 0}
              </div>
            </div>
            
            <div className="bg-muted p-3 rounded-lg">
              <div className="text-2xl font-bold">
                {reputationData.enhancedMetrics.additionalMetrics?.counterfeitRate?.toFixed(1) || '0.0'}%
              </div>
              <div className="text-sm text-muted-foreground">
                Counterfeit Report Rate
              </div>
              <div className="text-xs mt-1">
                Total: {reputationData.enhancedMetrics.additionalMetrics?.totalCounterfeitReports || 0}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}