"use client";

import { useEffect, useState } from "react";
import { getAdminTrustDashboard } from "@/lib/api/trust";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldAlert, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AdminTrustDashboardPage({ adminId }: { adminId: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const result = await getAdminTrustDashboard(adminId);
        if (mounted) setData(result);
      } catch (error) {
        console.error("Failed to load trust dashboard:", error);
        if (mounted) setData(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (adminId) load();
    return () => {
      mounted = false;
    };
  }, [adminId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="text-sm text-muted-foreground">Loading trust dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="text-xl font-semibold mb-2">Unable to load dashboard</div>
        <div className="text-muted-foreground text-sm">
          Please try again later.
        </div>
      </div>
    );
  }

  // Prepare data for trust distribution chart
  const trustDistributionData = [
    { name: 'Excellent', value: data.trustDistribution.excellent, fill: '#10b981' },
    { name: 'Good', value: data.trustDistribution.good, fill: '#3b82f6' },
    { name: 'Fair', value: data.trustDistribution.fair, fill: '#f59e0b' },
    { name: 'Poor', value: data.trustDistribution.poor, fill: '#ef4444' },
  ];

  // Prepare data for dispute reasons chart
  const disputeReasonsData = Object.entries(data.recentDisputes.byReason).map(([reason, count]) => ({
    name: reason,
    value: count as number,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Trust & Safety Dashboard
        </h1>
        <p className="text-muted-foreground text-sm">
          Monitor marketplace trust metrics and safety indicators
        </p>
      </header>

      {/* KPI STRIP */}
      <section className="grid gap-4 md:grid-cols-4">
        <CardStat
          icon={<Users className="w-5 h-5" />}
          label="Total Sellers"
          primary={data.trustDistribution.total.toString()}
          secondary="Active sellers"
        />

        <CardStat
          icon={<ShieldAlert className="w-5 h-5" />}
          label="High Risk Sellers"
          primary={data.riskIndicators.highRiskSellers.toString()}
          secondary="Quality score < 3.0"
          variant="destructive"
        />

        <CardStat
          icon={<AlertTriangle className="w-5 h-5" />}
          label="Recent Disputes"
          primary={data.recentDisputes.total.toString()}
          secondary="Last 30 days"
          variant="warning"
        />

        <CardStat
          icon={<Clock className="w-5 h-5" />}
          label="Pending Reviews"
          primary={data.compliance.kycByStatus.PENDING?.toString() || "0"}
          secondary="KYC documents"
        />
      </section>

      {/* Trust Distribution */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Seller Trust Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trustDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                  >
                    {trustDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Sellers']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {data.trustDistribution.excellent}
                </div>
                <div className="text-sm text-muted-foreground">Excellent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {data.trustDistribution.good}
                </div>
                <div className="text-sm text-muted-foreground">Good</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">
                  {data.trustDistribution.fair}
                </div>
                <div className="text-sm text-muted-foreground">Fair</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {data.trustDistribution.poor}
                </div>
                <div className="text-sm text-muted-foreground">Poor</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Dispute Reasons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Recent Dispute Reasons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {disputeReasonsData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={disputeReasonsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No recent disputes
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Compliance Metrics */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Compliance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <h3 className="font-medium">Verified KYC</h3>
                </div>
                <div className="text-3xl font-bold">
                  {data.compliance.kycByStatus.VERIFIED || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Fully verified sellers
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <h3 className="font-medium">Pending KYC</h3>
                </div>
                <div className="text-3xl font-bold">
                  {data.compliance.kycByStatus.PENDING || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Awaiting review
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <h3 className="font-medium">Rejected KYC</h3>
                </div>
                <div className="text-3xl font-bold">
                  {data.compliance.kycByStatus.REJECTED || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Documents rejected
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Risk Indicators */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              Risk Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">High Risk Sellers</h3>
                <div className="text-3xl font-bold text-red-500">
                  {data.riskIndicators.highRiskSellers}
                </div>
                <div className="text-sm text-muted-foreground">
                  Sellers with quality score {'<'} 3.0
                </div>
                {data.riskIndicators.highRiskSellers > 0 && (
                  <div className="mt-2 text-sm text-red-500">
                    Immediate attention required
                  </div>
                )}
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Recent High Disputes</h3>
                <div className="text-3xl font-bold text-yellow-500">
                  {data.riskIndicators.recentHighDisputes}
                </div>
                <div className="text-sm text-muted-foreground">
                  Disputes resolved with buyer compensation
                </div>
                {data.riskIndicators.recentHighDisputes > 5 && (
                  <div className="mt-2 text-sm text-yellow-500">
                    Monitoring recommended
                  </div>
                )}
              </div>
            </div>
            
            {data.riskIndicators.alerts && (
              <div className="mt-4 p-4 bg-red-100 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="font-medium text-red-700">Attention Required</span>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  Risk indicators show elevated marketplace risk. Review high-risk sellers and recent disputes.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

// lightweight stat card
function CardStat({
  icon,
  label,
  primary,
  secondary,
  variant = "default",
}: {
  icon: React.ReactNode;
  label: string;
  primary: string;
  secondary: string;
  variant?: "default" | "destructive" | "warning";
}) {
  const getVariantClasses = () => {
    switch (variant) {
      case "destructive":
        return "text-red-500";
      case "warning":
        return "text-yellow-500";
      default:
        return "text-blue-500";
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={getVariantClasses()}>
          {icon}
        </div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
      <div className="text-2xl font-bold">{primary}</div>
      <div className="text-xs text-muted-foreground">{secondary}</div>
    </div>
  );
}
