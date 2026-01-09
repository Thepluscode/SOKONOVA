"use client";

import { useState } from "react";
import { subscribeToPlan, cancelSubscription } from "@/lib/api/subscriptions";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckIcon, XIcon } from "lucide-react";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  maxProducts: number;
  maxOrders: number;
  prioritySupport: boolean;
  analyticsAccess: boolean;
  marketingTools: boolean;
  active: boolean;
}

interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planPrice: number;
  status: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  cancelledAt?: string;
  plan?: SubscriptionPlan;
}

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  currentSubscription: Subscription | null;
  userId?: string;
}

export function SubscriptionPlans({ plans, currentSubscription, userId }: SubscriptionPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async () => {
    if (!userId) {
      // Redirect to login
      window.location.href = "/auth/login?callbackUrl=/subscriptions";
      return;
    }
    
    if (!selectedPlan) {
      setError("Please select a plan.");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    setSuccess(false);
    
    try {
      await subscribeToPlan({
        userId,
        planId: selectedPlan.id,
        paymentMethod,
      });
      
      setSuccess(true);
      setTimeout(() => {
        setIsDialogOpen(false);
        setSuccess(false);
        // Refresh the page to show updated subscription status
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError("Failed to subscribe. Please try again.");
      console.error("Subscription error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!currentSubscription || !userId) return;
    
    if (!confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }
    
    try {
      await cancelSubscription(currentSubscription.id, userId);
      // Refresh the page to show updated subscription status
      window.location.reload();
    } catch (err) {
      setError("Failed to cancel subscription. Please try again.");
      console.error("Cancellation error:", err);
    }
  };

  // Sort plans by price (Basic, Pro, Enterprise)
  const sortedPlans = [...plans].sort((a, b) => a.price - b.price);

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-center">
          {error}
        </div>
      )}
      
      <div className="grid gap-8 md:grid-cols-3">
        {sortedPlans.map((plan) => {
          const isCurrentPlan = currentSubscription?.planId === plan.id;
          const isActive = currentSubscription?.status === 'ACTIVE';
          
          return (
            <Card 
              key={plan.id} 
              className={`relative ${isCurrentPlan && isActive ? "border-primary ring-2 ring-primary/20" : ""}`}
            >
              {isCurrentPlan && isActive && (
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  Current Plan
                </div>
              )}
              
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">
                    {plan.currency} {plan.price.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                {isCurrentPlan && isActive ? (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancel Subscription
                  </Button>
                ) : (
                  <Dialog open={isDialogOpen && selectedPlan?.id === plan.id} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (open) {
                      setSelectedPlan(plan);
                    } else {
                      setSelectedPlan(null);
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        {isCurrentPlan ? "Renew" : "Get Started"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Subscribe to {plan.name}</DialogTitle>
                      </DialogHeader>
                      
                      {success ? (
                        <div className="py-8 text-center">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckIcon className="h-8 w-8 text-green-600" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">Subscription Successful!</h3>
                          <p className="text-muted-foreground">
                            You are now subscribed to the {plan.name} plan.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="p-4 bg-muted rounded-lg">
                            <div className="font-medium">{plan.name} Plan</div>
                            <div className="text-2xl font-bold">
                              {plan.currency} {plan.price.toFixed(2)}/month
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="paymentMethod">Payment Method</Label>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="card">Credit/Debit Card</SelectItem>
                                <SelectItem value="paypal">PayPal</SelectItem>
                                <SelectItem value="bank">Bank Transfer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {error && (
                            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                              {error}
                            </div>
                          )}
                          
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsDialogOpen(false)}
                              disabled={isSubmitting}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSubscribe}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Processing..." : "Subscribe"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      {currentSubscription && currentSubscription.status === 'ACTIVE' && (
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Your subscription renews on {new Date(currentSubscription.endDate).toLocaleDateString()}.
            Cancel anytime before then to avoid being charged.
          </p>
        </div>
      )}
    </div>
  );
}