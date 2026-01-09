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
exports.SellerApplicationsController = void 0;
const common_1 = require("@nestjs/common");
const seller_applications_service_1 = require("./seller-applications.service");
const apply_dto_1 = require("./dto/apply.dto");
const moderate_dto_1 = require("./dto/moderate.dto");
let SellerApplicationsController = class SellerApplicationsController {
    constructor(svc) {
        this.svc = svc;
    }
    async apply(body) {
        return this.svc.apply(body);
    }
    async activateInstant(body) {
        return this.svc.applyAndActivateInstantly(body);
    }
    async mine(userId) {
        return this.svc.getMine(userId);
    }
    async pending(adminId) {
        return this.svc.listPending(adminId);
    }
    async approve(appId, body) {
        return this.svc.approve(appId, body);
    }
    async reject(appId, body) {
        return this.svc.reject(appId, body);
    }
};
exports.SellerApplicationsController = SellerApplicationsController;
__decorate([
    (0, common_1.Post)('apply'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [apply_dto_1.ApplyDto]),
    __metadata("design:returntype", Promise)
], SellerApplicationsController.prototype, "apply", null);
__decorate([
    (0, common_1.Post)('activate-instant'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [apply_dto_1.ApplyDto]),
    __metadata("design:returntype", Promise)
], SellerApplicationsController.prototype, "activateInstant", null);
__decorate([
    (0, common_1.Get)('mine'),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SellerApplicationsController.prototype, "mine", null);
__decorate([
    (0, common_1.Get)('pending'),
    __param(0, (0, common_1.Query)('adminId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SellerApplicationsController.prototype, "pending", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, moderate_dto_1.ModerateDto]),
    __metadata("design:returntype", Promise)
], SellerApplicationsController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, moderate_dto_1.ModerateDto]),
    __metadata("design:returntype", Promise)
], SellerApplicationsController.prototype, "reject", null);
exports.SellerApplicationsController = SellerApplicationsController = __decorate([
    (0, common_1.Controller)('seller-applications'),
    __metadata("design:paramtypes", [seller_applications_service_1.SellerApplicationsService])
], SellerApplicationsController);
//# sourceMappingURL=seller-applications.controller.js.map