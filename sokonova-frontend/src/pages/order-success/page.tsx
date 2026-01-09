import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';

export default function OrderSuccess() {
  const orderId = '#12345';
  const estimatedDelivery = 'March 25, 2024';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Icon */}
        <div className="text-center mb-8 animate-scale-in">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center animate-pulse-ring">
            <i className="ri-check-line text-5xl text-green-600"></i>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 mb-2">Thank you for your purchase</p>
          <p className="text-sm text-gray-500">Order {orderId}</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Order Details</h2>
              <p className="text-sm text-gray-600">Confirmation sent to your email</p>
            </div>
            <button className="text-teal-600 hover:text-teal-700 font-medium text-sm whitespace-nowrap flex items-center gap-2">
              <i className="ri-download-line"></i>
              Download Receipt
            </button>
          </div>

          {/* Delivery Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <i className="ri-truck-line text-teal-600"></i>
                Delivery Address
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                John Doe<br />
                123 Main Street, Apt 4B<br />
                New York, NY 10001<br />
                United States
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <i className="ri-calendar-line text-teal-600"></i>
                Estimated Delivery
              </h3>
              <p className="text-sm text-gray-700 mb-2">{estimatedDelivery}</p>
              <p className="text-xs text-gray-500">You'll receive tracking information via email</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {[
                { name: 'Wireless Headphones', qty: 1, price: 89.99, delay: '500ms' },
                { name: 'Phone Case', qty: 2, price: 24.99, delay: '550ms' }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg animate-fade-in"
                  style={{ animationDelay: item.delay }}
                >
                  <img
                    src={`https://readdy.ai/api/search-image?query=modern%20$%7Bitem.name.toLowerCase%28%29%7D%20product%20photography%20white%20background&width=80&height=80&seq=order-${index}&orientation=squarish`}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                  </div>
                  <div className="font-semibold text-gray-900">${(item.price * item.qty).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 animate-fade-in" style={{ animationDelay: '600ms' }}>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">$139.97</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-900">$11.20</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">$151.17</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
          <button
            onClick={() => window.REACT_APP_NAVIGATE(`/orders/${orderId}/tracking`)}
            className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors whitespace-nowrap ripple-effect flex items-center justify-center gap-2"
          >
            <i className="ri-map-pin-line"></i>
            Track Order
          </button>
          <button
            onClick={() => window.REACT_APP_NAVIGATE('/products')}
            className="w-full bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-colors whitespace-nowrap flex items-center justify-center gap-2"
          >
            <i className="ri-shopping-bag-line"></i>
            Continue Shopping
          </button>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
          {[
            { icon: 'ri-shield-check-line', text: 'Secure Payment', delay: '900ms' },
            { icon: 'ri-refresh-line', text: 'Easy Returns', delay: '950ms' },
            { icon: 'ri-customer-service-2-line', text: '24/7 Support', delay: '1000ms' }
          ].map((badge, index) => (
            <div 
              key={index} 
              className="text-center p-4 bg-white rounded-lg shadow-sm animate-scale-in"
              style={{ animationDelay: badge.delay }}
            >
              <i className={`${badge.icon} text-3xl text-teal-600 mb-2`}></i>
              <p className="text-xs font-medium text-gray-700">{badge.text}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
