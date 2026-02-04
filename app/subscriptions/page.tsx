import { getSubscriptionPlans, getMySubscription } from "@/lib/api/subscriptions";
import { SubscriptionPlans } from "@/components/SubscriptionPlans";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function SubscriptionsPage() {
  // Get user session
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  // Fetch subscription plans
  const plansResponse = await getSubscriptionPlans();
  const plans = plansResponse || [];

  // Fetch user's current subscription if logged in
  let currentSubscription = null;
  if (userId) {
    try {
      currentSubscription = await getMySubscription(userId);
    } catch (error) {
      // User doesn't have a subscription
      currentSubscription = null;
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-12">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Premium Membership
        </h1>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
          Unlock exclusive features and benefits with our premium membership tiers
        </p>
      </header>

      <SubscriptionPlans 
        plans={plans} 
        currentSubscription={currentSubscription}
        userId={userId}
      />
    </div>
  );
}
