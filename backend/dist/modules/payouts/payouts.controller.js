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
exports.PayoutsController = void 0;
const common_1 = require("@nestjs/common");
const payouts_service_1 = require("./payouts.service");
const mark_paid_dto_1 = require("./dto/mark-paid.dto");
let PayoutsController = class PayoutsController {
    constructor(payouts) {
        this.payouts = payouts;
    }
    async sellerPending(sellerId) {
        return this.payouts.getPendingForSeller(sellerId);
    }
    async sellerAll(sellerId) {
        return this.payouts.getAllForSeller(sellerId);
    }
    async sellerCsv(sellerId, res) {
        const csv = await this.payouts.getCsvForSeller(sellerId);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="payouts-${sellerId}.csv"`);
        res.send(csv);
    }
    async markPaid(dto) {
        return this.payouts.markPaidOut(dto.orderItemIds, dto.batchId);
    }
    async adminSummary() {
        return this.payouts.getAdminSummary();
    }
};
exports.PayoutsController = PayoutsController;
__decorate([
    (0, common_1.Get)('seller/pending'),
    __param(0, (0, common_1.Query)('sellerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayoutsController.prototype, "sellerPending", null);
__decorate([
    (0, common_1.Get)('seller/all'),
    __param(0, (0, common_1.Query)('sellerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayoutsController.prototype, "sellerAll", null);
__decorate([
    (0, common_1.Get)('seller/csv'),
    __param(0, (0, common_1.Query)('sellerId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayoutsController.prototype, "sellerCsv", null);
__decorate([
    (0, common_1.Post)('admin/mark-paid'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mark_paid_dto_1.MarkPaidDto]),
    __metadata("design:returntype", Promise)
], PayoutsController.prototype, "markPaid", null);
__decorate([
    (0, common_1.Get)('admin/summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PayoutsController.prototype, "adminSummary", null);
exports.PayoutsController = PayoutsController = __decorate([
    (0, common_1.Controller)('payouts'),
    __metadata("design:paramtypes", [payouts_service_1.PayoutsService])
], PayoutsController);
//# sourceMappingURL=payouts.controller.js.map