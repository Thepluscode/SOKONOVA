"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsSellerController = void 0;
const common_1 = require("@nestjs/common");
const analytics_seller_service_1 = require("./analytics-seller.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let AnalyticsSellerController = class AnalyticsSellerController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getProfitability(sellerId) {
        return this.analyticsService.getProfitabilityMetrics(sellerId);
    }
    async getOrdersWithFees(sellerId, limit) {
        const limitNum = parseInt(limit) || 50;
        return this.analyticsService.getOrdersWithFeeBreakdown(sellerId, limitNum);
    }
    async simulatePricing(sellerId, scenario) {
        return this.analyticsService.simulatePricingScenario(sellerId, scenario);
    }
    async getInventoryVelocity(sellerId) {
        return this.analyticsService.getInventoryVelocityMetrics(sellerId);
    }
    async getBuyerCohorts(sellerId) {
        return this.analyticsService.getBuyerCohorts(sellerId);
    }
    async getBuyerSegments(sellerId) {
        return this.analyticsService.getBuyerSegments(sellerId);
    }
    async generateDiscountCampaign(sellerId, segmentId, discountData) {
        return this.analyticsService.generateDiscountCampaign(sellerId, segmentId, discountData);
    }
    async getInventoryRiskAnalysis(sellerId) {
        return this.analyticsService.getInventoryRiskAnalysis(sellerId);
    }
    async getAgingInventory(sellerId) {
        return this.analyticsService.getAgingInventory(sellerId);
    }
    async getStockoutPredictions(sellerId) {
        return this.analyticsService.getStockoutPredictions(sellerId);
    }
    async generateInventoryRecommendations(sellerId, data) {
        return this.analyticsService.generateInventoryRecommendations(sellerId, data.productId);
    }
};
exports.AnalyticsSellerController = AnalyticsSellerController;
__decorate([
    (0, common_1.Get)(':sellerId/profitability'),
    __param(0, (0, common_1.Param)('sellerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsSellerController.prototype, "getProfitability", null);
__decorate([
    (0, common_1.Get)(':sellerId/orders'),
    __param(0, (0, common_1.Param)('sellerId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsSellerController.prototype, "getOrdersWithFees", null);
__decorate([
    (0, common_1.Post)(':sellerId/simulate-pricing'),
    __param(0, (0, common_1.Param)('sellerId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsSellerController.prototype, "simulatePricing", null);
__decorate([
    (0, common_1.Get)(':sellerId/inventory-velocity'),
    __param(0, (0, common_1.Param)('sellerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsSellerController.prototype, "getInventoryVelocity", null);
__decorate([
    (0, common_1.Get)(':sellerId/buyer-cohorts'),
    __param(0, (0, common_1.Param)('sellerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsSellerController.prototype, "getBuyerCohorts", null);
__decorate([
    (0, common_1.Get)(':sellerId/buyer-segments'),
    __param(0, (0, common_1.Param)('sellerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsSellerController.prototype, "getBuyerSegments", null);
__decorate([
    (0, common_1.Post)(':sellerId/segments/:segmentId/discount-campaign'),
    __param(0, (0, common_1.Param)('sellerId')),
    __param(1, (0, common_1.Param)('segmentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsSellerController.prototype, "generateDiscountCampaign", null);
__decorate([
    (0, common_1.Get)(':sellerId/inventory-risk'),
    __param(0, (0, common_1.Param)('sellerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsSellerController.prototype, "getInventoryRiskAnalysis", null);
__decorate([
    (0, common_1.Get)(':sellerId/aging-inventory'),
    __param(0, (0, common_1.Param)('sellerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsSellerController.prototype, "getAgingInventory", null);
__decorate([
    (0, common_1.Get)(':sellerId/stockout-predictions'),
    __param(0, (0, common_1.Param)('sellerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsSellerController.prototype, "getStockoutPredictions", null);
__decorate([
    (0, common_1.Post)(':sellerId/inventory-recommendations'),
    __param(0, (0, common_1.Param)('sellerId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsSellerController.prototype, "generateInventoryRecommendations", null);
exports.AnalyticsSellerController = AnalyticsSellerController = __decorate([
    (0, common_1.Controller)('analytics/seller'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER, client_1.Role.ADMIN),
    __metadata("design:paramtypes", [analytics_seller_service_1.AnalyticsSellerService])
], AnalyticsSellerController);
//# sourceMappingURL=analytics-seller.controller.js.map