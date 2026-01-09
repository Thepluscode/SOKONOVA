'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  getImpactMetrics, 
  getDiversityMetrics, 
  getCommunityImpact, 
  getSustainabilityMetrics 
} from "@/lib/api/impact-inclusion";
import { ImpactInclusionDashboard } from "@/components/ImpactInclusionDashboard";

export default async function ImpactInclusionPage({ 
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
    impactResponse,
    diversityResponse,
    communityResponse,
    sustainabilityResponse
  ] = await Promise.all([
    getImpactMetrics(adminId),
    getDiversityMetrics(adminId),
    getCommunityImpact(adminId),
    getSustainabilityMetrics(adminId)
  ]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Impact & Inclusion Dashboard</h1>
        <p className="text-muted-foreground">
          Track marketplace impact on diversity, sustainability, and community
        </p>
      </div>

      <ImpactInclusionDashboard 
        impact={impactResponse}
        diversity={diversityResponse}
        community={communityResponse}
        sustainability={sustainabilityResponse}
      />
    </div>
  );
}
