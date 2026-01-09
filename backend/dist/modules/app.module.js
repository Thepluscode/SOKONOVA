"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const auth_module_1 = require("./auth/auth.module");
const products_module_1 = require("./products/products.module");
const cart_module_1 = require("./cart/cart.module");
const orders_module_1 = require("./orders/orders.module");
const payments_module_1 = require("./payments/payments.module");
const users_module_1 = require("./users/users.module");
const payouts_module_1 = require("./payouts/payouts.module");
const fulfillment_module_1 = require("./fulfillment/fulfillment.module");
const seller_applications_module_1 = require("./seller-applications/seller-applications.module");
const analytics_seller_module_1 = require("./analytics-seller/analytics-seller.module");
const discovery_module_1 = require("./discovery/discovery.module");
const trust_module_1 = require("./trust/trust.module");
const product_views_module_1 = require("./product-views/product-views.module");
const chat_module_1 = require("./chat/chat.module");
const social_module_1 = require("./social/social.module");
const sponsored_placements_module_1 = require("./sponsored-placements/sponsored-placements.module");
const seller_services_module_1 = require("./seller-services/seller-services.module");
const subscriptions_module_1 = require("./subscriptions/subscriptions.module");
const admin_control_tower_module_1 = require("./admin-control-tower/admin-control-tower.module");
const impact_inclusion_module_1 = require("./impact-inclusion/impact-inclusion.module");
const api_partner_platform_module_1 = require("./api-partner-platform/api-partner-platform.module");
const wishlist_module_1 = require("./wishlist/wishlist.module");
const teams_module_1 = require("./teams/teams.module");
const audit_logs_module_1 = require("./audit-logs/audit-logs.module");
const health_module_1 = require("../health/health.module");
const metrics_module_1 = require("../metrics/metrics.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            health_module_1.HealthModule,
            metrics_module_1.MetricsModule,
            auth_module_1.AuthModule,
            products_module_1.ProductsModule,
            cart_module_1.CartModule,
            wishlist_module_1.WishlistModule,
            orders_module_1.OrdersModule,
            payments_module_1.PaymentsModule,
            users_module_1.UsersModule,
            payouts_module_1.PayoutsModule,
            fulfillment_module_1.FulfillmentModule,
            seller_applications_module_1.SellerApplicationsModule,
            analytics_seller_module_1.AnalyticsSellerModule,
            discovery_module_1.DiscoveryModule,
            trust_module_1.TrustModule,
            product_views_module_1.ProductViewsModule,
            chat_module_1.ChatModule,
            social_module_1.SocialModule,
            sponsored_placements_module_1.SponsoredPlacementsModule,
            seller_services_module_1.SellerServicesModule,
            subscriptions_module_1.SubscriptionsModule,
            admin_control_tower_module_1.AdminControlTowerModule,
            impact_inclusion_module_1.ImpactInclusionModule,
            api_partner_platform_module_1.ApiPartnerPlatformModule,
            teams_module_1.TeamsModule,
            audit_logs_module_1.AuditLogsModule,
        ],
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map