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
let AnalyticsSellerController = class AnalyticsSellerController {
    constructor(analytics) {
        this.analytics = analytics;
    }
    async summary(sellerId) {
        if (!sellerId) {
            throw new common_1.BadRequestException('sellerId query param is required');
        }
        return this.analytics.getSellerSummary(sellerId);
    }
};
exports.AnalyticsSellerController = AnalyticsSellerController;
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Query)('sellerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsSellerController.prototype, "summary", null);
exports.AnalyticsSellerController = AnalyticsSellerController = __decorate([
    (0, common_1.Controller)('analytics/seller'),
    __metadata("design:paramtypes", [analytics_seller_service_1.AnalyticsSellerService])
], AnalyticsSellerController);
//# sourceMappingURL=analytics-seller.controller.js.map