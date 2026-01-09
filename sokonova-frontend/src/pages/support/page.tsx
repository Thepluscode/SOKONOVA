import { useState } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function SupportPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const faqs = [
    {
      category: 'orders',
      question: 'How do I track my order?',
      answer: 'You can track your order by going to "My Orders" in your account dashboard. Click on the order you want to track and you\'ll see real-time updates on its status and location.',
    },
    {
      category: 'orders',
      question: 'Can I cancel or modify my order?',
      answer: 'You can cancel or modify your order within 24 hours of placing it. Go to "My Orders", select the order, and click "Cancel Order" or "Modify Order". After 24 hours, please contact the seller directly.',
    },
    {
      category: 'payments',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. All payments are processed securely through our encrypted payment gateway.',
    },
    {
      category: 'payments',
      question: 'Is my payment information secure?',
      answer: 'Yes, absolutely. We use industry-standard SSL encryption and comply with PCI DSS standards. We never store your complete credit card information on our servers.',
    },
    {
      category: 'shipping',
      question: 'How long does shipping take?',
      answer: 'Shipping times vary by seller and location. Typically, domestic orders arrive within 3-7 business days, while international orders take 7-21 business days. You\'ll see estimated delivery dates at checkout.',
    },
    {
      category: 'shipping',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by destination. International orders may be subject to customs duties and taxes.',
    },
    {
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Products must be unused and in original packaging. To initiate a return, go to "My Orders" and click "Return Item". Some items may have different return policies set by sellers.',
    },
    {
      category: 'returns',
      question: 'How do I get a refund?',
      answer: 'Once your return is received and inspected, we\'ll process your refund within 5-7 business days. Refunds are issued to your original payment method. You\'ll receive an email confirmation when the refund is processed.',
    },
    {
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Click "Sign Up" in the top right corner, enter your email and create a password. You can also sign up using your Google or Facebook account for faster registration.',
    },
    {
      category: 'account',
      question: 'I forgot my password. What should I do?',
      answer: 'Click "Forgot Password" on the login page, enter your email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.',
    },
    {
      category: 'selling',
      question: 'How do I become a seller?',
      answer: 'Click "Become a Seller" in the navigation menu, complete the seller registration form, and submit required documents for verification. Once approved, you can start listing products immediately.',
    },
    {
      category: 'selling',
      question: 'What are the seller fees?',
      answer: 'We charge a small commission on each sale (typically 5-15% depending on category) plus a small transaction fee. There are no monthly fees or listing fees. You only pay when you make a sale.',
    },
  ];

  const categories = [
    { id: 'all', name: 'All Topics', icon: 'ri-question-line' },
    { id: 'orders', name: 'Orders', icon: 'ri-shopping-bag-line' },
    { id: 'payments', name: 'Payments', icon: 'ri-bank-card-line' },
    { id: 'shipping', name: 'Shipping', icon: 'ri-truck-line' },
    { id: 'returns', name: 'Returns', icon: 'ri-arrow-go-back-line' },
    { id: 'account', name: 'Account', icon: 'ri-user-line' },
    { id: 'selling', name: 'Selling', icon: 'ri-store-line' },
  ];

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Help & Support</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions or contact our support team
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      activeCategory === cat.id
                        ? 'bg-emerald-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <i className={`${cat.icon} text-lg`}></i>
                    <span className="text-sm font-medium">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <details
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden group"
                >
                  <summary className="px-8 py-6 cursor-pointer list-none flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
                    <i className="ri-arrow-down-s-line text-2xl text-gray-400 group-open:rotate-180 transition-transform"></i>
                  </summary>
                  <div className="px-8 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-xl mb-8 text-emerald-50">Our support team is available 24/7 to assist you</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.querySelector('#vapi-widget-floating-button')?.click()}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-chat-3-line mr-2"></i>
              Chat with Us
            </button>
            <a
              href="mailto:support@sokonova.com"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-mail-line mr-2"></i>
              Email Support
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
