
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  webhook: any
  webhookDelivery: any
  async onModuleInit() {
    const extended = this.$extends({
      query: {
        product: {
          $allOperations({ operation, args, query }) {
            const shouldFilter =
              operation === 'findFirst' ||
              operation === 'findMany' ||
              operation === 'count' ||
              operation === 'aggregate' ||
              operation === 'groupBy'

            if (!shouldFilter) {
              return query(args)
            }

            const nextArgs = {
              ...args,
              where: {
                ...(args as any)?.where,
              },
            } as typeof args

            if ((nextArgs as any).where?.isActive === undefined) {
              ;(nextArgs as any).where.isActive = true
            }

            return query(nextArgs)
          },
        },
      },
    })

    Object.assign(this, extended)
    await this.$connect()
  }
  async enableShutdownHooks(app: INestApplication) {
    // Type assertion needed for Prisma v5 - beforeExit hook
    (this.$on as any)('beforeExit', async () => {
      await app.close()
    })
  }
}
