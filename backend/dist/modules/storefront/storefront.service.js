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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorefrontService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let StorefrontService = class StorefrontService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStorefrontByHandle(handle) {
        const seller = await this.prisma.user.findFirst({
            where: {
                sellerHandle: handle,
                role: { in: ['SELLER', 'ADMIN'] },
            },
            select: {
                id: true,
                name: true,
                shopName: true,
                sellerHandle: true,
                shopLogoUrl: true,
                shopBannerUrl: true,
                shopBio: true,
                country: true,
                city: true,
                ratingAvg: true,
                ratingCount: true,
            },
        });
        if (!seller) {
            throw new common_1.NotFoundException('Storefront not found');
        }
        const products = await this.prisma.product.findMany({
            where: { sellerId: seller.id },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                description: true,
                price: true,
                currency: true,
                imageUrl: true,
                createdAt: true,
                inventory: {
                    select: { quantity: true },
                },
            },
        });
        return {
            seller,
            products,
        };
    }
};
exports.StorefrontService = StorefrontService;
exports.StorefrontService = StorefrontService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StorefrontService);
//# sourceMappingURL=storefront.service.js.map