'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  getSystemHealth, 
  getPlatformMetrics, 
  getRecentActivities, 
  getSystemAlerts, 
  getUserInsights 
} from "@/lib/api/admin-control-tower";
import { AdminControlTowerDashboard } from "@/components/AdminControlTowerDashboard";

export default async function AdminControlTowerPage({ 
  searchParams 
}: { 
  searchParams: { adminId: string } 
}) {
  const adminId = searchParams.adminId;
  
  if (!adminId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Admin ID is required to view this page.</p>
        </div>
      </div>
    );
  }

  // Fetch all dashboard data
  const [
    healthResponse,
    metricsResponse,
    activitiesResponse,
    alertsResponse,
    insightsResponse
  ] = await Promise.all([
    getSystemHealth(adminId),
    getPlatformMetrics(adminId),
    getRecentActivities(adminId),
    getSystemAlerts(adminId),
    getUserInsights(adminId)
  ]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Control Tower</h1>
        <p className="text-muted-foreground">
          Monitor and manage marketplace health and performance
        </p>
      </div>

      <AdminControlTowerDashboard 
        health={healthResponse}
        metrics={metricsResponse}
        activities={activitiesResponse}
        alerts={alertsResponse}
        insights={insightsResponse}
      />
    </div>
  );
}