'use client';

export default function ApiDocumentationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">API Documentation</h1>
          <p className="text-muted-foreground">
            Technical documentation for integrating with the SokoNova API
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Getting Started</h2>
          <p className="mb-4">
            To use the SokoNova API, you need to register as a partner and obtain an API key. 
            Once you have your API key, include it in the Authorization header of your requests:
          </p>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <code>Authorization: Bearer YOUR_API_KEY</code>
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Authentication</h2>
          <p className="mb-4">
            All API requests require authentication using your API key. Include the key in the Authorization header:
          </p>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <code>{'curl -H "Authorization: Bearer YOUR_API_KEY" https://api.sokonova.com/products'}</code>
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Endpoints</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Get Products</h3>
            <div className="ml-4">
              <p className="font-medium">GET /api-partner-platform/products</p>
              <p className="text-muted-foreground mb-2">Retrieve a list of products</p>
              
              <h4 className="font-medium mt-2">Query Parameters</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li><code>limit</code> - Number of products to return (default: 20)</li>
                <li><code>offset</code> - Number of products to skip (default: 0)</li>
                <li><code>category</code> - Filter by category</li>
              </ul>
              
              <h4 className="font-medium mt-2">Response</h4>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                <code>{`[
  {
    "id": "product_123",
    "title": "Product Name",
    "description": "Product description",
    "price": 29.99,
    "currency": "USD",
    "imageUrl": "https://example.com/image.jpg",
    "category": "Electronics",
    "seller": {
      "shopName": "Seller Shop",
      "sellerHandle": "seller_handle",
      "city": "City",
      "country": "Country"
    }
  }
]`}</code>
              </pre>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Get Product by ID</h3>
            <div className="ml-4">
              <p className="font-medium">GET /api-partner-platform/products/:id</p>
              <p className="text-muted-foreground mb-2">Retrieve a specific product by ID</p>
              
              <h4 className="font-medium mt-2">Response</h4>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                <code>{`{
  "id": "product_123",
  "title": "Product Name",
  "description": "Product description",
  "price": 29.99,
  "currency": "USD",
  "imageUrl": "https://example.com/image.jpg",
  "category": "Electronics",
  "seller": {
    "shopName": "Seller Shop",
    "sellerHandle": "seller_handle",
    "city": "City",
    "country": "Country"
  }
}`}</code>
              </pre>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Create Order</h3>
            <div className="ml-4">
              <p className="font-medium">POST /api-partner-platform/orders</p>
              <p className="text-muted-foreground mb-2">Create a new order</p>
              
              <h4 className="font-medium mt-2">Request Body</h4>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                <code>{`{
  "productId": "product_123",
  "quantity": 2,
  "customerInfo": {
    "name": "Customer Name",
    "email": "customer@example.com",
    "address": "123 Main St, City, Country"
  }
}`}</code>
              </pre>
              
              <h4 className="font-medium mt-2">Response</h4>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                <code>{`{
  "id": "order_123",
  "total": 59.98,
  "currency": "USD",
  "status": "PAID",
  "items": [
    {
      "id": "item_123",
      "productId": "product_123",
      "qty": 2,
      "price": 29.99
    }
  ]
}`}</code>
              </pre>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Rate Limits</h2>
          <p className="mb-4">
            To ensure fair usage and system stability, the following rate limits apply:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>100 requests per minute for product endpoints</li>
            <li>50 requests per minute for order creation</li>
            <li>Exceeding limits will result in 429 Too Many Requests responses</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
