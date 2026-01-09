const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;

// Configure CORS to allow credentials and specify origin
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from frontend
  credentials: true // Allow credentials (cookies, headers, etc)
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Mock data - updated to match frontend expectations
const mockProducts = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones',
    price: 199.99,
    currency: 'USD',
    image: '/mock-product.png',
    seller: {
      id: 'seller1',
      name: 'Tech Gadgets Store',
      sellerHandle: 'tech-gadgets',
      shopName: 'Tech Gadgets Store',
      shopLogoUrl: '/mock-seller.png',
      city: 'Lagos',
      country: 'Nigeria',
      ratingAvg: 4.8,
      ratingCount: 124
    }
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Fitness tracker with heart rate monitor',
    price: 299.99,
    currency: 'USD',
    image: '/mock-product.png',
    seller: {
      id: 'seller2',
      name: 'Fashion Hub',
      sellerHandle: 'fashion-hub',
      shopName: 'Fashion Hub',
      shopLogoUrl: '/mock-seller.png',
      city: 'Nairobi',
      country: 'Kenya',
      ratingAvg: 4.6,
      ratingCount: 89
    }
  },
  {
    id: '3',
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof speaker',
    price: 79.99,
    currency: 'USD',
    image: '/mock-product.png',
    seller: {
      id: 'seller3',
      name: 'Audio Experts',
      sellerHandle: 'audio-experts',
      shopName: 'Audio Experts',
      shopLogoUrl: '/mock-seller.png',
      city: 'Accra',
      country: 'Ghana',
      ratingAvg: 4.9,
      ratingCount: 203
    }
  },
  {
    id: '4',
    name: 'Smartphone',
    description: 'Latest model smartphone with advanced features',
    price: 899.99,
    currency: 'USD',
    image: '/mock-product.png',
    seller: {
      id: 'seller4',
      name: 'Mobile World',
      sellerHandle: 'mobile-world',
      shopName: 'Mobile World',
      shopLogoUrl: '/mock-seller.png',
      city: 'Cairo',
      country: 'Egypt',
      ratingAvg: 4.7,
      ratingCount: 156
    }
  }
];

const mockSellers = [
  {
    id: 'seller1',
    name: 'Tech Gadgets Store',
    sellerHandle: 'tech-gadgets',
    shopName: 'Tech Gadgets Store',
    shopLogoUrl: '/mock-seller.png',
    city: 'Lagos',
    country: 'Nigeria',
    ratingAvg: 4.8,
    ratingCount: 124
  },
  {
    id: 'seller2',
    name: 'Fashion Hub',
    sellerHandle: 'fashion-hub',
    shopName: 'Fashion Hub',
    shopLogoUrl: '/mock-seller.png',
    city: 'Nairobi',
    country: 'Kenya',
    ratingAvg: 4.6,
    ratingCount: 89
  },
  {
    id: 'seller3',
    name: 'Audio Experts',
    sellerHandle: 'audio-experts',
    shopName: 'Audio Experts',
    shopLogoUrl: '/mock-seller.png',
    city: 'Accra',
    country: 'Ghana',
    ratingAvg: 4.9,
    ratingCount: 203
  },
  {
    id: 'seller4',
    name: 'Mobile World',
    sellerHandle: 'mobile-world',
    shopName: 'Mobile World',
    shopLogoUrl: '/mock-seller.png',
    city: 'Cairo',
    country: 'Egypt',
    ratingAvg: 4.7,
    ratingCount: 156
  }
];

// Discovery data
const mockCategories = [
  {
    slug: 'electronics',
    label: 'Electronics',
    sellers: mockSellers
  },
  {
    slug: 'fashion',
    label: 'Fashion',
    sellers: mockSellers.slice(0, 2)
  },
  {
    slug: 'home',
    label: 'Home & Garden',
    sellers: mockSellers.slice(1, 3)
  },
  {
    slug: 'beauty',
    label: 'Beauty',
    sellers: mockSellers.slice(2, 4)
  }
];

const mockRegions = [
  {
    slug: 'lagos',
    label: 'Lagos',
    sellers: mockSellers.slice(0, 1)
  },
  {
    slug: 'nairobi',
    label: 'Nairobi',
    sellers: mockSellers.slice(1, 2)
  },
  {
    slug: 'accra',
    label: 'Accra',
    sellers: mockSellers.slice(2, 3)
  },
  {
    slug: 'cairo',
    label: 'Cairo',
    sellers: mockSellers.slice(3, 4)
  }
];

// Products endpoints
app.get('/products', (req, res) => {
  res.json(mockProducts);
});

app.get('/products/trending', (req, res) => {
  const limit = parseInt(req.query.limit) || 8;
  res.json(mockProducts.slice(0, limit));
});

app.get('/products/:id', (req, res) => {
  const product = mockProducts.find(p => p.id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Storefront endpoints
app.get('/storefront/featured', (req, res) => {
  const limit = parseInt(req.query.limit) || 6;
  res.json(mockSellers.slice(0, limit));
});

app.get('/storefront/handle/:handle', (req, res) => {
  const seller = mockSellers.find(s => s.sellerHandle === req.params.handle);
  if (seller) {
    const products = mockProducts.filter(p => p.seller.id === seller.id);
    res.json({
      seller,
      products
    });
  } else {
    res.status(404).json({ error: 'Storefront not found' });
  }
});

// Discovery endpoints
app.get('/discovery/highlights', (req, res) => {
  res.json({
    categories: mockCategories,
    regions: mockRegions
  });
});

app.get('/discovery/by-category/:slug', (req, res) => {
  const category = mockCategories.find(c => c.slug === req.params.slug);
  if (category) {
    res.json({
      category: category.label,
      sellers: category.sellers,
      products: mockProducts.filter(p => category.sellers.some(s => s.id === p.seller.id))
    });
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

app.get('/discovery/by-region/:regionSlug', (req, res) => {
  const region = mockRegions.find(r => r.slug === req.params.regionSlug);
  if (region) {
    res.json({
      region: region.label,
      sellers: region.sellers,
      products: mockProducts.filter(p => region.sellers.some(s => s.id === p.seller.id))
    });
  } else {
    res.status(404).json({ error: 'Region not found' });
  }
});

// Cart endpoints
let mockCarts = {};

// Get or create cart
app.get('/cart', (req, res) => {
  const userId = req.query.userId;
  const anonKey = req.query.anonKey;
  
  // Create a cart key based on user or anonymous key
  const cartKey = userId || anonKey;
  
  if (!cartKey) {
    return res.status(400).json({ error: 'userId or anonKey required' });
  }
  
  // Create cart if it doesn't exist
  if (!mockCarts[cartKey]) {
    mockCarts[cartKey] = {
      id: cartKey,
      items: [],
      version: 1
    };
  }
  
  res.json(mockCarts[cartKey]);
});

// Add item to cart
app.post('/cart/add', (req, res) => {
  const { cartId, productId, qty } = req.body;
  
  if (!cartId || !productId) {
    return res.status(400).json({ error: 'cartId and productId required' });
  }
  
  // Create cart if it doesn't exist
  if (!mockCarts[cartId]) {
    mockCarts[cartId] = {
      id: cartId,
      items: [],
      version: 1
    };
  }
  
  const cart = mockCarts[cartId];
  const existingItem = cart.items.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.qty += qty || 1;
  } else {
    // Find the product to get its details
    const product = mockProducts.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    cart.items.push({
      productId,
      qty: qty || 1,
      product: {
        id: product.id,
        title: product.name,
        price: product.price,
        currency: product.currency,
        imageUrl: product.image
      }
    });
  }
  
  cart.version += 1;
  res.json(cart);
});

// Remove item from cart
app.delete('/cart/remove', (req, res) => {
  const { cartId, productId } = req.query;
  
  if (!cartId || !productId) {
    return res.status(400).json({ error: 'cartId and productId required' });
  }
  
  if (!mockCarts[cartId]) {
    return res.status(404).json({ error: 'Cart not found' });
  }
  
  const cart = mockCarts[cartId];
  cart.items = cart.items.filter(item => item.productId !== productId);
  cart.version += 1;
  res.json(cart);
});

// Clear cart
app.delete('/cart/clear', (req, res) => {
  const { cartId } = req.query;
  
  if (!cartId) {
    return res.status(400).json({ error: 'cartId required' });
  }
  
  if (!mockCarts[cartId]) {
    return res.status(404).json({ error: 'Cart not found' });
  }
  
  const cart = mockCarts[cartId];
  cart.items = [];
  cart.version += 1;
  res.json(cart);
});

// Analytics endpoints for admin dashboard
app.get('/analytics/ops-summary', (req, res) => {
  // Mock ops summary data
  const mockOpsSummary = {
    windowDaysGMV: 30,
    windowDaysDispute: 90,
    gmvByCity: [
      { cityLabel: 'Lagos', currency: 'USD', gmv: 15000 },
      { cityLabel: 'Nairobi', currency: 'USD', gmv: 12000 },
      { cityLabel: 'Accra', currency: 'USD', gmv: 8000 },
      { cityLabel: 'Cairo', currency: 'USD', gmv: 6000 }
    ],
    topCategories: [
      { category: 'Electronics', gmv: 25000 },
      { category: 'Fashion', gmv: 18000 },
      { category: 'Home & Garden', gmv: 12000 },
      { category: 'Beauty', gmv: 8000 }
    ],
    topSellersByRevenue: [
      { 
        shopName: 'Tech Gadgets Store', 
        handle: 'tech-gadgets', 
        city: 'Lagos', 
        country: 'Nigeria', 
        netRevenue7d: 5000,
        ratingAvg: 4.8,
        ratingCount: 124
      },
      { 
        shopName: 'Fashion Hub', 
        handle: 'fashion-hub', 
        city: 'Nairobi', 
        country: 'Kenya', 
        netRevenue7d: 4200,
        ratingAvg: 4.6,
        ratingCount: 89
      },
      { 
        shopName: 'Audio Experts', 
        handle: 'audio-experts', 
        city: 'Accra', 
        country: 'Ghana', 
        netRevenue7d: 3800,
        ratingAvg: 4.9,
        ratingCount: 203
      }
    ],
    highDisputeSellers: [
      { 
        shopName: 'Mobile World', 
        handle: 'mobile-world', 
        city: 'Cairo', 
        country: 'Egypt', 
        disputeRatePct: 5.2,
        sold: 150,
        disputes: 8
      }
    ],
    payoutLiability: {
      currency: 'USD',
      totalLiability: 25000,
      topOwed: [
        { 
          shopName: 'Tech Gadgets Store', 
          handle: 'tech-gadgets', 
          city: 'Lagos', 
          country: 'Nigeria', 
          amount: 8000
        },
        { 
          shopName: 'Fashion Hub', 
          handle: 'fashion-hub', 
          city: 'Nairobi', 
          country: 'Kenya', 
          amount: 6500
        }
      ]
    }
  };
  
  res.json(mockOpsSummary);
});

// Admin Control Tower endpoints
app.get('/admin-control-tower/health', (req, res) => {
  const mockHealth = {
    systemStatus: 'operational',
    uptime: '99.9%',
    lastUpdated: new Date().toISOString(),
    services: [
      { name: 'Frontend', status: 'operational' },
      { name: 'Backend API', status: 'operational' },
      { name: 'Database', status: 'operational' },
      { name: 'Payment Gateway', status: 'operational' },
      { name: 'Email Service', status: 'operational' },
      { name: 'Image CDN', status: 'operational' }
    ]
  };
  
  res.json(mockHealth);
});

app.get('/admin-control-tower/metrics', (req, res) => {
  const mockMetrics = {
    totalUsers: 12543,
    activeUsers: 3421,
    totalOrders: 8765,
    totalRevenue: 1250000,
    conversionRate: 3.2,
    avgOrderValue: 142.50,
    topRegions: [
      { region: 'Lagos', orders: 2450, revenue: 320000 },
      { region: 'Nairobi', orders: 1876, revenue: 245000 },
      { region: 'Accra', orders: 1432, revenue: 187000 },
      { region: 'Cairo', orders: 987, revenue: 128000 }
    ]
  };
  
  res.json(mockMetrics);
});

app.get('/admin-control-tower/activities', (req, res) => {
  const mockActivities = [
    { 
      id: '1', 
      type: 'order', 
      description: 'New order #12345 placed', 
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      user: 'John Doe'
    },
    { 
      id: '2', 
      type: 'user', 
      description: 'New seller registered: Tech Gadgets Store', 
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      user: 'Admin'
    },
    { 
      id: '3', 
      type: 'payment', 
      description: 'Payment processed for order #12344', 
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      user: 'System'
    },
    { 
      id: '4', 
      type: 'dispute', 
      description: 'New dispute filed for order #12343', 
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      user: 'Jane Smith'
    }
  ];
  
  res.json(mockActivities);
});

app.get('/admin-control-tower/alerts', (req, res) => {
  const mockAlerts = [
    { 
      id: '1', 
      severity: 'warning', 
      title: 'High dispute rate detected', 
      description: 'Seller Mobile World has a dispute rate above threshold',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    },
    { 
      id: '2', 
      severity: 'info', 
      title: 'New feature deployed', 
      description: 'Version 2.1.0 of the platform has been deployed',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    }
  ];
  
  res.json(mockAlerts);
});

app.get('/admin-control-tower/user-insights', (req, res) => {
  const mockInsights = {
    newUserTrend: [
      { date: '2025-11-01', count: 45 },
      { date: '2025-11-02', count: 52 },
      { date: '2025-11-03', count: 48 },
      { date: '2025-11-04', count: 61 },
      { date: '2025-11-05', count: 55 },
      { date: '2025-11-06', count: 49 }
    ],
    retentionRate: 72.5,
    topUserSegments: [
      { segment: 'Tech Enthusiasts', percentage: 28 },
      { segment: 'Fashion Lovers', percentage: 22 },
      { segment: 'Home Decor', percentage: 18 },
      { segment: 'Beauty Enthusiasts', percentage: 15 },
      { segment: 'Others', percentage: 17 }
    ]
  };
  
  res.json(mockInsights);
});

app.listen(port, () => {
  console.log(`Mock backend server running at http://localhost:${port}`);
});

// Add seller applications mock data and endpoints here
let mockSellerApplications = [];

// Apply to become a seller
app.post('/seller-applications/apply', (req, res) => {
  const { userId, businessName, phone, country, city, storefrontDesc } = req.body;
  
  // Check if user already has an application
  const existingApp = mockSellerApplications.find(app => app.userId === userId);
  if (existingApp) {
    return res.status(400).json({ error: 'Application already exists for this user' });
  }
  
  // Create new application
  const newApplication = {
    id: `app_${Date.now()}`,
    userId,
    businessName,
    phone,
    country,
    city,
    storefrontDesc,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockSellerApplications.push(newApplication);
  res.status(201).json(newApplication);
});

// Get my seller application
app.get('/seller-applications/mine', (req, res) => {
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  
  const application = mockSellerApplications.find(app => app.userId === userId);
  if (application) {
    res.json(application);
  } else {
    res.status(404).json({ error: 'No application found for this user' });
  }
});

// Admin: Get pending applications
app.get('/seller-applications/pending', (req, res) => {
  const { adminId } = req.query;
  
  if (!adminId) {
    return res.status(400).json({ error: 'adminId is required' });
  }
  
  const pendingApps = mockSellerApplications.filter(app => app.status === 'PENDING');
  res.json(pendingApps);
});

// Admin: Approve application
app.patch('/seller-applications/:appId/approve', (req, res) => {
  const { appId } = req.params;
  const { adminId, adminNote } = req.body;
  
  if (!adminId) {
    return res.status(400).json({ error: 'adminId is required' });
  }
  
  const application = mockSellerApplications.find(app => app.id === appId);
  if (!application) {
    return res.status(404).json({ error: 'Application not found' });
  }
  
  application.status = 'APPROVED';
  application.adminNote = adminNote;
  application.updatedAt = new Date().toISOString();
  
  res.json(application);
});

// Admin: Reject application
app.patch('/seller-applications/:appId/reject', (req, res) => {
  const { appId } = req.params;
  const { adminId, adminNote } = req.body;
  
  if (!adminId) {
    return res.status(400).json({ error: 'adminId is required' });
  }
  
  const application = mockSellerApplications.find(app => app.id === appId);
  if (!application) {
    return res.status(404).json({ error: 'Application not found' });
  }
  
  application.status = 'REJECTED';
  application.adminNote = adminNote;
  application.updatedAt = new Date().toISOString();
  
  res.json(application);
});
