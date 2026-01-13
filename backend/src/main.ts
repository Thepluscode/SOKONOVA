// IMPORTANT: Import Sentry instrumentation FIRST before any other imports
import './instrument';

import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app.module'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'
import { SentryExceptionFilter } from './common/filters/sentry-exception.filter'
import express from 'express'

const morgan = require('morgan')
const cookieParser = require('cookie-parser')

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // CORS - Must be enabled BEFORE Helmet
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
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

  const port = process.env.PORT || 4001
  // Listen on 0.0.0.0 for Docker/Railway compatibility
  await app.listen(port, '0.0.0.0')
  console.log(`🚀 Application is running on: http://0.0.0.0:${port}`)
}
bootstrap()
