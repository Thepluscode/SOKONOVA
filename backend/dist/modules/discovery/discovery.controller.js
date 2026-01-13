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
exports.DiscoveryController = void 0;
const common_1 = require("@nestjs/common");
const discovery_service_1 = require("./discovery.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let DiscoveryController = class DiscoveryController {
    constructor(disc) {
        this.disc = disc;
    }
    async highlights() {
        return this.disc.getDiscoveryHighlights();
    }
    async personalized(userId) {
        return this.disc.getPersonalizedDiscovery(userId);
    }
    async search(q, category, minPrice, maxPrice, rating, inStock, country, sellerId, sort, page, limit) {
        return this.disc.searchProducts({
            q,
            category,
            minPrice,
            maxPrice,
            rating,
            inStock,
            country,
            sellerId,
            sort,
            page,
            limit,
        });
    }
    async byCategory(slug) {
        return this.disc.getCategoryPage(slug.toLowerCase());
    }
    async byRegion(regionSlug) {
        return this.disc.getRegionPage(regionSlug.toLowerCase());
    }
};
exports.DiscoveryController = DiscoveryController;
__decorate([
    (0, common_1.Get)('highlights'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "highlights", null);
__decorate([
    (0, common_1.Get)('personalized'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "personalized", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('minPrice')),
    __param(3, (0, common_1.Query)('maxPrice')),
    __param(4, (0, common_1.Query)('rating')),
    __param(5, (0, common_1.Query)('inStock')),
    __param(6, (0, common_1.Query)('country')),
    __param(7, (0, common_1.Query)('sellerId')),
    __param(8, (0, common_1.Query)('sort')),
    __param(9, (0, common_1.Query)('page')),
    __param(10, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('by-category/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "byCategory", null);
__decorate([
    (0, common_1.Get)('by-region/:regionSlug'),
    __param(0, (0, common_1.Param)('regionSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "byRegion", null);
exports.DiscoveryController = DiscoveryController = __decorate([
    (0, common_1.Controller)('discovery'),
    __metadata("design:paramtypes", [discovery_service_1.DiscoveryService])
], DiscoveryController);
//# sourceMappingURL=discovery.controller.js.map