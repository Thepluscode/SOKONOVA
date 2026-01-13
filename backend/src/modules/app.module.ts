import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { PrismaModule } from './prisma.module';
// import { RedisService } from './redis.service'; // Temporarily disabled for MVP
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { UsersModule } from './users/users.module';
import { PayoutsModule } from './payouts/payouts.module';
import { FulfillmentModule } from './fulfillment/fulfillment.module';
import { SellerApplicationsModule } from './seller-applications/seller-applications.module';
import { AnalyticsSellerModule } from './analytics-seller/analytics-seller.module';
import { DiscoveryModule } from './discovery/discovery.module';
import { TrustModule } from './trust/trust.module';
import { ProductViewsModule } from './product-views/product-views.module';
import { ChatModule } from './chat/chat.module';
import { SocialModule } from './social/social.module';
import { SponsoredPlacementsModule } from './sponsored-placements/sponsored-placements.module';
import { SellerServicesModule } from './seller-services/seller-services.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { AdminControlTowerModule } from './admin-control-tower/admin-control-tower.module';
import { AdminSettingsModule } from './admin-settings/admin-settings.module';
import { ImpactInclusionModule } from './impact-inclusion/impact-inclusion.module';
import { ApiPartnerPlatformModule } from './api-partner-platform/api-partner-platform.module';
import { WishlistModule } from './wishlist/wishlist.module';
// Security & Access Control
import { TeamsModule } from './teams/teams.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
// Observability
import { HealthModule } from '../health/health.module';
import { MetricsModule } from '../metrics/metrics.module';
import { SentryExceptionFilter } from '../common/filters/sentry-exception.filter';

@Module({
  imports: [
    // Data Layer (must be first - @Global() makes PrismaService available everywhere)
    PrismaModule,
    // Observability
    HealthModule,
    MetricsModule,
    // Core Modules
    AuthModule,
    ProductsModule,
    CartModule,
    WishlistModule,
    OrdersModule,
    PaymentsModule,
    UsersModule,
    PayoutsModule,
    FulfillmentModule,
    SellerApplicationsModule,
    AnalyticsSellerModule,
    DiscoveryModule,
    TrustModule,
    ProductViewsModule,
    ChatModule,
    SocialModule,
    SponsoredPlacementsModule,
    SellerServicesModule,
    SubscriptionsModule,
    AdminControlTowerModule,
    AdminSettingsModule,
    ImpactInclusionModule,
    ApiPartnerPlatformModule,
    // Security & Access Control
    TeamsModule,
    AuditLogsModule,
  ],
})
export class AppModule { }