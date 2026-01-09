import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface SubscriptionBenefitsProps {
  subscription: any;
  usageStats: {
    productsUsed: number;
    productsLimit: number;
    ordersUsed: number;
    ordersLimit: number;
  };
}

export function SubscriptionBenefits({ subscription, usageStats }: SubscriptionBenefitsProps) {
  if (!subscription || subscription.status !== 'ACTIVE') {
    return null;
  }

  const { plan } = subscription;
  const { productsUsed, productsLimit, ordersUsed, ordersLimit } = usageStats;
  
  const productsPercentage = productsLimit > 0 ? (productsUsed / productsLimit) * 100 : 0;
  const ordersPercentage = ordersLimit > 0 ? (ordersUsed / ordersLimit) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {plan.name} Plan
              <Badge variant="secondary">Active</Badge>
            </CardTitle>
            <CardDescription>
              Valid until {new Date(subscription.endDate).toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {plan.currency} {plan.price.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">per month</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Products ({productsUsed}/{productsLimit})</span>
            <span>{productsPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={productsPercentage} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Orders ({ordersUsed}/{ordersLimit})</span>
            <span>{ordersPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={ordersPercentage} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Your Benefits</h4>
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Priority customer support
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Advanced analytics
              </li>
              {plan.marketingTools && (
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Marketing tools access
                </li>
              )}
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Plan Features</h4>
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                {productsLimit} product listings
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                {ordersLimit} monthly orders
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                {plan.analyticsAccess ? "Full" : "Basic"} analytics
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}