
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  webhook: any
  webhookDelivery: any
  async onModuleInit() {
    this.$use(async (params, next) => {
      if (params.model === 'Product') {
        const action = params.action
        const shouldFilter =
          action === 'findUnique' ||
          action === 'findFirst' ||
          action === 'findMany' ||
          action === 'count' ||
          action === 'aggregate' ||
          action === 'groupBy'

        if (shouldFilter) {
          params.args = params.args || {}
          params.args.where = params.args.where || {}

          if (params.args.where.isActive === undefined) {
            params.args.where.isActive = true
          }

          if (action === 'findUnique') {
            params.action = 'findFirst'
          }
        }
      }

      return next(params)
    })

    await this.$connect()
  }
  async enableShutdownHooks(app: INestApplication) {
    // Type assertion needed for Prisma v5 - beforeExit hook
    (this.$on as any)('beforeExit', async () => {
      await app.close()
    })
  }
}
