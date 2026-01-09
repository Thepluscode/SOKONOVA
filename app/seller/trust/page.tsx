"use client";

import { useEffect, useState } from "react";
import { getSellerQualityScore, getSellerDisputeShield, getSellerFullReputationGraph, getSellerComplianceStatus } from "@/lib/api/trust";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ShieldCheck, 
  Star, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Award,
  FileText,
  AlertCircle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ReputationGraph } from "@/components/ReputationGraph";
import { TaxRegistrationForm } from "@/components/TaxRegistrationForm";
import { KYCForm } from "@/components/KYCForm";

export default function SellerTrustDashboard({ userId }: { userId: string }) {
  const [qualityScore, setQualityScore] = useState<any>(null);
  const [disputeShield, setDisputeShield] = useState<any>(null);
  const [reputationGraph, setReputationGraph] = useState<any>(null);
  const [compliance, setCompliance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showKYCForm, setShowKYCForm] = useState(false);
  const [showTaxForm, setShowTaxForm] = useState(false);

  const handleComplianceUpdate = async () => {
    try {
      const complianceData = await getSellerComplianceStatus(userId);
      setCompliance(complianceData);
    } catch (error) {
      console.error("Error updating compliance data:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [qualityData, disputeData, reputationData, complianceData] = await Promise.all([
          getSellerQualityScore(userId),
          getSellerDisputeShield(userId),
          getSellerFullReputationGraph(userId),
          getSellerComplianceStatus(userId),
        ]);
        
        setQualityScore(qualityData);
        setDisputeShield(disputeData);
        setReputationGraph(reputationData);
        setCompliance(complianceData);
      } catch (error) {
        console.error("Error loading trust data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadData();
    }
  }, [userId]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading trust metrics...</div>;
  }

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold">Trust & Safety Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your reputation, dispute resolution, and compliance status
        </p>
      </div>

      {/* Quality Score Section */}
      <section className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Quality Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center justify-center">
                <div className="text-4xl font-bold">
                  {qualityScore?.qualityScore || 0}%
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Overall Quality Score
                </div>
                <Badge 
                  className="mt-2"
                  variant={
                    qualityScore?.qualityLevel === 'excellent' ? 'default' :
                    qualityScore?.qualityLevel === 'good' ? 'secondary' :
                    qualityScore?.qualityLevel === 'fair' ? 'destructive' : 'outline'
                  }
                >
                  {qualityScore?.qualityLevel?.toUpperCase() || 'N/A'}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Customer Reviews</span>
                    <span>{qualityScore?.components?.reviewScore || 0}/5</span>
                  </div>
                  <Progress value={(qualityScore?.components?.reviewScore || 0) * 20} />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Dispute Rate</span>
                    <span>{qualityScore?.components?.disputeRate || 0}%</span>
                  </div>
                  <Progress 
                    value={100 - (qualityScore?.components?.disputeRate || 0)} 
                    className={qualityScore?.components?.disputeRate > 5 ? "bg-red-200" : ""}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>On-time Delivery</span>
                    <span>{qualityScore?.components?.onTimeDeliveryRate || 0}%</span>
                  </div>
                  <Progress value={qualityScore?.components?.onTimeDeliveryRate || 0} />
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Trust Badges</h3>
                <div className="space-y-2">
                  {qualityScore?.trustBadges?.map((badge: any) => (
                    <div key={badge.id} className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span>{badge.name}</span>
                    </div>
                  )) || <p className="text-muted-foreground text-sm">No badges yet</p>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Dispute Shield Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Dispute Shield
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold">
                    {disputeShield?.shieldLevel?.toUpperCase() || 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Protection Level
                  </div>
                </div>
                <Badge 
                  className="text-lg py-2 px-4"
                  variant={
                    disputeShield?.shieldLevel === 'platinum' ? 'default' :
                    disputeShield?.shieldLevel === 'gold' ? 'secondary' :
                    disputeShield?.shieldLevel === 'silver' ? 'outline' : 'destructive'
                  }
                >
                  {disputeShield?.shieldLevel === 'platinum' ? '💎 Platinum' :
                   disputeShield?.shieldLevel === 'gold' ? '🥇 Gold' :
                   disputeShield?.shieldLevel === 'silver' ? '🥈 Silver' : '🥉 Bronze'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-3 rounded-lg">
                  <div className="text-2xl font-bold">
                    {disputeShield?.totalDisputes || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Disputes
                  </div>
                </div>
                
                <div className="bg-muted p-3 rounded-lg">
                  <div className="text-2xl font-bold">
                    {disputeShield?.resolutionRate || 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Resolution Rate
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Dispute Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Buyer Compensated</span>
                    <span className="font-medium">{disputeShield?.breakdown?.buyerCompensated || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Redelivered</span>
                    <span className="font-medium">{disputeShield?.breakdown?.redelivered || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rejected</span>
                    <span className="font-medium">{disputeShield?.breakdown?.rejected || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Open</span>
                    <span className="font-medium">{disputeShield?.breakdown?.open || 0}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Protection Indicators</h3>
                <div className="space-y-2">
                  {disputeShield?.protectionIndicators?.map((indicator: any) => (
                    <div key={indicator.id} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{indicator.name}</span>
                    </div>
                  )) || <p className="text-muted-foreground text-sm">No protection indicators</p>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Compliance Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      compliance?.kyc?.status === 'verified' ? 'bg-green-500' : 
                      compliance?.kyc?.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-300'
                    }`}></div>
                    <div>
                      <div className="font-medium">KYC Verification</div>
                      <div className="text-sm text-muted-foreground">
                        {compliance?.kyc?.status === 'verified' ? 'Completed' : 
                         compliance?.kyc?.status === 'pending' ? 'Pending review' : 'Not started'}
                      </div>
                    </div>
                  </div>
                  <Badge variant={compliance?.kyc?.status === 'verified' ? 'default' : 'secondary'}>
                    {compliance?.kyc?.status?.toUpperCase() || 'N/A'}
                  </Badge>
                </div>
                
                {compliance?.kyc?.status !== 'verified' && (
                  <div className="pt-2">
                    <button
                      onClick={() => setShowKYCForm(!showKYCForm)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {showKYCForm ? 'Cancel' : 'Complete KYC Verification'}
                    </button>
                    
                    {showKYCForm && (
                      <div className="mt-4">
                        <KYCForm 
                          sellerId={userId} 
                          onKYCSuccess={handleComplianceUpdate} 
                        />
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      compliance?.tax?.status === 'active' ? 'bg-green-500' : 
                      compliance?.tax?.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-300'
                    }`}></div>
                    <div>
                      <div className="font-medium">Tax Registration</div>
                      <div className="text-sm text-muted-foreground">
                        {compliance?.tax?.status === 'active' ? 'Active' : 
                         compliance?.tax?.status === 'pending' ? 'Pending' : 'Not registered'}
                      </div>
                    </div>
                  </div>
                  <Badge variant={compliance?.tax?.status === 'active' ? 'default' : 'secondary'}>
                    {compliance?.tax?.status?.toUpperCase() || 'N/A'}
                  </Badge>
                </div>
                
                {compliance?.tax?.status !== 'active' && (
                  <div className="pt-2">
                    <button
                      onClick={() => setShowTaxForm(!showTaxForm)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {showTaxForm ? 'Cancel' : 'Register for Tax Compliance'}
                    </button>
                    
                    {showTaxForm && (
                      <div className="mt-4">
                        <TaxRegistrationForm 
                          sellerId={userId} 
                          onRegistrationSuccess={handleComplianceUpdate} 
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Overall Compliance</h3>
                <div className={`p-3 rounded-lg ${
                  compliance?.overallCompliance === 'compliant' ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  <div className="flex items-center gap-2">
                    {compliance?.overallCompliance === 'compliant' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                    )}
                    <span className="font-medium">
                      {compliance?.overallCompliance === 'compliant' ? 'Compliant' : 'Non-compliant'}
                    </span>
                  </div>
                  <p className="text-sm mt-1">
                    {compliance?.overallCompliance === 'compliant' 
                      ? 'All requirements met' 
                      : 'Action required to maintain seller status'}
                  </p>
                </div>
              </div>
              
              {compliance?.nextSteps?.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Next Steps</h3>
                  <div className="space-y-2">
                    {compliance?.nextSteps?.map((step: any) => (
                      <div key={step.id} className="flex items-start gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="font-medium">{step.title}</div>
                          <div className="text-muted-foreground">{step.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Reputation Graph */}
      <section className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Reputation History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reputationGraph ? (
              <ReputationGraph reputationData={reputationGraph} />
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Loading reputation data...
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-2xl font-bold">
                  {reputationGraph?.current?.avgRating?.toFixed(1) || '0.0'}
                </div>
                <div className="text-sm text-muted-foreground">
                  Current Average Rating
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-2xl font-bold">
                  {reputationGraph?.current?.totalReviews || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Reviews
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-2xl font-bold capitalize">
                  {reputationGraph?.trend || 'stable'}
                </div>
                <div className="text-sm text-muted-foreground">
                  Trend
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
