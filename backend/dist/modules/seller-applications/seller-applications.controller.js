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
const client_1 = require("@prisma/client");
const seller_applications_service_1 = require("./seller-applications.service");
const apply_dto_1 = require("./dto/apply.dto");
const moderate_dto_1 = require("./dto/moderate.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let SellerApplicationsController = class SellerApplicationsController {
    constructor(svc) {
        this.svc = svc;
    }
    async apply(body, user) {
        return this.svc.apply({ ...body, userId: user.id });
    }
    async activateInstant(body, user) {
        return this.svc.applyAndActivateInstantly({ ...body, userId: user.id });
    }
    async mine(user) {
        return this.svc.getMine(user.id);
    }
    async pending(user) {
        return this.svc.listPending(user.id);
    }
    async approve(appId, body, user) {
        return this.svc.approve(appId, { ...body, adminId: user.id });
    }
    async reject(appId, body, user) {
        return this.svc.reject(appId, { ...body, adminId: user.id });
    }
};
exports.SellerApplicationsController = SellerApplicationsController;
__decorate([
    (0, common_1.Post)('apply'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [apply_dto_1.ApplyDto, Object]),
    __metadata("design:returntype", Promise)
], SellerApplicationsController.prototype, "apply", null);
__decorate([
    (0, common_1.Post)('activate-instant'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [apply_dto_1.ApplyDto, Object]),
    __metadata("design:returntype", Promise)
], SellerApplicationsController.prototype, "activateInstant", null);
__decorate([
    (0, common_1.Get)('mine'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SellerApplicationsController.prototype, "mine", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SellerApplicationsController.prototype, "pending", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, moderate_dto_1.ModerateDto, Object]),
    __metadata("design:returntype", Promise)
], SellerApplicationsController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, moderate_dto_1.ModerateDto, Object]),
    __metadata("design:returntype", Promise)
], SellerApplicationsController.prototype, "reject", null);
exports.SellerApplicationsController = SellerApplicationsController = __decorate([
    (0, common_1.Controller)('seller-applications'),
    __metadata("design:paramtypes", [seller_applications_service_1.SellerApplicationsService])
], SellerApplicationsController);
//# sourceMappingURL=seller-applications.controller.js.map