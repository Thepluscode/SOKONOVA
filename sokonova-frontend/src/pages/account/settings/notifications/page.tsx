
import { useState } from 'react';
import Header from '../../../../components/feature/Header';
import Footer from '../../../../components/feature/Footer';
import Button from '../../../../components/base/Button';

export default function NotificationSettingsPage() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.REACT_APP_NAVIGATE('/account/settings')}
            className="text-emerald-600 hover:text-emerald-700 font-medium mb-4 cursor-pointer"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Settings
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notification Preferences</h1>
          <p className="text-gray-600">Choose how you want to be notified</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <i className="ri-checkbox-circle-fill text-green-600 text-xl"></i>
            <span className="text-green-800 font-medium">Notification preferences saved!</span>
          </div>
        )}

        {/* Email Notifications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Email Notifications</h2>
          
          <div className="space-y-4">
            <div className="flex items-start justify-between py-3 border-b border-gray-100">
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-1">Order Updates</p>
                <p className="text-sm text-gray-600">Get notified when your order status changes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-start justify-between py-3 border-b border-gray-100">
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-1">Promotions &amp; Deals</p>
                <p className="text-sm text-gray-600">Receive emails about special offers and discounts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-start justify-between py-3 border-b border-gray-100">
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-1">Product Reviews</p>
                <p className="text-sm text-gray-600">Get notified when someone reviews your products</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-start justify-between py-3 border-b border-gray-100">
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-1">Seller Updates</p>
                <p className="text-sm text-gray-600">Updates from sellers you follow</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-start justify-between py-3">
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-1">Weekly Newsletter</p>
                <p className="text-sm text-gray-600">Get a weekly summary of marketplace activity</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Push Notifications</h2>
          
          <div className="space-y-4">
            <div className="flex items-start justify-between py-3 border-b border-gray-100">
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-1">Order Status</p>
                <p className="text-sm text-gray-600">Real-time updates on your orders</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-start justify-between py-3 border-b border-gray-100">
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-1">Messages</p>
                <p className="text-sm text-gray-600">New messages from sellers or buyers</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-start justify-between py-3">
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-1">Price Drops</p>
                <p className="text-sm text-gray-600">Get notified when items in your wishlist go on sale</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">SMS Notifications</h2>
          
          <div className="space-y-4">
            <div className="flex items-start justify-between py-3 border-b border-gray-100">
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-1">Delivery Updates</p>
                <p className="text-sm text-gray-600">SMS alerts when your order is out for delivery</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-start justify-between py-3">
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-1">Security Alerts</p>
                <p className="text-sm text-gray-600">Important security notifications via SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notification Frequency */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Frequency</h2>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="radio" name="frequency" className="w-4 h-4 text-emerald-600" defaultChecked />
              <div>
                <p className="font-medium text-gray-900">Real-time</p>
                <p className="text-sm text-gray-600">Get notified immediately</p>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="radio" name="frequency" className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="font-medium text-gray-900">Daily Digest</p>
                <p className="text-sm text-gray-600">Receive a summary once per day</p>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="radio" name="frequency" className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="font-medium text-gray-900">Weekly Digest</p>
                <p className="text-sm text-gray-600">Receive a summary once per week</p>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="whitespace-nowrap">
            <i className="ri-save-line mr-2"></i>
            Save Preferences
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
