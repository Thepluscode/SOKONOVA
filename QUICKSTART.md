# SokoNova Quick Start 🚀

Get SokoNova running locally in under 5 minutes.

---

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git

---

## Local Development (Docker)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/sokonova.git
cd sokonova
npm install
cd backend && npm install && cd ..
```

### 2. Start Infrastructure

```bash
# Start Postgres + Redis
docker-compose up -d postgres redis
```

### 3. Setup Database

```bash
cd backend

# Copy environment file
cp .env.example .env

# Run migrations
npx prisma migrate deploy

# Seed demo data
npx prisma db seed
```

### 4. Start Backend

```bash
# In backend directory
npm run start:dev

# API now running at http://localhost:4000
```

### 5. Start Frontend

```bash
# In root directory
cp .env.example .env.local

# Update NEXT_PUBLIC_BACKEND_URL in .env.local
# NEXT_PUBLIC_BACKEND_URL=http://localhost:4000

npm run dev

# Frontend now running at http://localhost:3000
```

---

## Test Credentials

After seeding, use these to log in:

**Admin:**
- Email: `admin@sokonova.com`
- Password: `admin123`

**Seller:**
- Email: `seller1@sokonova.com`
- Password: `password123`

**Buyer:**
- Email: `buyer1@example.com`
- Password: `password123`

---

## Quick Commands

```bash
# Start everything
docker-compose up

# Stop everything
docker-compose down

# View logs
docker-compose logs -f

# Reset database
cd backend && npx prisma migrate reset

# Re-seed data
cd backend && npx prisma db seed

# Run tests
npm test

# Build for production
npm run build
```

---

## Project Structure

```
sokonova-frontend/
├── app/                    # Next.js pages (App Router)
├── components/             # React components
├── lib/                    # Utilities & API clients
├── backend/               # NestJS API
│   ├── src/              # Source code
│   ├── prisma/           # Database schema & migrations
│   └── test/             # Tests
├── .github/workflows/    # CI/CD
└── docker-compose.yml    # Local dev setup
```

---

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

```bash
# Frontend changes
npm run dev

# Backend changes
cd backend && npm run start:dev
```

### 3. Test

```bash
# Run tests
npm test

# Type check
npx tsc --noEmit
```

### 4. Commit & Push

```bash
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

### 5. Create PR

GitHub Actions will:
- ✅ Run tests
- ✅ Create preview deployment
- ✅ Run Lighthouse CI

---

## Common Tasks

### Add New API Endpoint

```bash
cd backend

# Generate module
nest g module your-module
nest g service your-module
nest g controller your-module
```

### Add Database Table

```bash
cd backend

# 1. Edit prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name add_your_table

# 3. Generate Prisma Client
npx prisma generate
```

### Add New Page

```bash
# Create page
touch app/your-page/page.tsx

# Pages are automatically routed
# /your-page → app/your-page/page.tsx
```

---

## Troubleshooting

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 4000
lsof -ti:4000 | xargs kill -9
```

**Database connection error:**
```bash
# Check Docker containers
docker-compose ps

# Restart Postgres
docker-compose restart postgres
```

**Prisma Client out of sync:**
```bash
cd backend
npx prisma generate
```

---

## Environment Variables

### Frontend (.env.local)

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-change-in-production
```

### Backend (.env)

```bash
DATABASE_URL=postgresql://sokonova:sokonova_dev@localhost:5432/sokonova
REDIS_URL=redis://localhost:6379
PORT=4000
NODE_ENV=development
```

---

## Demo Data

After seeding, you'll have:

- 📍 **20 sellers** across Lagos, Nairobi, Accra, etc.
- 📦 **50 products** per category (Electronics, Fashion, Home, Beauty, Food)
- 👥 **30 buyers** from various African cities
- 🛒 **400 orders** with realistic statuses
- ⭐ **100 reviews** (4-5 star ratings)
- ⚠️ **10 disputes** for testing

---

## Next Steps

- 📖 Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- 🏗️ Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- 📝 Read [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines

---

**Happy coding!** 🎉
