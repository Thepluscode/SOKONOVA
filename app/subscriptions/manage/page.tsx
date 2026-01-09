'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getMySubscription, cancelSubscription } from '@/lib/api/subscriptions';
import { getSubscriptionPlans, subscribeToPlan } from '@/lib/api/subscriptions';

export default function ManageSubscriptionPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [subscription, setSubscription] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = session?.user?.id;

  useEffect(() => {
    if (!session?.user) {
      router.push('/auth/login?callbackUrl=/subscriptions/manage');
      return;
    }

    fetchData();
  }, [session]);

  const fetchData = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const [subscriptionData, plansData] = await Promise.all([
        getMySubscription(userId),
        getSubscriptionPlans()
      ]);
      
      setSubscription(subscriptionData);
      setPlans(plansData);
    } catch (err) {
      setError('Failed to load subscription data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!subscription || !userId) return;
    
    if (!confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
      return;
    }
    
    try {
      await cancelSubscription(subscription.id, userId);
      alert('Subscription cancelled successfully.');
      router.push('/subscriptions');
    } catch (err) {
      setError('Failed to cancel subscription');
      console.error(err);
    }
  };

  const handleUpgrade = async (newPlanId: string) => {
    if (!subscription || !userId) return;
    
    try {
      // First cancel the current subscription
      await cancelSubscription(subscription.id, userId);
      
      // Then subscribe to the new plan
      await subscribeToPlan({
        userId,
        planId: newPlanId,
        paymentMethod: subscription.paymentMethod
      });
      
      alert('Subscription upgraded successfully!');
      fetchData(); // Refresh subscription data
    } catch (err) {
      setError('Failed to upgrade subscription');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading subscription data...</div>;
  }

  if (!subscription || subscription.status !== 'ACTIVE') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {"You don't have an active subscription. "}
          <a href="/subscriptions" className="underline">Subscribe now</a>
        </div>
      </div>
    );
  }

  const currentPlan = subscription.plan;
  const availablePlans = plans.filter(plan => plan.id !== currentPlan.id && plan.price >= currentPlan.price);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Subscription</h1>
        <p className="text-muted-foreground">
          View and manage your subscription details
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subscription Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Subscription Details</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <h3 className="font-medium">Current Plan</h3>
                <p className="text-muted-foreground">{currentPlan.name}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${currentPlan.price.toFixed(2)}/year</p>
                <p className="text-sm text-muted-foreground">
                  Renews {new Date(subscription.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <h3 className="font-medium">Status</h3>
                <p className="text-muted-foreground">Active</p>
              </div>
              <div>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Active
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <h3 className="font-medium">Payment Method</h3>
                <p className="text-muted-foreground capitalize">{subscription.paymentMethod}</p>
              </div>
              <div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Auto-renewal: {subscription.autoRenew ? 'On' : 'Off'}
                </span>
              </div>
            </div>
            
            <div className="pt-4">
              <button
                onClick={handleCancel}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>

        {/* Plan Features */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Plan Features</h2>
          
          <ul className="space-y-3">
            {currentPlan.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Upgrade Options */}
      {availablePlans.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Upgrade Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availablePlans.map((plan) => (
              <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium">{plan.name}</h3>
                  <span className="text-lg font-bold">${plan.price.toFixed(2)}/year</span>
                </div>
                
                <ul className="mb-4 space-y-2">
                  {plan.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                >
                  Upgrade to {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
