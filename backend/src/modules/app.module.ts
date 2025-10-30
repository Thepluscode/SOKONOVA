
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma.module'
import { UsersModule } from './users/users.module'
import { ProductsModule } from './products/products.module'
import { CartModule } from './cart/cart.module'
import { OrdersModule } from './orders/orders.module'
import { PaymentsModule } from './payments/payments.module'
import { PayoutsModule } from './payouts/payouts.module'
import { FulfillmentModule } from './fulfillment/fulfillment.module'
import { SellerApplicationsModule } from './seller-applications/seller-applications.module'
import { DisputesModule } from './disputes/disputes.module'
import { StorefrontModule } from './storefront/storefront.module'
import { ReviewsModule } from './reviews/reviews.module'
import { DiscoveryModule } from './discovery/discovery.module'
import { AnalyticsSellerModule } from './analytics-seller/analytics-seller.module'
import { AnalyticsRollupModule } from './analytics-rollup/analytics-rollup.module'
import { NotificationsModule } from './notifications/notifications.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
    PayoutsModule,
    FulfillmentModule,
    SellerApplicationsModule,
    DisputesModule,
    StorefrontModule,
    ReviewsModule,
    DiscoveryModule,
    AnalyticsSellerModule,
    AnalyticsRollupModule,
    NotificationsModule,
  ],
})
export class AppModule {}
