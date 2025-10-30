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
const fulfillment_dto_1 = require("./dto/fulfillment.dto");
let FulfillmentController = class FulfillmentController {
    constructor(fulfillment) {
        this.fulfillment = fulfillment;
    }
    async getTracking(orderId, userId) {
        return this.fulfillment.getOrderTracking(orderId, userId);
    }
    async getSellerOpen(sellerId) {
        return this.fulfillment.getSellerOpenFulfillment(sellerId);
    }
    async getSellerStats(sellerId) {
        return this.fulfillment.getSellerStats(sellerId);
    }
    async markShipped(orderItemId, sellerId, dto) {
        return this.fulfillment.markShipped(orderItemId, sellerId, dto.carrier, dto.trackingCode, dto.note);
    }
    async markDelivered(orderItemId, sellerId, dto) {
        return this.fulfillment.markDelivered(orderItemId, sellerId, dto.proofUrl, dto.note);
    }
    async markIssue(orderItemId, sellerId, dto) {
        return this.fulfillment.markIssue(orderItemId, sellerId, dto.note);
    }
};
exports.FulfillmentController = FulfillmentController;
__decorate([
    (0, common_1.Get)('tracking/:orderId'),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FulfillmentController.prototype, "getTracking", null);
__decorate([
    (0, common_1.Get)('seller/open'),
    __param(0, (0, common_1.Query)('sellerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FulfillmentController.prototype, "getSellerOpen", null);
__decorate([
    (0, common_1.Get)('seller/stats'),
    __param(0, (0, common_1.Query)('sellerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FulfillmentController.prototype, "getSellerStats", null);
__decorate([
    (0, common_1.Patch)('seller/ship/:orderItemId'),
    __param(0, (0, common_1.Param)('orderItemId')),
    __param(1, (0, common_1.Query)('sellerId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, fulfillment_dto_1.MarkShippedDto]),
    __metadata("design:returntype", Promise)
], FulfillmentController.prototype, "markShipped", null);
__decorate([
    (0, common_1.Patch)('seller/deliver/:orderItemId'),
    __param(0, (0, common_1.Param)('orderItemId')),
    __param(1, (0, common_1.Query)('sellerId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, fulfillment_dto_1.MarkDeliveredDto]),
    __metadata("design:returntype", Promise)
], FulfillmentController.prototype, "markDelivered", null);
__decorate([
    (0, common_1.Patch)('seller/issue/:orderItemId'),
    __param(0, (0, common_1.Param)('orderItemId')),
    __param(1, (0, common_1.Query)('sellerId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, fulfillment_dto_1.MarkIssueDto]),
    __metadata("design:returntype", Promise)
], FulfillmentController.prototype, "markIssue", null);
exports.FulfillmentController = FulfillmentController = __decorate([
    (0, common_1.Controller)('fulfillment'),
    __metadata("design:paramtypes", [fulfillment_service_1.FulfillmentService])
], FulfillmentController);
//# sourceMappingURL=fulfillment.controller.js.map