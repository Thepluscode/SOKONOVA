"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Globe, 
  Leaf, 
  Heart, 
  TrendingUp, 
  MapPin, 
  Calendar, 
  DollarSign 
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { PieLabelRenderProps } from 'recharts';

interface ImpactInclusionDashboardProps {
  impact: any;
  diversity: any;
  community: any;
  sustainability: any;
}

export function ImpactInclusionDashboard({ 
  impact, 
  diversity, 
  community, 
  sustainability 
}: ImpactInclusionDashboardProps) {
  // Format data for charts
  const sellerDiversityData = impact.sellerDiversity?.map((item: any) => ({
    name: item.country,
    value: item._count,
  })) || [];

  const genderDiversityData = diversity.genderDiversity?.map((item: any) => ({
    name: item.gender || 'Unknown',
    value: item._count,
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
      {/* Economic Impact */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Economic Impact</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Women-Owned Businesses</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{impact.womenOwnedBusinesses?.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Supporting female entrepreneurs
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Local Sourcing</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{impact.localSourcingPercentage || 0}%</div>
              <p className="text-xs text-muted-foreground">
                Products sourced locally
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carbon Reduction</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{impact.carbonFootprintReduction?.toLocaleString() || 0} tons</div>
              <p className="text-xs text-muted-foreground">
                CO2 reduced through platform initiatives
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Community Stories</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{community.storyCount?.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                User-generated content
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Diversity Metrics */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Diversity Metrics</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Seller Diversity by Region
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sellerDiversityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Gender Diversity</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderDiversityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={renderPieLabel}
                  >
                    {genderDiversityData.map((entry: any, index: number) => (
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

      {/* Community Impact */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Community Impact</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Community Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Community Stories</span>
                    <span>{community.storyCount?.toLocaleString()}</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>User-Generated Content</span>
                    <span>{community.userGeneratedContent?.toLocaleString()}</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Social Initiatives</span>
                    <span>{community.initiativesCount?.toLocaleString()}</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Community Stories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {community.storyEngagement?.slice(0, 3).map((story: any) => (
                  <div key={story.id} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <div className="relative w-10 h-10 rounded-full bg-background flex-shrink-0">
                      <div className="w-full h-full flex items-center justify-center text-xs font-medium">
                        {story.user?.shopName?.[0] || story.user?.name?.[0] || "U"}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{story.user?.shopName || story.user?.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {story.product?.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sustainability Metrics */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Sustainability Metrics</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eco-Friendly Products</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sustainability.ecoFriendlyProducts?.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Sustainable product listings
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Packaging Reduction</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sustainability.packagingReduction || 0}%</div>
              <p className="text-xs text-muted-foreground">
                Reduced packaging waste
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Renewable Energy</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sustainability.renewableEnergyUsage || 0}%</div>
              <p className="text-xs text-muted-foreground">
                Operations powered by renewable energy
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carbon Offset</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sustainability.carbonOffset?.toLocaleString() || 0} tons</div>
              <p className="text-xs text-muted-foreground">
                Carbon offset through initiatives
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

// Define proper type for the label function in PieChart
