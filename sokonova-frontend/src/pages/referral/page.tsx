import { useState } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

interface Referral {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'completed';
  reward: number;
  date: string;
}

export default function Referral() {
  const [copied, setCopied] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [rewardAmount, setRewardAmount] = useState(25);
  const [referralBonus, setReferralBonus] = useState(15);
  const referralCode = 'SOKONOVA2024';
  const referralLink = `https://sokonova.com/ref/${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('referralSettings', JSON.stringify({
      isActive,
      rewardAmount,
      referralBonus,
    }));
    alert('Referral program settings saved successfully!');
  };

  const shareOnSocial = (platform: string) => {
    const text = `Join me on SOKONOVA and get ${referralBonus}% off your first order! ${referralLink}`;
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      email: `mailto:?subject=Join SOKONOVA&body=${encodeURIComponent(text)}`,
    };
    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 md:p-12 text-white mb-8 relative overflow-hidden animate-fade-in-down">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 animate-float"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 animate-float" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <i className="ri-gift-line text-2xl"></i>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">Refer & Earn Rewards</h1>
            </div>
            <p className="text-teal-100 text-lg mb-6 max-w-2xl animate-fade-in" style={{ animationDelay: '300ms' }}>
              Share SOKONOVA with friends and earn ${rewardAmount} for every successful referral! Your friends get {referralBonus}% off their first order.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-3xl font-bold">${rewardAmount}</div>
                <div className="text-teal-100 text-sm">Per Referral</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-3xl font-bold">12</div>
                <div className="text-teal-100 text-sm">Total Referrals</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-3xl font-bold">${rewardAmount * 12}</div>
                <div className="text-teal-100 text-sm">Total Earned</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Share Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Program Settings */}
            <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Program Settings</h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Program Status:</span>
                  <button
                    onClick={() => setIsActive(!isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      isActive ? 'bg-teal-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className={`text-sm font-semibold ${isActive ? 'text-teal-600' : 'text-gray-500'}`}>
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reward Amount (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={rewardAmount}
                      onChange={(e) => setRewardAmount(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      min="1"
                      max="100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Amount you earn per referral</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Friend's Discount (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={referralBonus}
                      onChange={(e) => setReferralBonus(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      min="5"
                      max="50"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Discount for referred friends</p>
                </div>
              </div>

              <button
                onClick={handleSaveSettings}
                className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                Save Settings
              </button>
            </div>

            {/* Referral Link */}
            <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Referral Link</h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors whitespace-nowrap ripple-effect flex items-center gap-2 cursor-pointer"
                >
                  <i className={copied ? 'ri-check-line' : 'ri-file-copy-line'}></i>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Share Options */}
            <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Share via Social Media</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'WhatsApp', icon: 'ri-whatsapp-line', color: 'green', platform: 'whatsapp' },
                  { name: 'Facebook', icon: 'ri-facebook-fill', color: 'blue', platform: 'facebook' },
                  { name: 'Twitter', icon: 'ri-twitter-x-line', color: 'gray', platform: 'twitter' },
                  { name: 'Email', icon: 'ri-mail-line', color: 'red', platform: 'email' }
                ].map((social) => (
                  <button
                    key={social.name}
                    onClick={() => shareOnSocial(social.platform)}
                    className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-all duration-300 hover-lift cursor-pointer"
                  >
                    <i className={`${social.icon} text-3xl text-${social.color}-600 mb-2`}></i>
                    <span className="text-sm font-medium text-gray-900">{social.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-6">How It Works</h2>
              <div className="space-y-6">
                {[
                  { step: 1, title: 'Share Your Link', desc: 'Send your unique referral link to friends and family', icon: 'ri-share-line' },
                  { step: 2, title: 'They Sign Up', desc: `Your friend creates an account and makes their first purchase with ${referralBonus}% off`, icon: 'ri-user-add-line' },
                  { step: 3, title: 'You Both Earn', desc: `You get $${rewardAmount} credit and they get ${referralBonus}% off their first order`, icon: 'ri-gift-line' }
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <i className={`${item.icon} text-xl text-teal-600`}></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Step {item.step}: {item.title}
                      </h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Referral Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-in-up" style={{ animationDelay: '900ms' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Stats</h2>
              <div className="space-y-4">
                {[
                  { label: 'Pending', value: '3', icon: 'ri-time-line', color: 'yellow' },
                  { label: 'Successful', value: '12', icon: 'ri-check-line', color: 'green' },
                  { label: 'Total Clicks', value: '45', icon: 'ri-cursor-line', color: 'blue' }
                ].map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                        <i className={`${stat.icon} text-${stat.color}-600`}></i>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Referrals */}
            <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Referrals</h2>
              <div className="space-y-3">
                {[
                  { name: 'John D.', status: 'Completed', amount: `$${rewardAmount}` },
                  { name: 'Sarah M.', status: 'Pending', amount: '$0' },
                  { name: 'Mike R.', status: 'Completed', amount: `$${rewardAmount}` }
                ].map((referral, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{referral.name}</div>
                      <div className={`text-xs ${referral.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {referral.status}
                      </div>
                    </div>
                    <div className="font-bold text-gray-900">{referral.amount}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <i className="ri-lightbulb-line text-teal-600 text-xl"></i>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Pro Tips</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Share on multiple platforms</li>
                    <li>• Personalize your message</li>
                    <li>• Follow up with friends</li>
                    <li>• Share success stories</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
