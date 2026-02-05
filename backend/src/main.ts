// IMPORTANT: Import Sentry instrumentation FIRST before any other imports
import './instrument';

import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app.module'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'
import { SentryExceptionFilter } from './common/filters/sentry-exception.filter'
import { DiscoveryService } from './modules/discovery/discovery.service'
import { ProductsService } from './modules/products/products.service'

const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // CORS - Must be enabled BEFORE Helmet
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:8081',  // Expo web
      'http://localhost:54112',
      'https://sokonova-frontend-production.up.railway.app',
      'https://sokonova-backend-production.up.railway.app',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: true,
  })

  // Security - Configure Helmet to not interfere with CORS
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  }))
  app.use(morgan('dev'))
  app.use(cookieParser())
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

  // Explicit route fallbacks to avoid routing/caching mismatches
  const discovery = app.get(DiscoveryService)
  const products = app.get(ProductsService)

  const server = app.getHttpAdapter().getInstance()

  server.get('/discovery/social-proof', async (req, res) => {
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

  const port = process.env.PORT || 4001
  // Listen on 0.0.0.0 for Docker/Railway compatibility
  await app.listen(port, '0.0.0.0')
  console.log(`🚀 Application is running on: http://0.0.0.0:${port}`)
}
bootstrap()
