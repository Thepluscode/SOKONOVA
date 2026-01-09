
import { useState } from 'react';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';

export default function PartnerDocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: 'ri-rocket-line' },
    { id: 'authentication', title: 'Authentication', icon: 'ri-shield-keyhole-line' },
    { id: 'api-reference', title: 'API Reference', icon: 'ri-code-box-line' },
    { id: 'webhooks', title: 'Webhooks', icon: 'ri-webhook-line' },
    { id: 'best-practices', title: 'Best Practices', icon: 'ri-lightbulb-line' },
    { id: 'support', title: 'Support', icon: 'ri-customer-service-line' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Partner Documentation</h1>
          <p className="text-gray-600">Everything you need to integrate with SOKONOVA</p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <i className="ri-book-open-line text-2xl text-emerald-600"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">API Documentation</h3>
            <p className="text-sm text-gray-600 mb-4">Complete API reference and guides</p>
            <a href="#api-reference" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium cursor-pointer">
              View Docs →
            </a>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <i className="ri-terminal-box-line text-2xl text-blue-600"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Code Examples</h3>
            <p className="text-sm text-gray-600 mb-4">Sample code in multiple languages</p>
            <a href="#examples" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium cursor-pointer">
              Browse Examples →
            </a>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <i className="ri-customer-service-2-line text-2xl text-purple-600"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Developer Support</h3>
            <p className="text-sm text-gray-600 mb-4">Get help from our team</p>
            <a href="mailto:developers@sokonova.com" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium cursor-pointer">
              Contact Support →
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Documentation</h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      activeSection === section.id
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <i className={`${section.icon} mr-2`}></i>
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === 'getting-started' && (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting Started</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Welcome to SOKONOVA Partner API</h3>
                    <p className="text-gray-600 mb-4">
                      The SOKONOVA Partner API allows you to integrate your services with Africa's leading marketplace platform. 
                      Whether you're a logistics provider, payment gateway, or marketing service, our API provides everything you need 
                      to build seamless integrations.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Prerequisites</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Active SOKONOVA partner account</li>
                      <li>API credentials (API Key and Secret)</li>
                      <li>Basic understanding of RESTful APIs</li>
                      <li>HTTPS-enabled server for webhooks</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Start</h3>
                    <div className="bg-gray-900 rounded-lg p-4 mb-4">
                      <code className="text-green-400 text-sm">
                        curl https://api.sokonova.com/v1/partner/status \\<br />
                        &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY" \\<br />
                        &nbsp;&nbsp;-H "Content-Type: application/json"
                      </code>
                    </div>
                    <p className="text-sm text-gray-600">
                      Replace YOUR_API_KEY with your actual API key from the partner dashboard.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Base URL</h3>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <code className="text-sm text-gray-900">https://api.sokonova.com/v1</code>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Rate Limits</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900">
                        <i className="ri-information-line mr-2"></i>
                        Standard rate limit: 1000 requests per hour. Contact support for higher limits.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Next Steps</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        onClick={() => setActiveSection('authentication')}
                        className="p-4 border border-gray-200 rounded-lg hover:border-emerald-600 hover:bg-emerald-50 transition-all text-left cursor-pointer"
                      >
                        <i className="ri-shield-keyhole-line text-2xl text-emerald-600 mb-2"></i>
                        <h4 className="font-semibold text-gray-900 mb-1">Authentication</h4>
                        <p className="text-sm text-gray-600">Learn how to authenticate API requests</p>
                      </button>
                      <button
                        onClick={() => setActiveSection('api-reference')}
                        className="p-4 border border-gray-200 rounded-lg hover:border-emerald-600 hover:bg-emerald-50 transition-all text-left cursor-pointer"
                      >
                        <i className="ri-code-box-line text-2xl text-emerald-600 mb-2"></i>
                        <h4 className="font-semibold text-gray-900 mb-1">API Reference</h4>
                        <p className="text-sm text-gray-600">Explore all available endpoints</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'authentication' && (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Authentication</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">API Key Authentication</h3>
                    <p className="text-gray-600 mb-4">
                      All API requests must include your API key in the Authorization header using Bearer authentication.
                    </p>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <code className="text-green-400 text-sm">
                        Authorization: Bearer sk_live_abc123xyz789
                      </code>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Getting Your API Keys</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600">
                      <li>Log in to your partner dashboard</li>
                      <li>Navigate to Settings → API Keys</li>
                      <li>Click "Generate New Key"</li>
                      <li>Copy and securely store your API key</li>
                    </ol>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-900">
                      <i className="ri-alert-line mr-2"></i>
                      <strong>Security Warning:</strong> Never share your API keys or commit them to version control. 
                      Use environment variables to store sensitive credentials.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Test vs Live Keys</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-900 mb-1">Test Keys (sk_test_...)</p>
                        <p className="text-sm text-gray-600">Use for development and testing. No real transactions.</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-900 mb-1">Live Keys (sk_live_...)</p>
                        <p className="text-sm text-gray-600">Use in production. Processes real transactions.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'api-reference' && (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">API Reference</h2>
                
                <div className="space-y-8">
                  {/* Orders Endpoint */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders</h3>
                    
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <div className="flex items-center space-x-3">
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">GET</span>
                            <code className="text-sm text-gray-900">/partner/orders</code>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-gray-600 mb-3">Retrieve a list of orders assigned to your service.</p>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Query Parameters:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li><code className="bg-gray-100 px-2 py-1 rounded text-xs">status</code> - Filter by order status</li>
                            <li><code className="bg-gray-100 px-2 py-1 rounded text-xs">limit</code> - Number of results (default: 20)</li>
                            <li><code className="bg-gray-100 px-2 py-1 rounded text-xs">offset</code> - Pagination offset</li>
                          </ul>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <div className="flex items-center space-x-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">POST</span>
                            <code className="text-sm text-gray-900">/partner/orders/:id/update</code>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-gray-600 mb-3">Update order status and tracking information.</p>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Request Body:</h4>
                          <div className="bg-gray-900 rounded p-3">
                            <code className="text-green-400 text-xs">
                              {`{
  "status": "in_transit",
  "tracking_code": "TRK123456",
  "estimated_delivery": "2024-01-15"
}`}
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payments Endpoint */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payments</h3>
                    
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">POST</span>
                          <code className="text-sm text-gray-900">/partner/payments/process</code>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600 mb-3">Process a payment transaction.</p>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Request Body:</h4>
                        <div className="bg-gray-900 rounded p-3">
                          <code className="text-green-400 text-xs">
                            {`{
  "order_id": "ORD-12345",
  "amount": 5000,
  "currency": "NGN",
  "payment_method": "card"
}`}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'webhooks' && (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Webhooks</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">What are Webhooks?</h3>
                    <p className="text-gray-600 mb-4">
                      Webhooks allow SOKONOVA to send real-time notifications to your server when events occur. 
                      Instead of polling our API, you'll receive instant updates about orders, payments, and more.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Setting Up Webhooks</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600">
                      <li>Create an HTTPS endpoint on your server</li>
                      <li>Add the endpoint URL in your partner dashboard</li>
                      <li>Select which events you want to receive</li>
                      <li>Verify webhook signatures for security</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Events</h3>
                    <div className="space-y-2">
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <code className="text-sm font-medium text-gray-900">order.created</code>
                        <p className="text-sm text-gray-600 mt-1">Triggered when a new order is created</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <code className="text-sm font-medium text-gray-900">order.updated</code>
                        <p className="text-sm text-gray-600 mt-1">Triggered when order status changes</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <code className="text-sm font-medium text-gray-900">payment.completed</code>
                        <p className="text-sm text-gray-600 mt-1">Triggered when payment is successful</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <code className="text-sm font-medium text-gray-900">payment.failed</code>
                        <p className="text-sm text-gray-600 mt-1">Triggered when payment fails</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Webhook Payload Example</h3>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <code className="text-green-400 text-sm">
                        {`{
  "event": "order.created",
  "timestamp": "2024-01-10T10:30:00Z",
  "data": {
    "order_id": "ORD-12345",
    "status": "pending",
    "total": 5000,
    "currency": "NGN"
  }
}`}
                      </code>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Verifying Signatures</h3>
                    <p className="text-gray-600 mb-3">
                      Each webhook includes a signature in the <code className="bg-gray-100 px-2 py-1 rounded text-sm">X-Sokonova-Signature</code> header. 
                      Verify this signature to ensure the webhook came from SOKONOVA.
                    </p>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <code className="text-green-400 text-sm">
                        {`const crypto = require('crypto');

const signature = req.headers['x-sokonova-signature'];
const payload = JSON.stringify(req.body);
const secret = process.env.WEBHOOK_SECRET;

const expectedSignature = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');

if (signature === expectedSignature) {
  // Webhook is valid
}`}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'best-practices' && (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Best Practices</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Security</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-fill text-emerald-600 mr-2 mt-1"></i>
                        <span>Always use HTTPS for API requests and webhook endpoints</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-fill text-emerald-600 mr-2 mt-1"></i>
                        <span>Store API keys securely using environment variables</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-fill text-emerald-600 mr-2 mt-1"></i>
                        <span>Verify webhook signatures before processing</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-fill text-emerald-600 mr-2 mt-1"></i>
                        <span>Rotate API keys regularly</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Error Handling</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-fill text-emerald-600 mr-2 mt-1"></i>
                        <span>Implement exponential backoff for retries</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-fill text-emerald-600 mr-2 mt-1"></i>
                        <span>Log all API errors for debugging</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-fill text-emerald-600 mr-2 mt-1"></i>
                        <span>Handle rate limits gracefully</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-fill text-emerald-600 mr-2 mt-1"></i>
                        <span>Provide meaningful error messages to users</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-fill text-emerald-600 mr-2 mt-1"></i>
                        <span>Cache frequently accessed data</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-fill text-emerald-600 mr-2 mt-1"></i>
                        <span>Use pagination for large datasets</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-fill text-emerald-600 mr-2 mt-1"></i>
                        <span>Batch API requests when possible</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-fill text-emerald-600 mr-2 mt-1"></i>
                        <span>Monitor API response times</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Testing</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-fill text-emerald-600 mr-2 mt-1"></i>
                        <span>Use test API keys during development</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-fill text-emerald-600 mr-2 mt-1"></i>
                        <span>Test webhook handling with various scenarios</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-fill text-emerald-600 mr-2 mt-1"></i>
                        <span>Validate all input data</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-fill text-emerald-600 mr-2 mt-1"></i>
                        <span>Test error handling and edge cases</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'support' && (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Support</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Get Help</h3>
                    <p className="text-gray-600 mb-4">
                      Our developer support team is here to help you integrate successfully. 
                      Choose the best way to reach us based on your needs.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 border border-gray-200 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <i className="ri-mail-line text-2xl text-blue-600"></i>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Email Support</h4>
                      <p className="text-sm text-gray-600 mb-4">For general inquiries and technical questions</p>
                      <a href="mailto:developers@sokonova.com" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium cursor-pointer">
                        developers@sokonova.com
                      </a>
                    </div>

                    <div className="p-6 border border-gray-200 rounded-lg">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <i className="ri-chat-3-line text-2xl text-green-600"></i>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Live Chat</h4>
                      <p className="text-sm text-gray-600 mb-4">Quick answers during business hours</p>
                      <Button size="sm" className="whitespace-nowrap">
                        Start Chat
                      </Button>
                    </div>

                    <div className="p-6 border border-gray-200 rounded-lg">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <i className="ri-discord-line text-2xl text-purple-600"></i>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Developer Community</h4>
                      <p className="text-sm text-gray-600 mb-4">Connect with other partners</p>
                      <a href="https://discord.gg/sokonova" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium cursor-pointer">
                        Join Discord
                      </a>
                    </div>

                    <div className="p-6 border border-gray-200 rounded-lg">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                        <i className="ri-github-line text-2xl text-orange-600"></i>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">GitHub</h4>
                      <p className="text-sm text-gray-600 mb-4">Report bugs and request features</p>
                      <a href="https://github.com/sokonova" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium cursor-pointer">
                        View Repository
                      </a>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Response Times</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Critical Issues</span>
                        <span className="text-sm font-semibold text-gray-900">&lt; 2 hours</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Technical Questions</span>
                        <span className="text-sm font-semibold text-gray-900">&lt; 24 hours</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">General Inquiries</span>
                        <span className="text-sm font-semibold text-gray-900">&lt; 48 hours</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                    <h4 className="font-semibold text-emerald-900 mb-2">Premium Support</h4>
                    <p className="text-sm text-emerald-800 mb-4">
                      Need dedicated support? Upgrade to our Premium Partner plan for priority assistance, 
                      dedicated account manager, and 24/7 support.
                    </p>
                    <Button size="sm" className="whitespace-nowrap">
                      Learn More
                    </Button>
                  </div>
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
