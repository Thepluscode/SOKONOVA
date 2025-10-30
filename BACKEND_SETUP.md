# Backend Setup Guide

## Issues Fixed

I've fixed the following issues with your backend:

1. ✅ **Prisma Schema** - Changed `@db.Numeric` to `@db.Decimal` (PostgreSQL compatible)
2. ✅ **Prisma Schema** - Added missing `cartItems` relation to Product model
3. ✅ **package.json** - Added `start:dev` script
4. ✅ **package.json** - Updated dependencies to use compatible versions
5. ✅ **package.json** - Added missing dependencies (helmet, morgan, cookie-parser, class-validator, class-transformer)
6. ✅ **.env** - Created environment file with PostgreSQL connection

## Setup Instructions

### 1. Install PostgreSQL

If you don't have PostgreSQL installed:

**macOS (using Homebrew)**:
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Or use Docker**:
```bash
docker run --name sokonova-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
```

### 2. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE sokonova_db;

# Exit psql
\q
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Configure Environment

The `.env` file has been created with default values:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sokonova_db"
PORT=4000
NODE_ENV=development
```

**Update the DATABASE_URL if needed** with your PostgreSQL credentials.

### 5. Run Prisma Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (for development)
npx prisma db push

# OR run migrations (for production)
npx prisma migrate dev --name init
```

### 6. Seed Database with Sample Products

Open Prisma Studio to add products manually:

```bash
npx prisma studio
```

Or create a seed script. Here's a quick seed command you can run in Prisma Studio:

**Sample Products to Add**:

1. **Product 1**:
   - title: "Wireless Headphones"
   - description: "Premium noise-cancelling wireless headphones"
   - price: 199.99
   - currency: "USD"
   - imageUrl: "/mock-product.png"
   - sellerId: (create a user first and use their ID)

2. **Product 2**:
   - title: "Smart Watch"
   - description: "Fitness tracker with heart rate monitor"
   - price: 299.99
   - currency: "USD"
   - imageUrl: "/mock-product.png"
   - sellerId: (same seller ID)

### 7. Start Backend

```bash
npm run start:dev
```

Backend will run on: http://localhost:4000

### 8. Test Backend API

Open your browser or use curl to test:

```bash
# List products
curl http://localhost:4000/products

# Get single product (replace ID)
curl http://localhost:4000/products/YOUR_PRODUCT_ID
```

## Quick Setup Script

Run all commands at once:

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client and push schema
npx prisma generate
npx prisma db push

# Open Prisma Studio to add products
npx prisma studio

# In another terminal, start the backend
npm run start:dev
```

## Troubleshooting

### Error: "Can't reach database server"

**Solution**: Make sure PostgreSQL is running:

```bash
# Check if PostgreSQL is running
brew services list

# Start PostgreSQL
brew services start postgresql@15

# Or if using Docker
docker start sokonova-postgres
```

### Error: "database 'sokonova_db' does not exist"

**Solution**: Create the database:

```bash
psql -U postgres -c "CREATE DATABASE sokonova_db;"
```

### Error: "role 'postgres' does not exist"

**Solution**: Update the DATABASE_URL in `.env` with your PostgreSQL username:

```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/sokonova_db"
```

### Port 4000 already in use

**Solution**: Change the PORT in `.env`:

```env
PORT=4001
```

Don't forget to update `NEXT_PUBLIC_BACKEND_URL` in frontend `.env.local` to match!

## Creating a Seed Script (Optional)

Create `backend/prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a seller user
  const seller = await prisma.user.create({
    data: {
      email: 'seller@sokonova.dev',
      name: 'Demo Seller',
      role: 'SELLER',
    },
  });

  // Create sample products
  const products = [
    {
      title: 'Wireless Headphones',
      description: 'Premium noise-cancelling wireless headphones',
      price: 199.99,
      currency: 'USD',
      imageUrl: '/mock-product.png',
      sellerId: seller.id,
    },
    {
      title: 'Smart Watch',
      description: 'Fitness tracker with heart rate monitor',
      price: 299.99,
      currency: 'USD',
      imageUrl: '/mock-product.png',
      sellerId: seller.id,
    },
    {
      title: 'Bluetooth Speaker',
      description: 'Portable waterproof speaker',
      price: 79.99,
      currency: 'USD',
      imageUrl: '/mock-product.png',
      sellerId: seller.id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        inventory: {
          create: {
            quantity: 50,
          },
        },
      },
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Add to `backend/package.json`:

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

Run seed:

```bash
npx prisma db seed
```

## Verification Checklist

- [ ] PostgreSQL is running
- [ ] Database `sokonova_db` created
- [ ] Backend dependencies installed
- [ ] Prisma client generated
- [ ] Database schema pushed
- [ ] Sample products added
- [ ] Backend running on port 4000
- [ ] Can access http://localhost:4000/products

Once all checks pass, your backend is ready! Go back to the frontend and test the integration.
