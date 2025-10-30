import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Helper to hash passwords
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// African cities data
const cities = [
  { name: 'Lagos', country: 'Nigeria', region: 'West Africa' },
  { name: 'Nairobi', country: 'Kenya', region: 'East Africa' },
  { name: 'Accra', country: 'Ghana', region: 'West Africa' },
  { name: 'Johannesburg', country: 'South Africa', region: 'Southern Africa' },
  { name: 'Cairo', country: 'Egypt', region: 'North Africa' },
  { name: 'Addis Ababa', country: 'Ethiopia', region: 'East Africa' },
  { name: 'Kigali', country: 'Rwanda', region: 'East Africa' },
  { name: 'Dar es Salaam', country: 'Tanzania', region: 'East Africa' },
];

// Product categories with realistic African market items
const categories = {
  electronics: [
    { name: 'Samsung Galaxy A54', price: 45000, desc: 'Latest Android smartphone' },
    { name: 'iPhone 13', price: 120000, desc: 'Apple flagship phone' },
    { name: 'HP Laptop 15"', price: 85000, desc: 'Core i5, 8GB RAM' },
    { name: 'Sony Bluetooth Speaker', price: 8500, desc: 'Portable wireless speaker' },
    { name: 'LG Smart TV 43"', price: 65000, desc: 'Full HD LED TV' },
  ],
  fashion: [
    { name: 'Ankara Print Dress', price: 7500, desc: 'Beautiful African print' },
    { name: 'Dashiki Shirt', price: 4200, desc: 'Traditional African wear' },
    { name: 'Leather Sandals', price: 3500, desc: 'Handmade leather sandals' },
    { name: 'Kente Cloth', price: 15000, desc: 'Authentic Ghanaian Kente' },
    { name: 'Beaded Jewelry Set', price: 2800, desc: 'Handcrafted beaded necklace' },
  ],
  home: [
    { name: 'African Art Canvas', price: 5500, desc: 'Modern African art' },
    { name: 'Woven Basket Set', price: 3200, desc: 'Handwoven storage baskets' },
    { name: 'Mud Cloth Pillow', price: 2100, desc: 'Mali mud cloth cushion' },
    { name: 'Wooden Sculpture', price: 8500, desc: 'Hand-carved wood art' },
    { name: 'Ceramic Dinnerware Set', price: 6700, desc: '12-piece dinner set' },
  ],
  beauty: [
    { name: 'Shea Butter 500g', price: 1800, desc: 'Pure organic shea butter' },
    { name: 'Black Soap', price: 900, desc: 'African black soap' },
    { name: 'Argan Oil', price: 2500, desc: 'Moroccan argan oil' },
    { name: 'Natural Hair Care Set', price: 3500, desc: 'Complete hair care kit' },
    { name: 'Body Butter', price: 1500, desc: 'Moisturizing body butter' },
  ],
  food: [
    { name: 'Jollof Rice Spice Mix', price: 800, desc: 'Authentic spice blend' },
    { name: 'Plantain Chips', price: 500, desc: 'Crispy plantain snack' },
    { name: 'Palm Oil 1L', price: 1200, desc: 'Pure red palm oil' },
    { name: 'African Chili Sauce', price: 650, desc: 'Spicy pepper sauce' },
    { name: 'Hibiscus Tea', price: 1100, desc: 'Dried hibiscus flowers' },
  ],
};

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create sellers across African cities
  console.log('📍 Creating sellers...');
  const sellers = [];

  for (let i = 0; i < 20; i++) {
    const city = cities[i % cities.length];
    const seller = await prisma.user.create({
      data: {
        email: `seller${i + 1}@sokonova.com`,
        password: await hashPassword('password123'),
        role: 'SELLER',
        name: `${city.name} Seller ${i + 1}`,
        sellerHandle: `${city.name.toLowerCase()}-seller-${i + 1}`,
        shopName: `${city.name} Marketplace ${i + 1}`,
        city: city.name,
        country: city.country,
        ratingAvg: 4.0 + Math.random(), // 4.0 - 5.0
        ratingCount: Math.floor(Math.random() * 200) + 10,
        bio: `Quality products from ${city.name}. Trusted seller with ${Math.floor(Math.random() * 5) + 1} years experience.`,
      },
    });
    sellers.push(seller);
  }

  // 2. Create products (50 per category)
  console.log('📦 Creating products...');
  let productCount = 0;

  for (const [category, products] of Object.entries(categories)) {
    for (let i = 0; i < 10; i++) {
      const product = products[i % products.length];
      const seller = sellers[Math.floor(Math.random() * sellers.length)];

      await prisma.product.create({
        data: {
          title: product.name,
          description: product.desc,
          price: product.price.toString(),
          currency: 'NGN',
          imageUrl: `https://via.placeholder.com/400?text=${encodeURIComponent(product.name)}`,
          sellerId: seller.id,
          category: category.toUpperCase(),
          inventory: {
            create: {
              quantity: Math.floor(Math.random() * 100) + 10,
            },
          },
        },
      });
      productCount++;
    }
  }

  console.log(`✅ Created ${productCount} products`);

  // 3. Create buyers
  console.log('👥 Creating buyers...');
  const buyers = [];

  for (let i = 0; i < 30; i++) {
    const city = cities[i % cities.length];
    const buyer = await prisma.user.create({
      data: {
        email: `buyer${i + 1}@example.com`,
        password: await hashPassword('password123'),
        role: 'BUYER',
        name: `${city.name} Customer ${i + 1}`,
        city: city.name,
        country: city.country,
      },
    });
    buyers.push(buyer);
  }

  // 4. Create orders (20 per seller)
  console.log('🛒 Creating orders...');
  let orderCount = 0;

  const products = await prisma.product.findMany({
    include: { seller: true },
  });

  for (const seller of sellers) {
    const sellerProducts = products.filter((p) => p.sellerId === seller.id);
    if (sellerProducts.length === 0) continue;

    for (let i = 0; i < 20; i++) {
      const buyer = buyers[Math.floor(Math.random() * buyers.length)];
      const product = sellerProducts[Math.floor(Math.random() * sellerProducts.length)];
      const qty = Math.floor(Math.random() * 3) + 1;
      const total = parseFloat(product.price) * qty;

      const statuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      await prisma.order.create({
        data: {
          buyerId: buyer.id,
          sellerId: seller.id,
          totalAmount: total.toString(),
          currency: 'NGN',
          status,
          items: {
            create: {
              productId: product.id,
              qty,
              unitPrice: product.price,
            },
          },
          payment: {
            create: {
              provider: 'PAYSTACK',
              providerTransactionId: `txn_${Date.now()}_${i}`,
              amount: total.toString(),
              currency: 'NGN',
              status: 'SUCCESS',
              buyerId: buyer.id,
            },
          },
        },
      });
      orderCount++;
    }
  }

  console.log(`✅ Created ${orderCount} orders`);

  // 5. Create reviews
  console.log('⭐ Creating reviews...');
  let reviewCount = 0;

  const completedOrders = await prisma.order.findMany({
    where: { status: 'DELIVERED' },
    include: { items: true },
  });

  for (const order of completedOrders.slice(0, 100)) {
    const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
    const reviewTexts = [
      'Great product, fast delivery!',
      'Excellent quality, highly recommended',
      'Very satisfied with my purchase',
      'Good value for money',
      'Will buy again',
    ];

    await prisma.review.create({
      data: {
        orderId: order.id,
        buyerId: order.buyerId,
        sellerId: order.sellerId,
        productId: order.items[0].productId,
        rating,
        comment: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
      },
    });
    reviewCount++;
  }

  console.log(`✅ Created ${reviewCount} reviews`);

  // 6. Create some disputes (realistic ratio)
  console.log('⚠️  Creating disputes...');
  let disputeCount = 0;

  const randomOrders = await prisma.order.findMany({
    take: 10,
    where: { status: 'DELIVERED' },
  });

  for (const order of randomOrders) {
    await prisma.dispute.create({
      data: {
        orderId: order.id,
        buyerId: order.buyerId,
        sellerId: order.sellerId,
        reason: 'PRODUCT_NOT_AS_DESCRIBED',
        description: 'Product received is different from description',
        status: 'PENDING',
      },
    });
    disputeCount++;
  }

  console.log(`✅ Created ${disputeCount} disputes`);

  // 7. Create admin user
  console.log('👑 Creating admin user...');
  await prisma.user.create({
    data: {
      email: 'admin@sokonova.com',
      password: await hashPassword('admin123'),
      role: 'ADMIN',
      name: 'SokoNova Admin',
    },
  });

  console.log('\n✨ Seed completed successfully!');
  console.log(`\n📊 Summary:`);
  console.log(`   - ${sellers.length} sellers created`);
  console.log(`   - ${buyers.length} buyers created`);
  console.log(`   - ${productCount} products created`);
  console.log(`   - ${orderCount} orders created`);
  console.log(`   - ${reviewCount} reviews created`);
  console.log(`   - ${disputeCount} disputes created`);
  console.log(`   - 1 admin user created`);
  console.log(`\n🔐 Test Credentials:`);
  console.log(`   Admin: admin@sokonova.com / admin123`);
  console.log(`   Seller: seller1@sokonova.com / password123`);
  console.log(`   Buyer: buyer1@example.com / password123`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
