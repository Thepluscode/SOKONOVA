'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getAllSubscriptions, getSubscriptionStats } from '@/lib/api/subscriptions';

export default function AdminSubscriptionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = session?.user?.id;

  const fetchData = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const [subscriptionsData, statsData] = await Promise.all([
        getAllSubscriptions(userId),
        getSubscriptionStats(userId)
      ]);
      
      setSubscriptions(subscriptionsData);
      setStats(statsData);
    } catch (err) {
      setError('Failed to load subscription data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push('/auth/login?callbackUrl=/admin/subscriptions');
      return;
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      router.push('/'); // Redirect to home if not admin
      return;
    }

    fetchData();
  }, [session, status, router, fetchData]);

  if (status === 'loading') {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!session?.user) {
    return null;
  }

  if (session.user.role !== 'ADMIN') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Access denied. Admin access required.
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading subscription data...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
        <p className="text-muted-foreground">
          Manage subscription plans and view subscriber data
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-muted-foreground mb-1">Total Subscriptions</h3>
            <p className="text-3xl font-bold">{stats.totalSubscriptions}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-muted-foreground mb-1">Active Subscriptions</h3>
            <p className="text-3xl font-bold">{stats.activeSubscriptions}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-muted-foreground mb-1">Monthly Recurring Revenue</h3>
            <p className="text-3xl font-bold">${(stats.totalRevenue / 12).toFixed(2)}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-muted-foreground mb-1">Annual Revenue</h3>
            <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Subscriptions by Plan */}
      {stats && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Subscriptions by Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.subscriptionsByPlan.map((plan: any) => (
              <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-2">{plan.name}</h3>
                <p className="text-2xl font-bold">{plan._count.subscriptions}</p>
                <p className="text-muted-foreground text-sm">subscribers</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscriptions List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">All Subscriptions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No subscriptions found
                  </td>
                </tr>
              ) : (
                subscriptions.map((subscription) => (
                  <tr key={subscription.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {subscription.user?.name || subscription.user?.email}
                      </div>
                      <div className="text-xs text-gray-500">
                        {subscription.user?.sellerHandle ? `@${subscription.user.sellerHandle}` : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{subscription.plan?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${subscription.planPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        subscription.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        subscription.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {subscription.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(subscription.startDate).toLocaleDateString()} - 
                      {new Date(subscription.endDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
