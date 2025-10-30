# Prisma Schema Consolidation Guide

## Problem Identified

Your project has **two separate Prisma schemas**:

1. **Root `/prisma/schema.prisma`** - NextAuth authentication models
2. **Backend `/backend/prisma/schema.prisma`** - Full marketplace business logic

This creates:
- Data inconsistency
- Duplicate User models
- Confusing developer experience
- Complex deployments

## Recommended Solution

**Consolidate everything into `/backend/prisma/schema.prisma`** and make it the single source of truth.

---

## Step-by-Step Migration

### Phase 1: Merge Schemas (30 minutes)

#### 1. Backup Current Schemas
```bash
cp /backend/prisma/schema.prisma /backend/prisma/schema.prisma.backup
cp /prisma/schema.prisma /prisma/schema.prisma.backup
```

#### 2. Update Backend Schema to Include NextAuth Models

Add these models to `/backend/prisma/schema.prisma`:

```prisma
// Add to existing User model (merge with current)
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?

  // NextAuth fields
  emailVerified DateTime?
  image         String?
  passwordHash  String?

  role          Role     @default(BUYER)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Seller storefront fields
  sellerHandle   String?  @unique
  shopName       String?
  shopLogoUrl    String?
  shopBannerUrl  String?
  shopBio        String?
  country        String?
  city           String?

  // Reputation
  ratingAvg      Float?   @default(0)
  ratingCount    Int?     @default(0)

  // Relations
  carts             Cart[]
  orders            Order[]
  products          Product[] @relation("SellerProducts")
  sellerApplication SellerApplication?
  disputes          Dispute[]
  reviewsGiven      Review[] @relation("BuyerReviews")
  reviewsReceived   Review[] @relation("SellerReviews")

  // NextAuth relations
  accounts          Account[]
  sessions          Session[]
}

// Add NextAuth models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

#### 3. Generate New Prisma Client in Backend
```bash
cd backend
npx prisma generate
```

---

### Phase 2: Update Frontend to Use Backend Prisma (45 minutes)

#### 1. Remove Root Prisma Folder
```bash
# After confirming backend schema is working
rm -rf /prisma
```

#### 2. Update Frontend to Point to Backend Prisma

**Option A: Symlink (Recommended for Development)**
```bash
# From project root
ln -s backend/prisma prisma
ln -s backend/node_modules/.prisma node_modules/.prisma
```

**Option B: Direct Import (Production)**

Update frontend code to import from backend:
```typescript
// Before
import { PrismaClient } from '@prisma/client';

// After
import { PrismaClient } from '../backend/node_modules/.prisma/client';
```

#### 3. Update Frontend Prisma Scripts

In root `package.json`, add scripts that delegate to backend:
```json
{
  "scripts": {
    "db:generate": "cd backend && npx prisma generate",
    "db:migrate": "cd backend && npx prisma migrate dev",
    "db:push": "cd backend && npx prisma db push",
    "db:studio": "cd backend && npx prisma studio"
  }
}
```

---

### Phase 3: Update Environment Variables (10 minutes)

#### Root `.env.local`
```bash
# Database URL should point to same database as backend
DATABASE_URL="postgresql://user:password@localhost:5432/sokonova"

# NextAuth settings
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

#### Backend `.env`
```bash
# Same database URL
DATABASE_URL="postgresql://user:password@localhost:5432/sokonova"
```

**Critical:** Both must use the **same database** now that there's one schema.

---

### Phase 4: Run Migration (20 minutes)

#### 1. Create Migration for New Fields
```bash
cd backend
npx prisma migrate dev --name add_nextauth_models
```

This will:
- Add Account, Session, VerificationToken tables
- Add emailVerified, image, passwordHash to User
- Preserve all existing data

#### 2. Verify Migration
```bash
npx prisma studio
```

Check that:
- All existing tables still exist
- New NextAuth tables are present
- User table has merged fields

---

### Phase 5: Update Application Code (30 minutes)

#### Frontend: Update Prisma Client Initialization

**`lib/prisma.ts`** (if it exists)
```typescript
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
```

#### NextAuth: Update Configuration

**`app/api/auth/[...nextauth]/route.ts`**
```typescript
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import NextAuth from "next-auth";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  // ... rest of your config
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

### Phase 6: Testing (30 minutes)

#### Backend Tests
```bash
cd backend

# Test Prisma client
npx ts-node -e "
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.user.findMany().then(console.log);
"

# Start backend
npm run start:dev
```

#### Frontend Tests
```bash
# Test NextAuth
# Login via frontend
# Verify session is created in database
# Check that Account/Session tables are populated
```

#### Integration Tests
1. Create a new user via NextAuth → Check User table
2. Promote user to seller → Check seller fields
3. Create product → Check Product table
4. Place order → Check Order/OrderItem tables
5. Verify analytics still works

---

## Alternative: Keep Separate Databases (Not Recommended)

If you absolutely must keep them separate:

### Root Prisma (Frontend Auth)
```
DATABASE_URL="postgresql://user:pass@localhost:5432/sokonova_auth"
```

### Backend Prisma (Marketplace)
```
DATABASE_URL="postgresql://user:pass@localhost:5432/sokonova_marketplace"
```

**Downsides:**
- User data duplicated across databases
- Complex sync logic needed
- Higher infrastructure costs
- More failure points

---

## Recommended Architecture (Post-Consolidation)

```
sokonova-frontend/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          ← SINGLE SOURCE OF TRUTH
│   ├── src/
│   │   └── modules/
│   │       └── prisma.service.ts
│   └── package.json
├── app/
│   └── api/
│       └── auth/
│           └── [...nextauth]/route.ts  ← Uses backend Prisma
├── lib/
│   └── prisma.ts                   ← Points to backend Prisma
└── package.json
```

**Benefits:**
- One database, one schema, one client
- Consistent data model everywhere
- Easier to reason about
- Simpler deployments

---

## Migration Checklist

- [ ] Backup both schemas
- [ ] Merge schemas in backend/prisma/schema.prisma
- [ ] Add NextAuth models (Account, Session, VerificationToken)
- [ ] Update User model with NextAuth fields
- [ ] Run `prisma generate` in backend
- [ ] Create migration `prisma migrate dev`
- [ ] Update frontend to use backend Prisma
- [ ] Update environment variables (same DATABASE_URL)
- [ ] Test NextAuth login flow
- [ ] Test marketplace features (products, orders)
- [ ] Test analytics dashboard
- [ ] Update CI/CD to use single schema
- [ ] Remove root /prisma folder
- [ ] Update documentation

---

## Deployment Considerations

### Development
```bash
# Generate Prisma client
cd backend && npx prisma generate

# Run migrations
cd backend && npx prisma migrate dev

# Start backend
cd backend && npm run start:dev

# Start frontend
npm run dev
```

### Production
```bash
# Build pipeline should:
1. cd backend && npx prisma migrate deploy
2. cd backend && npx prisma generate
3. cd backend && npm run build
4. npm run build (frontend)
```

---

## Rollback Plan

If consolidation causes issues:

```bash
# Restore backups
cp /backend/prisma/schema.prisma.backup /backend/prisma/schema.prisma
cp /prisma/schema.prisma.backup /prisma/schema.prisma

# Regenerate clients
cd backend && npx prisma generate
npx prisma generate

# Rollback database migration
cd backend && npx prisma migrate reset
```

---

## Support & Questions

### Common Issues

**Q: Frontend can't find Prisma Client**
A: Ensure symlink exists or update import path to backend

**Q: Database migrations failing**
A: Check that both .env files point to same DATABASE_URL

**Q: NextAuth not working after consolidation**
A: Verify Account/Session/VerificationToken models exist in backend schema

**Q: Type errors in frontend**
A: Run `cd backend && npx prisma generate` to regenerate types

---

## Timeline Estimate

- **Fast Track (Dev Only):** 2 hours
- **Production Ready:** 1 day (with testing)
- **Full Rollout:** 2-3 days (with monitoring)

---

**Recommendation:** Do this consolidation ASAP before your database grows too large. The longer you wait, the more complex the migration becomes.

---

**Last Updated:** 2025-10-30
**Priority:** HIGH - Technical Debt Reduction
