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
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma.module");
const users_module_1 = require("./users/users.module");
const products_module_1 = require("./products/products.module");
const cart_module_1 = require("./cart/cart.module");
const orders_module_1 = require("./orders/orders.module");
const payments_module_1 = require("./payments/payments.module");
const payouts_module_1 = require("./payouts/payouts.module");
const fulfillment_module_1 = require("./fulfillment/fulfillment.module");
const seller_applications_module_1 = require("./seller-applications/seller-applications.module");
const disputes_module_1 = require("./disputes/disputes.module");
const storefront_module_1 = require("./storefront/storefront.module");
const reviews_module_1 = require("./reviews/reviews.module");
const discovery_module_1 = require("./discovery/discovery.module");
const analytics_seller_module_1 = require("./analytics-seller/analytics-seller.module");
const analytics_rollup_module_1 = require("./analytics-rollup/analytics-rollup.module");
const notifications_module_1 = require("./notifications/notifications.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            users_module_1.UsersModule,
            products_module_1.ProductsModule,
            cart_module_1.CartModule,
            orders_module_1.OrdersModule,
            payments_module_1.PaymentsModule,
            payouts_module_1.PayoutsModule,
            fulfillment_module_1.FulfillmentModule,
            seller_applications_module_1.SellerApplicationsModule,
            disputes_module_1.DisputesModule,
            storefront_module_1.StorefrontModule,
            reviews_module_1.ReviewsModule,
            discovery_module_1.DiscoveryModule,
            analytics_seller_module_1.AnalyticsSellerModule,
            analytics_rollup_module_1.AnalyticsRollupModule,
            notifications_module_1.NotificationsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map