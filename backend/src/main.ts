// IMPORTANT: Import Sentry instrumentation FIRST before any other imports
import './instrument';

import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app.module'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'
import { SentryExceptionFilter } from './common/filters/sentry-exception.filter'

const morgan = require('morgan')
const cookieParser = require('cookie-parser')

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Security
  app.use(helmet())
  app.use(morgan('dev'))
  app.use(cookieParser())

  // CORS
  app.enableCors({
    origin: [/localhost:3000$/, /localhost:54112$/, /localhost:\d+$/],
    credentials: true,
  })

  // Global pipes and filters
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.useGlobalFilters(new SentryExceptionFilter())

  const port = process.env.PORT || 4001
  // Listen on 0.0.0.0 for Docker/Railway compatibility
  await app.listen(port, '0.0.0.0')
  console.log(`🚀 Application is running on: http://0.0.0.0:${port}`)
}
bootstrap()