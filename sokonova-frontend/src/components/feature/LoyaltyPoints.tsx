
import { useState } from 'react';

interface Transaction {
  id: string;
  type: 'earned' | 'redeemed';
  points: number;
  description: string;
  date: string;
}

export default function LoyaltyPoints() {
  const [points] = useState(2450);
  const [tier] = useState('Gold');
  const [nextTierPoints] = useState(550);
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'earned',
      points: 250,
      description: 'Purchase - Order #12345',
      date: '2024-01-15',
    },
    {
      id: '2',
      type: 'earned',
      points: 100,
      description: 'Product Review',
      date: '2024-01-14',
    },
    {
      id: '3',
      type: 'redeemed',
      points: -500,
      description: 'Discount Applied - Order #12340',
      date: '2024-01-12',
    },
    {
      id: '4',
      type: 'earned',
      points: 50,
      description: 'Referral Bonus',
      date: '2024-01-10',
    },
    {
      id: '5',
      type: 'earned',
      points: 300,
      description: 'Purchase - Order #12335',
      date: '2024-01-08',
    },
  ]);

  const rewards = [
    { points: 500, discount: '$5 Off', description: 'Any purchase' },
    { points: 1000, discount: '$12 Off', description: 'Any purchase' },
    { points: 2000, discount: '$25 Off', description: 'Any purchase' },
    { points: 5000, discount: '$70 Off', description: 'Any purchase' },
  ];

  const tierProgress = ((points / (points + nextTierPoints)) * 100).toFixed(0);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg p-8 text-white mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">{points.toLocaleString()} Points</h2>
            <p className="text-emerald-100">Your loyalty balance</p>
          </div>
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <i className="ri-trophy-line text-4xl"></i>
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">{tier} Member</span>
            <span className="text-sm">{nextTierPoints} points to Platinum</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${tierProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <i className="ri-shopping-bag-line text-emerald-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">$1 = 10</p>
              <p className="text-xs text-gray-600">Points per purchase</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <i className="ri-star-line text-emerald-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">100</p>
              <p className="text-xs text-gray-600">Points per review</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <i className="ri-user-add-line text-emerald-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">50</p>
              <p className="text-xs text-gray-600">Points per referral</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Redeem Rewards</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {rewards.map((reward, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:border-emerald-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-2xl font-bold text-emerald-600">{reward.discount}</p>
                  <p className="text-sm text-gray-600">{reward.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{reward.points}</p>
                  <p className="text-xs text-gray-600">points</p>
                </div>
              </div>
              <button
                disabled={points < reward.points}
                className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                {points >= reward.points ? 'Redeem' : 'Not Enough Points'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Points History</h3>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'earned'
                      ? 'bg-green-100'
                      : 'bg-red-100'
                  }`}
                >
                  <i
                    className={`${
                      transaction.type === 'earned'
                        ? 'ri-arrow-down-line text-green-600'
                        : 'ri-arrow-up-line text-red-600'
                    }`}
                  ></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p
                className={`font-bold ${
                  transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {transaction.points > 0 ? '+' : ''}
                {transaction.points}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
