
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }
  async enableShutdownHooks(app: INestApplication) {
    // Type assertion needed for Prisma v5 - beforeExit hook
    (this.$on as any)('beforeExit', async () => {
      await app.close()
    })
  }
}
