// IMPORTANT: Import Sentry instrumentation FIRST before any other imports
import './instrument';

import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app.module'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'
import { SentryExceptionFilter } from './common/filters/sentry-exception.filter'
import { DiscoveryService } from './modules/discovery/discovery.service'
import { ProductsService } from './modules/products/products.service'
import rateLimit from 'express-rate-limit'
import { validateEnvironment } from './config/env.validation'
import { createLogger } from './config/logger.config'

const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

async function bootstrap() {
  console.log('BOOT: sokonova backend main.ts v1')

  // Validate environment variables before proceeding
  validateEnvironment()

  // Create NestJS app with Winston logger
  const app = await NestFactory.create(AppModule, {
    logger: createLogger(),
  })

  // CORS - Must be enabled BEFORE Helmet
  // Configure allowed origins from environment variable or defaults
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:8081',  // Expo web
        'http://localhost:54112',
        'https://sokonova-frontend-production.up.railway.app',
        'https://sokonova-backend-production.up.railway.app',
      ];

  console.log('CORS: Allowed origins:', allowedOrigins);

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: true,
  })

  // Security - Configure Helmet to not interfere with CORS
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  }))

  // Rate Limiting - Prevent brute force attacks
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  })

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 login attempts per windowMs
    message: 'Too many login attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  })

  // Apply rate limiters
  app.use('/auth/login', authLimiter)
  app.use('/auth/register', authLimiter)
  app.use(generalLimiter)

  app.use(morgan('dev'))
  app.use(cookieParser())
  app.use((req, res, next) => {
    res.setHeader('x-sokonova-app', '1')
    next()
  })
  app.use(
    express.json({
      verify: (req: any, res, buf) => {
        req.rawBody = buf.toString()
      },
    }),
  )

  // Global pipes and filters
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.useGlobalFilters(new SentryExceptionFilter())

  // Ensure app is initialized before attaching raw express routes
  await app.init()

  // Explicit route fallbacks to avoid routing/caching mismatches
  const discovery = app.get(DiscoveryService)
  const products = app.get(ProductsService)

  const server = app.getHttpAdapter().getInstance()

  server.get('/discovery/social-proof', async (req, res) => {
    res.setHeader('x-sokonova-route', 'express-discovery-social-proof')
    const raw = req.query.limit as string | undefined
    const parsed = raw ? parseInt(raw, 10) : 6
    try {
      const data = await discovery.getSocialProof(Number.isNaN(parsed) ? 6 : parsed)
      return res.json(data)
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Failed to fetch social proof' })
    }
  })

  server.get('/discovery/suggestions', async (req, res) => {
    res.setHeader('x-sokonova-route', 'express-discovery-suggestions')
    const q = (req.query.q as string | undefined) || ''
    if (!q || q.length < 2) {
      return res.json({ products: [], categories: [], sellers: [] })
    }
    try {
      const data = await discovery.getSuggestions(q)
      return res.json(data)
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Failed to fetch suggestions' })
    }
  })

  server.get('/products/search', async (req, res) => {
    res.setHeader('x-sokonova-route', 'express-products-search')
    const q = (req.query.q as string | undefined) || ''
    if (!q.trim()) {
      return res.json([])
    }
    const category = (req.query.category as string | undefined) || undefined
    const rawLimit = req.query.limit as string | undefined
    const parsed = rawLimit ? parseInt(rawLimit, 10) : 20
    const take = Math.min(Number.isNaN(parsed) ? 20 : parsed, 50)
    try {
      const data = await products.search(q.trim(), { category, limit: take })
      return res.json(data)
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Failed to search products' })
    }
  })

  server.get('/_debug/echo', (req, res) => {
    return res.json({ ok: true, ts: new Date().toISOString() })
  })

  // Health check endpoint for load balancers and monitoring
  server.get('/health', async (req, res) => {
    try {
      // Check database connection
      const prisma = app.get('PrismaService')
      await prisma.$queryRaw`SELECT 1`

      return res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
      })
    } catch (error) {
      return res.status(503).json({
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    }
  })

  const port = process.env.PORT || 4001
  // Listen on 0.0.0.0 for Docker/Railway compatibility
  await app.listen(port, '0.0.0.0')
  console.log(`🚀 Application is running on: http://0.0.0.0:${port}`)
}
bootstrap()
