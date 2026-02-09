# SokoNova Marketplace

[![CI](https://github.com/Thepluscode/SOKONOVA/actions/workflows/ci.yml/badge.svg)](https://github.com/Thepluscode/SOKONOVA/actions/workflows/ci.yml)
[![Backend Deploy](https://github.com/Thepluscode/SOKONOVA/actions/workflows/backend-deploy.yml/badge.svg)](https://github.com/Thepluscode/SOKONOVA/actions/workflows/backend-deploy.yml)

A production-ready multi-seller marketplace platform built with modern technologies.

## Features

- **Multi-seller Support**: Enable multiple vendors to sell on your platform
- **Product Management**: Comprehensive product catalog with variants, inventory tracking
- **Order Processing**: Complete order lifecycle management with status tracking
- **Payment Integration**: Support for Stripe, Paystack, and Flutterwave
- **Cart & Checkout**: Seamless shopping experience with persistent cart
- **Reviews & Ratings**: Customer feedback system for products and sellers
- **Analytics**: Seller dashboards with sales metrics and performance insights
- **Notifications**: Multi-channel notifications (email, SMS, push)
- **Dispute Resolution**: Built-in system for handling order disputes
- **Seller Onboarding**: Application and verification workflow for new sellers

## Tech Stack

### Backend
- **Framework**: NestJS (Node.js + TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth with role-based access control
- **Payment**: Stripe, Paystack, Flutterwave
- **File Storage**: S3/R2 compatible storage
- **Testing**: Jest with comprehensive coverage
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React with Vite
- **UI Components**: Modern component library
- **State Management**: Context API / Redux
- **Styling**: Tailwind CSS / CSS Modules

### Mobile
- **Framework**: React Native
- **Platform**: iOS & Android

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

Backend runs on `http://localhost:4000`

### Frontend Setup

```bash
cd sokonova-frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Environment Configuration

Copy the example environment files and configure for your deployment:

```bash
# Backend
cp backend/.env.example backend/.env
cp backend/.env.production.example backend/.env.production

# Frontend
cp sokonova-frontend/.env.example sokonova-frontend/.env
```

See [PRODUCTION_DEPLOYMENT_CHECKLIST.md](PRODUCTION_DEPLOYMENT_CHECKLIST.md) for complete deployment guide.

## API Documentation

Once the backend is running, access the API documentation at:
- Development: `http://localhost:4000/api/docs`
- Production: `https://api.sokonova.com/api/docs`

## Health Check

Monitor the API health status:
- `GET /health` - Returns application health and database connectivity

## Development Workflow

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd sokonova-frontend
npm test
```

### Database Migrations

```bash
cd backend
npx prisma migrate dev --name your_migration_name
```

### Type Checking

```bash
# Backend
cd backend
npx tsc --noEmit

# Frontend
cd sokonova-frontend
npx tsc --noEmit
```

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

- **CI Workflow**: Runs tests, linting, type checking, and builds on every push/PR
- **PR Checks**: Validates PR title format, analyzes size, detects changed files
- **Deployment**: Automatic deployment to Railway on main branch after CI passes
- **Security Audit**: Checks for vulnerable dependencies

## Deployment

### Production Deployment

The application is deployed on Railway:
- **Backend**: https://api.sokonova.com
- **Frontend**: https://sokonova.com

### Staging Environment

Staging deployments are available for testing:
- **Backend**: https://api-staging.sokonova.com

See [PRODUCTION_DEPLOYMENT_CHECKLIST.md](PRODUCTION_DEPLOYMENT_CHECKLIST.md) for step-by-step deployment instructions.

## Security

- JWT-based authentication with secure secret management
- Rate limiting to prevent abuse
- CORS configured for allowed origins only
- Environment variable validation on startup
- Dependency security audits in CI pipeline
- No secrets committed to git (verified in CI)

## Architecture

```
sokonova/
├── backend/              # NestJS API server
│   ├── src/
│   │   ├── modules/     # Feature modules
│   │   ├── guards/      # Auth guards
│   │   ├── config/      # Configuration
│   │   └── main.ts      # Application entry point
│   ├── prisma/          # Database schema & migrations
│   └── test/            # E2E tests
├── sokonova-frontend/   # React web application
├── sokonova-mobile/     # React Native mobile app
└── .github/
    └── workflows/       # CI/CD pipelines
```

## Contributing

1. Create a feature branch from `develop`
2. Make your changes with tests
3. Ensure all tests pass: `npm test`
4. Create a pull request with semantic title (feat/fix/chore/etc)
5. Wait for CI checks to pass
6. Request review

## License

Proprietary - All rights reserved

## Support

For issues or questions, please open a GitHub issue or contact the development team.
