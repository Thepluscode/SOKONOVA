"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  ShoppingCart, 
  Package, 
  Store, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp 
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { PieLabelRenderProps } from 'recharts';

interface AdminControlTowerDashboardProps {
  health: any;
  metrics: any;
  activities: any;
  alerts: any;
  insights: any;
}

export function AdminControlTowerDashboard({ 
  health, 
  metrics, 
  activities, 
  alerts, 
  insights 
}: AdminControlTowerDashboardProps) {
  const [timeRange, setTimeRange] = useState("7d");

  // Format data for charts
  const fulfillmentData = metrics.fulfillmentStats?.map((stat: any) => ({
    name: stat.fulfillmentStatus,
    value: stat._count,
  })) || [];

  const paymentData = metrics.paymentStats?.map((stat: any) => ({
    name: stat.status,
    value: stat._count,
  })) || [];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

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
    <div className="space-y-8">
      {/* Health Overview */}
      <section>
        <h2 className="text-2xl font-bold mb-4">System Health</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{health.userCount?.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{health.userGrowth} from yesterday
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{health.productCount?.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{health.orderCount?.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {health.recentOrdersCount} in last 24h
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sellers</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{health.sellerCount?.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {health.pendingApplications} pending applications
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Marketplace Health Status
              <Badge 
                variant={
                  health.healthStatus === 'HEALTHY' ? 'default' : 
                  health.healthStatus === 'WARNING' ? 'destructive' : 
                  'secondary'
                }
              >
                {health.healthStatus}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>System Stability</span>
                  <span>98%</span>
                </div>
                <Progress value={98} className="h-2" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>User Satisfaction</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Platform Metrics */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Platform Metrics</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Revenue Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${metrics.totalRevenue?.toFixed(2)}
              </div>
              <p className="text-muted-foreground">Total platform revenue</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Fulfillment Status</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fulfillmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={renderPieLabel}
                  >
                    {fulfillmentData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* System Alerts */}
      <section>
        <h2 className="text-2xl font-bold mb-4">System Alerts</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Pending Applications
              </CardTitle>
              <CardDescription>
                {alerts.pendingApplications?.length || 0} applications require review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {alerts.pendingApplications?.slice(0, 3).map((app: any) => (
                  <div key={app.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div>
                      <p className="font-medium">{app.user?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {app.user?.city}, {app.user?.country}
                      </p>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Open Disputes
              </CardTitle>
              <CardDescription>
                {alerts.openDisputes?.length || 0} disputes require attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {alerts.openDisputes?.slice(0, 3).map((dispute: any) => (
                  <div key={dispute.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div>
                      <p className="font-medium">{dispute.buyer?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {dispute.orderItem?.product?.title}
                      </p>
                    </div>
                    <Badge variant="destructive">Open</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* User Insights */}
      <section>
        <h2 className="text-2xl font-bold mb-4">User Insights</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insights.userByCountry}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="country" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="_count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Active Users (7d)</span>
                    <span>{insights.activeUsers?.toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={(insights.activeUsers / insights.totalUsers) * 100} 
                    className="h-2" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Users with Orders</span>
                    <span>{insights.usersWithOrders?.toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={(insights.usersWithOrders / insights.totalUsers) * 100} 
                    className="h-2" 
                  />
                </div>
                
                <div className="pt-4">
                  <h4 className="font-medium mb-2">User Roles</h4>
                  <div className="space-y-2">
                    {insights.userByRole?.map((role: any) => (
                      <div key={role.role} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{role.role.toLowerCase()}</span>
                        <span className="text-sm">{role._count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}