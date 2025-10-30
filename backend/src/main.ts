
import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app.module'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'

const morgan = require('morgan')
const cookieParser = require('cookie-parser')

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(helmet())
  app.use(morgan('dev'))
  app.use(cookieParser())
  app.enableCors({
    origin: [/localhost:3000$/, /localhost:54112$/, /localhost:\d+$/],
    credentials: true,
  })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  await app.listen(process.env.PORT || 4000)
}
bootstrap()
