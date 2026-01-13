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
exports.FulfillmentController = void 0;
const common_1 = require("@nestjs/common");
const fulfillment_service_1 = require("./fulfillment.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let FulfillmentController = class FulfillmentController {
    constructor(fulfillmentService) {
        this.fulfillmentService = fulfillmentService;
    }
    async getDeliveryEstimate(productId, location) {
        return this.fulfillmentService.calculateDeliveryEstimate(productId, location);
    }
    async getShippingOptions(data) {
        return this.fulfillmentService.getShippingOptions(data.items, data.location);
    }
    async trackShipment(trackingNumber) {
        return this.fulfillmentService.trackShipment(trackingNumber);
    }
    async getDeliveryPerformance(sellerId) {
        return this.fulfillmentService.getDeliveryPerformanceMetrics(sellerId);
    }
    async getOrderTracking(orderId, userId) {
        return this.fulfillmentService.getOrderTracking(orderId, userId);
    }
    async getSellerOpenFulfillment(sellerId) {
        return this.fulfillmentService.getSellerOpenFulfillment(sellerId);
    }
    async getSellerStats(sellerId) {
        return this.fulfillmentService.getSellerStats(sellerId);
    }
    async markShipped(orderItemId, sellerId, data) {
        return this.fulfillmentService.markShipped(orderItemId, sellerId, data.carrier, data.trackingCode, data.note);
    }
    async markDelivered(orderItemId, sellerId, data) {
        return this.fulfillmentService.markDelivered(orderItemId, sellerId, data.proofUrl, data.note);
    }
    async markIssue(orderItemId, sellerId, data) {
        return this.fulfillmentService.markIssue(orderItemId, sellerId, data.note);
    }
    async getDeliveryPromise(productId, location) {
        return this.fulfillmentService.calculateDeliveryPromise(productId, location);
    }
    async getExceptionStatus(orderItemId) {
        return this.fulfillmentService.getExceptionStatus(orderItemId);
    }
    async getMicroFulfillmentMetrics(sellerId) {
        return this.fulfillmentService.getMicroFulfillmentMetrics(sellerId);
    }
    async optInToMicroFulfillment(sellerId, data) {
        return this.fulfillmentService.optInToMicroFulfillment(sellerId, data.partnerId);
    }
    async getFulfillmentPartners(sellerId) {
        return this.fulfillmentService.getFulfillmentPartners(sellerId);
    }
};
exports.FulfillmentController = FulfillmentController;
__decorate([
    (0, common_1.Get)('products/:productId/delivery-estimate'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Query)('location')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FulfillmentController.prototype, "getDeliveryEstimate", null);
__decorate([
    (0, common_1.Post)('shipping-options'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FulfillmentController.prototype, "getShippingOptions", null);
__decorate([
    (0, common_1.Get)('track/:trackingNumber'),
    __param(0, (0, common_1.Param)('trackingNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FulfillmentController.prototype, "trackShipment", null);
__decorate([
    (0, common_1.Get)('sellers/:sellerId/delivery-performance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('sellerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FulfillmentController.prototype, "getDeliveryPerformance", null);
__decorate([
    (0, common_1.Get)('tracking/:orderId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FulfillmentController.prototype, "getOrderTracking", null);
__decorate([
    (0, common_1.Get)('seller/open'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FulfillmentController.prototype, "getSellerOpenFulfillment", null);
__decorate([
    (0, common_1.Get)('seller/stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FulfillmentController.prototype, "getSellerStats", null);
__decorate([
    (0, common_1.Patch)('seller/ship/:orderItemId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER),
    __param(0, (0, common_1.Param)('orderItemId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentController.prototype, "markShipped", null);
__decorate([
    (0, common_1.Patch)('seller/deliver/:orderItemId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER),
    __param(0, (0, common_1.Param)('orderItemId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentController.prototype, "markDelivered", null);
__decorate([
    (0, common_1.Patch)('seller/issue/:orderItemId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER),
    __param(0, (0, common_1.Param)('orderItemId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentController.prototype, "markIssue", null);
__decorate([
    (0, common_1.Get)('delivery-promise/:productId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Query)('location')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FulfillmentController.prototype, "getDeliveryPromise", null);
__decorate([
    (0, common_1.Get)('exceptions/:orderItemId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('orderItemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FulfillmentController.prototype, "getExceptionStatus", null);
__decorate([
    (0, common_1.Get)('micro-fulfillment/:sellerId/metrics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('sellerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FulfillmentController.prototype, "getMicroFulfillmentMetrics", null);
__decorate([
    (0, common_1.Post)('micro-fulfillment/:sellerId/opt-in'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER),
    __param(0, (0, common_1.Param)('sellerId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentController.prototype, "optInToMicroFulfillment", null);
__decorate([
    (0, common_1.Get)('micro-fulfillment/:sellerId/partners'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER),
    __param(0, (0, common_1.Param)('sellerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FulfillmentController.prototype, "getFulfillmentPartners", null);
exports.FulfillmentController = FulfillmentController = __decorate([
    (0, common_1.Controller)('fulfillment'),
    __metadata("design:paramtypes", [fulfillment_service_1.FulfillmentService])
], FulfillmentController);
//# sourceMappingURL=fulfillment.controller.js.map