import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function Loyalty() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    pointsPerDollar: 1,
    bronzeMin: 0,
    silverMin: 1000,
    goldMin: 3000,
    platinumMin: 5000,
    bronzeMultiplier: 1,
    silverMultiplier: 1.5,
    goldMultiplier: 2,
    platinumMultiplier: 3,
  });

  const userPoints = {
    current: 2450,
    lifetime: 5680,
    tier: 'Gold',
    nextTier: 'Platinum',
    pointsToNextTier: 550,
  };

  const handleSaveSettings = () => {
    localStorage.setItem('loyaltySettings', JSON.stringify(settings));
    setShowSettings(false);
    alert('Loyalty program settings saved successfully!');
  };

  const rewards = [
    {
      id: '1',
      name: '$5 Off Coupon',
      points: 500,
      description: 'Get $5 off your next purchase',
      icon: 'ri-coupon-line',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: '2',
      name: '$10 Off Coupon',
      points: 1000,
      description: 'Get $10 off your next purchase',
      icon: 'ri-coupon-2-line',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: '3',
      name: 'Free Shipping',
      points: 750,
      description: 'Free shipping on your next order',
      icon: 'ri-truck-line',
      color: 'from-teal-500 to-emerald-600',
    },
    {
      id: '4',
      name: '$25 Off Coupon',
      points: 2500,
      description: 'Get $25 off your next purchase',
      icon: 'ri-gift-line',
      color: 'from-orange-500 to-red-600',
    },
  ];

  const transactions = [
    {
      id: '1',
      type: 'earned',
      points: 150,
      description: 'Purchase #12345',
      date: '2024-01-15',
    },
    {
      id: '2',
      type: 'redeemed',
      points: -500,
      description: '$5 Off Coupon',
      date: '2024-01-10',
    },
    {
      id: '3',
      type: 'earned',
      points: 200,
      description: 'Product Review',
      date: '2024-01-08',
    },
    {
      id: '4',
      type: 'earned',
      points: 100,
      description: 'Referral Bonus',
      date: '2024-01-05',
    },
  ];

  const tiers = [
    { name: 'Bronze', min: 0, color: 'from-amber-600 to-amber-700', benefits: ['1x points', 'Birthday reward'] },
    { name: 'Silver', min: 1000, color: 'from-gray-400 to-gray-500', benefits: ['1.5x points', 'Free shipping', 'Birthday reward'] },
    { name: 'Gold', min: 3000, color: 'from-yellow-500 to-yellow-600', benefits: ['2x points', 'Free shipping', 'Early access', 'Birthday reward'] },
    { name: 'Platinum', min: 5000, color: 'from-teal-500 to-emerald-600', benefits: ['3x points', 'Free shipping', 'Early access', 'VIP support', 'Birthday reward'] },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      {/* Hero Section with animation */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-16 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl font-bold">Loyalty Rewards</h1>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2"
                >
                  <i className="ri-settings-3-line"></i>
                  Configure
                </button>
              </div>
              <p className="text-teal-100 text-lg">
                Earn points with every purchase and unlock exclusive rewards!
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-teal-100 text-sm mb-1">Your Points</p>
                  <p className="text-5xl font-bold">{userPoints.current.toLocaleString()}</p>
                </div>
                <div className={`w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center animate-float`}>
                  <i className="ri-vip-crown-line text-3xl"></i>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-teal-100">Current Tier: {userPoints.tier}</span>
                <span className="text-white font-semibold">{userPoints.pointsToNextTier} to {userPoints.nextTier}</span>
              </div>
              <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-1000 animate-gradient"
                  style={{ width: `${(userPoints.current / (userPoints.current + userPoints.pointsToNextTier)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Loyalty Program Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Points Earning */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Points Earning Rate</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points per Dollar Spent
                  </label>
                  <input
                    type="number"
                    value={settings.pointsPerDollar}
                    onChange={(e) => setSettings({ ...settings, pointsPerDollar: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    min="0.1"
                    step="0.1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Customers earn {settings.pointsPerDollar} point(s) for every $1 spent
                  </p>
                </div>
              </div>

              {/* Tier Thresholds */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Tier Thresholds</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bronze Tier (Starting)
                    </label>
                    <input
                      type="number"
                      value={settings.bronzeMin}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                    />
                    <div className="mt-2">
                      <label className="block text-xs text-gray-600 mb-1">Points Multiplier</label>
                      <input
                        type="number"
                        value={settings.bronzeMultiplier}
                        onChange={(e) => setSettings({ ...settings, bronzeMultiplier: Number(e.target.value) })}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                        min="1"
                        step="0.5"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Silver Tier
                    </label>
                    <input
                      type="number"
                      value={settings.silverMin}
                      onChange={(e) => setSettings({ ...settings, silverMin: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                      min="100"
                    />
                    <div className="mt-2">
                      <label className="block text-xs text-gray-600 mb-1">Points Multiplier</label>
                      <input
                        type="number"
                        value={settings.silverMultiplier}
                        onChange={(e) => setSettings({ ...settings, silverMultiplier: Number(e.target.value) })}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                        min="1"
                        step="0.5"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gold Tier
                    </label>
                    <input
                      type="number"
                      value={settings.goldMin}
                      onChange={(e) => setSettings({ ...settings, goldMin: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                      min="1000"
                    />
                    <div className="mt-2">
                      <label className="block text-xs text-gray-600 mb-1">Points Multiplier</label>
                      <input
                        type="number"
                        value={settings.goldMultiplier}
                        onChange={(e) => setSettings({ ...settings, goldMultiplier: Number(e.target.value) })}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                        min="1"
                        step="0.5"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-teal-100 to-emerald-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platinum Tier
                    </label>
                    <input
                      type="number"
                      value={settings.platinumMin}
                      onChange={(e) => setSettings({ ...settings, platinumMin: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                      min="3000"
                    />
                    <div className="mt-2">
                      <label className="block text-xs text-gray-600 mb-1">Points Multiplier</label>
                      <input
                        type="number"
                        value={settings.platinumMultiplier}
                        onChange={(e) => setSettings({ ...settings, platinumMultiplier: Number(e.target.value) })}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                        min="1"
                        step="0.5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <i className="ri-information-line text-teal-600 text-xl"></i>
                  <div className="text-sm text-teal-800">
                    <p className="font-semibold mb-1">How it works:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Set minimum points required for each tier</li>
                      <li>Points multipliers increase earning rates for higher tiers</li>
                      <li>Example: Gold tier with 2x multiplier earns 2 points per $1</li>
                      <li>Changes apply to new transactions immediately</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-teal-700 hover:to-emerald-700 transition-all whitespace-nowrap cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200 animate-fade-in-up">
          {[
            { id: 'overview', label: 'Overview', icon: 'ri-dashboard-line' },
            { id: 'rewards', label: 'Rewards', icon: 'ri-gift-line' },
            { id: 'history', label: 'History', icon: 'ri-history-line' },
            { id: 'tiers', label: 'Tiers', icon: 'ri-vip-crown-line' },
          ].map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-6 font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'border-b-2 border-teal-600 text-teal-600'
                  : 'text-gray-600 hover:text-teal-600'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <i className={`${tab.icon} mr-2`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Current Points', value: userPoints.current.toLocaleString(), icon: 'ri-coin-line', color: 'from-teal-500 to-emerald-600', delay: '100ms' },
                { label: 'Lifetime Points', value: userPoints.lifetime.toLocaleString(), icon: 'ri-trophy-line', color: 'from-purple-500 to-purple-600', delay: '200ms' },
                { label: 'Current Tier', value: userPoints.tier, icon: 'ri-vip-crown-line', color: 'from-yellow-500 to-yellow-600', delay: '300ms' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl shadow-lg p-6 hover-lift transition-all duration-500 animate-fade-in-up"
                  style={{ animationDelay: stat.delay }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center`}>
                      <i className={`${stat.icon} text-2xl text-white`}></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ways to Earn */}
            <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ways to Earn Points</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { action: 'Make a Purchase', points: '1 point per $1', icon: 'ri-shopping-bag-line', color: 'text-teal-600', delay: '500ms' },
                  { action: 'Write a Review', points: '50 points', icon: 'ri-star-line', color: 'text-yellow-600', delay: '550ms' },
                  { action: 'Refer a Friend', points: '100 points', icon: 'ri-user-add-line', color: 'text-purple-600', delay: '600ms' },
                  { action: 'Birthday Bonus', points: '200 points', icon: 'ri-cake-line', color: 'text-pink-600', delay: '650ms' },
                ].map((way) => (
                  <div
                    key={way.action}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 animate-fade-in-up"
                    style={{ animationDelay: way.delay }}
                  >
                    <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center ${way.color}`}>
                      <i className={`${way.icon} text-2xl`}></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{way.action}</p>
                      <p className="text-sm text-gray-600">{way.points}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewards.map((reward, index) => (
              <div
                key={reward.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover-lift transition-all duration-500 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`bg-gradient-to-br ${reward.color} p-6 text-white`}>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 animate-float">
                    <i className={`${reward.icon} text-3xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{reward.name}</h3>
                  <p className="text-sm opacity-90">{reward.description}</p>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gray-900">{reward.points}</span>
                    <span className="text-sm text-gray-600">points</span>
                  </div>
                  <button
                    disabled={userPoints.current < reward.points}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ripple-effect whitespace-nowrap ${
                      userPoints.current >= reward.points
                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-700 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {userPoints.current >= reward.points ? 'Redeem' : 'Not Enough Points'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Points History</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {transactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="p-6 hover:bg-gray-50 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          transaction.type === 'earned'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        <i
                          className={`${
                            transaction.type === 'earned' ? 'ri-add-line' : 'ri-subtract-line'
                          } text-xl`}
                        ></i>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-600">{transaction.date}</p>
                      </div>
                    </div>
                    <span
                      className={`text-xl font-bold ${
                        transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.points > 0 ? '+' : ''}{transaction.points}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tiers Tab */}
        {activeTab === 'tiers' && (
          <div className="space-y-6">
            {tiers.map((tier, index) => (
              <div
                key={tier.name}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover-lift transition-all duration-500 animate-slide-in-left ${
                  tier.name === userPoints.tier ? 'ring-4 ring-teal-500' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`bg-gradient-to-r ${tier.color} p-6 text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{tier.name} Tier</h3>
                      <p className="text-sm opacity-90">
                        {tier.min === 0 ? 'Starting tier' : `${tier.min.toLocaleString()}+ points`}
                      </p>
                    </div>
                    {tier.name === userPoints.tier && (
                      <div className="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold animate-pulse-ring">
                        Current Tier
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Benefits:</h4>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, i) => (
                      <li
                        key={i}
                        className="flex items-center text-gray-700 animate-fade-in-up"
                        style={{ animationDelay: `${(index * 100) + (i * 50)}ms` }}
                      >
                        <i className="ri-checkbox-circle-fill text-teal-600 mr-2"></i>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
