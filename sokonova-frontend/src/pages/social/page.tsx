import { Link } from 'react-router-dom';
import { useState } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';

export default function Social() {
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 animate-fade-in-down">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Social Shopping</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover products through your community, share your finds, and shop together
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="inline-flex bg-white rounded-full p-1 shadow-sm">
            {[
              { id: 'feed', label: 'Feed', icon: 'ri-home-4-line' },
              { id: 'trending', label: 'Trending', icon: 'ri-fire-line' },
              { id: 'following', label: 'Following', icon: 'ri-user-follow-line' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className={tab.icon}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {[...Array(5)].map((_, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-sm overflow-hidden hover-lift card-hover animate-fade-in-up"
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">User {index + 1}</h3>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <i className="ri-more-2-fill text-xl"></i>
                  </button>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  <p className="text-gray-700 text-sm mb-3">
                    Just found this amazing product! Highly recommend it to everyone. The quality is outstanding! 🔥
                  </p>
                </div>

                {/* Product Card */}
                <div className="mx-4 mb-4 border border-gray-200 rounded-lg p-3 flex gap-3 hover:bg-gray-50 transition-colors cursor-pointer">
                  <img
                    src={`https://readdy.ai/api/search-image?query=modern%20tech%20gadget%20product%20photography%20white%20background&width=100&height=100&seq=social-${index}&orientation=squarish`}
                    alt="Product"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Premium Product {index + 1}</h4>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="ri-star-fill text-yellow-400 text-xs"></i>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">(4.8)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-teal-600">${(Math.random() * 100 + 20).toFixed(2)}</span>
                      <button className="text-xs text-teal-600 hover:text-teal-700 font-medium whitespace-nowrap">
                        View Product →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Post Actions */}
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
                      <i className="ri-heart-line text-xl"></i>
                      <span className="text-sm font-medium">{Math.floor(Math.random() * 100 + 20)}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors">
                      <i className="ri-chat-3-line text-xl"></i>
                      <span className="text-sm font-medium">{Math.floor(Math.random() * 20 + 5)}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors">
                      <i className="ri-share-line text-xl"></i>
                      <span className="text-sm font-medium">Share</span>
                    </button>
                  </div>
                  <button className="text-gray-600 hover:text-teal-600 transition-colors">
                    <i className="ri-bookmark-line text-xl"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Products */}
            <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i className="ri-fire-line text-red-500"></i>
                Trending Now
              </h2>
              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
                  <div 
                    key={index} 
                    className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors animate-fade-in"
                    style={{ animationDelay: `${900 + index * 50}ms` }}
                  >
                    <img
                      src={`https://readdy.ai/api/search-image?query=trending%20product%20photography%20white%20background&width=60&height=60&seq=trending-${index}&orientation=squarish`}
                      alt="Trending"
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">Trending Item {index + 1}</h4>
                      <p className="text-xs text-gray-500 mb-1">{Math.floor(Math.random() * 500 + 100)} posts</p>
                      <span className="text-sm font-bold text-teal-600">${(Math.random() * 50 + 20).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Users */}
            <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-in-up" style={{ animationDelay: '1100ms' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Suggested Users</h2>
              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between animate-fade-in"
                    style={{ animationDelay: `${1200 + index * 50}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {String.fromCharCode(70 + index)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Influencer {index + 1}</h4>
                        <p className="text-xs text-gray-500">{Math.floor(Math.random() * 10 + 1)}k followers</p>
                      </div>
                    </div>
                    <button className="px-4 py-1.5 bg-teal-600 text-white rounded-full text-xs font-medium hover:bg-teal-700 transition-colors whitespace-nowrap">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
