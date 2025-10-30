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
exports.DiscoveryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const FEATURED_CATEGORIES = [
    { slug: "fashion", label: "Fashion & Style" },
    { slug: "beauty", label: "Beauty & Personal Care" },
    { slug: "home", label: "Home & Living" },
    { slug: "electronics", label: "Electronics & Gadgets" },
];
const FEATURED_REGIONS = [
    { slug: "lagos", label: "Lagos, Nigeria", city: "Lagos" },
    { slug: "nairobi", label: "Nairobi, Kenya", city: "Nairobi" },
    { slug: "accra", label: "Accra, Ghana", city: "Accra" },
];
let DiscoveryService = class DiscoveryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getHighlights() {
        const categoriesWithSellers = await Promise.all(FEATURED_CATEGORIES.map(async (cat) => {
            const sellers = await this.topSellersForCategory(cat.slug, 4);
            return {
                ...cat,
                sellers,
            };
        }));
        const regionsWithSellers = await Promise.all(FEATURED_REGIONS.map(async (reg) => {
            const sellers = await this.topSellersForRegion(reg.city, 4);
            return {
                ...reg,
                sellers,
            };
        }));
        return {
            categories: categoriesWithSellers,
            regions: regionsWithSellers,
        };
    }
    async getCategoryPage(slug) {
        const sellers = await this.topSellersForCategory(slug, 12);
        const products = await this.prisma.product.findMany({
            where: { category: slug },
            orderBy: { createdAt: 'desc' },
            take: 24,
            select: {
                id: true,
                title: true,
                price: true,
                currency: true,
                imageUrl: true,
                seller: {
                    select: {
                        sellerHandle: true,
                        shopName: true,
                        city: true,
                        country: true,
                        ratingAvg: true,
                        ratingCount: true,
                    },
                },
            },
        });
        return {
            slug,
            sellers,
            products,
        };
    }
    async getRegionPage(regionSlug) {
        const regionDef = FEATURED_REGIONS.find((r) => r.slug.toLowerCase() === regionSlug.toLowerCase());
        if (!regionDef) {
            return {
                region: {
                    slug: regionSlug,
                    label: regionSlug,
                },
                sellers: [],
                products: [],
            };
        }
        const city = regionDef.city;
        const sellers = await this.topSellersForRegion(city, 12);
        const products = await this.prisma.product.findMany({
            where: {
                seller: {
                    city: city,
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 24,
            select: {
                id: true,
                title: true,
                price: true,
                currency: true,
                imageUrl: true,
                category: true,
                seller: {
                    select: {
                        sellerHandle: true,
                        shopName: true,
                        city: true,
                        country: true,
                        ratingAvg: true,
                        ratingCount: true,
                    },
                },
            },
        });
        return {
            region: regionDef,
            sellers,
            products,
        };
    }
    async topSellersForCategory(categorySlug, limit) {
        const rows = await this.prisma.product.findMany({
            where: { category: categorySlug },
            select: {
                sellerId: true,
                seller: {
                    select: {
                        id: true,
                        sellerHandle: true,
                        shopName: true,
                        shopLogoUrl: true,
                        city: true,
                        country: true,
                        ratingAvg: true,
                        ratingCount: true,
                    },
                },
            },
            take: 200,
        });
        const bySeller = {};
        for (const row of rows) {
            if (!bySeller[row.sellerId]) {
                bySeller[row.sellerId] = row.seller;
            }
        }
        const sellers = Object.values(bySeller)
            .sort((a, b) => {
            var _a, _b, _c, _d;
            const ar = (_a = a.ratingAvg) !== null && _a !== void 0 ? _a : 0;
            const br = (_b = b.ratingAvg) !== null && _b !== void 0 ? _b : 0;
            if (br !== ar)
                return br - ar;
            const ac = (_c = a.ratingCount) !== null && _c !== void 0 ? _c : 0;
            const bc = (_d = b.ratingCount) !== null && _d !== void 0 ? _d : 0;
            return bc - ac;
        })
            .slice(0, limit);
        return sellers;
    }
    async topSellersForRegion(city, limit) {
        const sellers = await this.prisma.user.findMany({
            where: {
                role: { in: ['SELLER', 'ADMIN'] },
                city: city,
            },
            select: {
                id: true,
                sellerHandle: true,
                shopName: true,
                shopLogoUrl: true,
                city: true,
                country: true,
                ratingAvg: true,
                ratingCount: true,
            },
            orderBy: [
                { ratingAvg: 'desc' },
                { ratingCount: 'desc' },
                { createdAt: 'asc' },
            ],
            take: limit,
        });
        return sellers;
    }
};
exports.DiscoveryService = DiscoveryService;
exports.DiscoveryService = DiscoveryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DiscoveryService);
//# sourceMappingURL=discovery.service.js.map