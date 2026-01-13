
import { useState } from 'react';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your account preferences and security</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <i className="ri-checkbox-circle-fill text-green-600 text-xl"></i>
            <span className="text-green-800 font-medium">Settings saved successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${activeTab === 'profile'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <i className="ri-user-line mr-2"></i>
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${activeTab === 'security'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <i className="ri-shield-line mr-2"></i>
                Security
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${activeTab === 'preferences'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <i className="ri-settings-3-line mr-2"></i>
                Preferences
              </button>
              <button
                onClick={() => {
                  // Fallback navigation if window.REACT_APP_NAVIGATE is not available
                  if (window.REACT_APP_NAVIGATE) {
                    window.REACT_APP_NAVIGATE('/account/settings/notifications');
                  } else {
                    console.warn('Navigation function not available');
                  }
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <i className="ri-notification-line mr-2"></i>
                Notifications
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>

                <div className="space-y-6">
                  {/* Avatar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Profile Photo</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                        <i className="ri-user-line text-3xl text-emerald-600"></i>
                      </div>
                      <div>
                        <Button size="sm" variant="outline" className="whitespace-nowrap">
                          <i className="ri-upload-2-line mr-2"></i>
                          Upload Photo
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max 2MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <Input type="text" defaultValue="John" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <Input type="text" defaultValue="Doe" />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <Input type="email" defaultValue="john.doe@example.com" />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <Input type="tel" defaultValue="+234 801 234 5678" />
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <Input type="text" defaultValue="Lagos" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <Input type="text" defaultValue="Nigeria" />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                      rows={4}
                      defaultValue="Passionate entrepreneur and marketplace enthusiast."
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSave} className="whitespace-nowrap">
                      <i className="ri-save-line mr-2"></i>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* Change Password */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <Input type="password" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <Input type="password" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <Input type="password" />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSave} className="whitespace-nowrap">
                        Update Password
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">Two-Factor Authentication</h2>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">Disabled</span>
                  </div>
                  <Button variant="outline" className="whitespace-nowrap">
                    <i className="ri-shield-check-line mr-2"></i>
                    Enable 2FA
                  </Button>
                </div>

                {/* Active Sessions */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Active Sessions</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <i className="ri-computer-line text-2xl text-gray-600"></i>
                        <div>
                          <p className="font-medium text-gray-900">Chrome on Windows</p>
                          <p className="text-sm text-gray-600">Lagos, Nigeria • Active now</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Current</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <i className="ri-smartphone-line text-2xl text-gray-600"></i>
                        <div>
                          <p className="font-medium text-gray-900">Safari on iPhone</p>
                          <p className="text-sm text-gray-600">Lagos, Nigeria • 2 days ago</p>
                        </div>
                      </div>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium cursor-pointer">
                        Revoke
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                {/* Language & Region */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Language &amp; Region</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm">
                        <option>English</option>
                        <option>French</option>
                        <option>Swahili</option>
                        <option>Hausa</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm">
                        <option>NGN (₦)</option>
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm">
                        <option>Africa/Lagos (WAT)</option>
                        <option>Africa/Nairobi (EAT)</option>
                        <option>Africa/Cairo (EET)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Privacy */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Privacy</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Show online status</p>
                        <p className="text-sm text-gray-600">Let others see when you're online</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Public profile</p>
                        <p className="text-sm text-gray-600">Make your profile visible to everyone</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Show purchase history</p>
                        <p className="text-sm text-gray-600">Display your reviews and ratings publicly</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Data & Storage */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Data &amp; Storage</h2>

                  <div className="space-y-4">
                    <Button variant="outline" className="whitespace-nowrap">
                      <i className="ri-download-line mr-2"></i>
                      Download My Data
                    </Button>
                    <Button variant="outline" className="whitespace-nowrap text-red-600 border-red-300 hover:bg-red-50">
                      <i className="ri-delete-bin-line mr-2"></i>
                      Delete Account
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} className="whitespace-nowrap">
                    <i className="ri-save-line mr-2"></i>
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
