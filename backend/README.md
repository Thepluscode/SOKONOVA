
# SokoNova Backend (NestJS + Prisma)

Minimal scaffold exposing:
- `GET /products` — list products
- `GET /products/:id` — get product + variants

## Setup
```bash
cp .env.example .env
npm install
npm run prisma:dev   # create SQLite DB and schema
npm run dev         # http://localhost:4000
```

Seed the database by inserting rows with `prisma studio`:
```bash
npm run prisma:studio
```

You can then point the Next.js frontend to this API for real catalog data.
