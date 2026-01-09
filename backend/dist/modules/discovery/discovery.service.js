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
let DiscoveryService = class DiscoveryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDiscoveryHighlights() {
        const trendingProducts = await this.prisma.product.findMany({
            take: 10,
            orderBy: {
                views: {
                    _count: 'desc',
                },
            },
            include: {
                seller: {
                    select: {
                        shopName: true,
                        ratingAvg: true,
                    },
                },
                _count: {
                    select: {
                        views: true,
                    },
                },
            },
        });
        const featuredSellers = await this.prisma.user.findMany({
            where: {
                role: 'SELLER',
                products: {
                    some: {},
                },
            },
            take: 5,
            orderBy: {
                ratingAvg: 'desc',
            },
            include: {
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        });
        const newArrivals = await this.prisma.product.findMany({
            take: 10,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                seller: {
                    select: {
                        shopName: true,
                    },
                },
            },
        });
        const communityStories = await this.prisma.communityStory.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        name: true,
                        shopName: true,
                    },
                },
                product: {
                    select: {
                        title: true,
                        imageUrl: true,
                    },
                },
            },
        });
        return {
            trendingProducts,
            featuredSellers,
            newArrivals,
            communityStories,
        };
    }
    async getProductsByCategory(slug) {
        const products = await this.prisma.product.findMany({
            where: {
                category: slug,
            },
            include: {
                seller: {
                    select: {
                        shopName: true,
                        ratingAvg: true,
                    },
                },
                _count: {
                    select: {
                        views: true,
                    },
                },
            },
            orderBy: {
                views: {
                    _count: 'desc',
                },
            },
        });
        return products;
    }
    async getProductsByRegion(regionSlug) {
        const products = await this.prisma.product.findMany({
            where: {
                seller: {
                    country: regionSlug,
                },
            },
            include: {
                seller: {
                    select: {
                        shopName: true,
                        country: true,
                        ratingAvg: true,
                    },
                },
                _count: {
                    select: {
                        views: true,
                    },
                },
            },
            orderBy: {
                views: {
                    _count: 'desc',
                },
            },
        });
        return products;
    }
    async searchProducts(query) {
        const products = await this.prisma.product.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        description: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        category: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
            include: {
                seller: {
                    select: {
                        shopName: true,
                        ratingAvg: true,
                    },
                },
                _count: {
                    select: {
                        views: true,
                    },
                },
            },
            orderBy: {
                views: {
                    _count: 'desc',
                },
            },
        });
        return products;
    }
    async getCategoryPage(slug) {
        const topSellers = await this.prisma.user.findMany({
            where: {
                role: 'SELLER',
                products: {
                    some: {
                        category: slug,
                    },
                },
            },
            orderBy: [
                { ratingAvg: 'desc' },
                { ratingCount: 'desc' },
            ],
            include: {
                _count: {
                    select: {
                        products: {
                            where: {
                                category: slug,
                            },
                        },
                    },
                },
            },
            take: 12,
        });
        const products = await this.prisma.product.findMany({
            where: {
                category: slug,
            },
            include: {
                seller: {
                    select: {
                        shopName: true,
                        ratingAvg: true,
                        ratingCount: true,
                    },
                },
                _count: {
                    select: {
                        views: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 24,
        });
        return {
            sellers: topSellers,
            products,
        };
    }
    async getRegionPage(regionSlug) {
        const topSellers = await this.prisma.user.findMany({
            where: {
                role: 'SELLER',
                country: regionSlug,
                products: {
                    some: {},
                },
            },
            orderBy: [
                { ratingAvg: 'desc' },
                { ratingCount: 'desc' },
            ],
            include: {
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
            take: 12,
        });
        const products = await this.prisma.product.findMany({
            where: {
                seller: {
                    country: regionSlug,
                },
            },
            include: {
                seller: {
                    select: {
                        shopName: true,
                        ratingAvg: true,
                        ratingCount: true,
                        country: true,
                    },
                },
                _count: {
                    select: {
                        views: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 24,
        });
        return {
            sellers: topSellers,
            products,
        };
    }
    async getPersonalizedDiscovery(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                city: true,
                country: true,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const userProductViews = await this.prisma.productView.findMany({
            where: { userId },
            orderBy: { timestamp: 'desc' },
            take: 20,
        });
        const viewedProductIds = userProductViews.map(view => view.productId);
        const viewedProducts = await this.prisma.product.findMany({
            where: { id: { in: viewedProductIds } },
            select: { category: true },
        });
        const categoryCount = {};
        viewedProducts.forEach(product => {
            if (product.category) {
                categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
            }
        });
        const topCategories = Object.entries(categoryCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([category]) => category);
        const recommendedForYou = await Promise.all(topCategories.map(async (category) => {
            const products = await this.prisma.product.findMany({
                where: {
                    category,
                    id: { notIn: viewedProductIds },
                },
                include: {
                    seller: {
                        select: {
                            shopName: true,
                            ratingAvg: true,
                            ratingCount: true,
                        },
                    },
                    _count: {
                        select: {
                            views: true,
                        },
                    },
                },
                orderBy: [
                    { seller: { ratingAvg: 'desc' } },
                    { seller: { ratingCount: 'desc' } },
                    { views: { _count: 'desc' } },
                ],
                take: 10,
            });
            return { category, products };
        }));
        const recentCityViews = await this.prisma.productView.findMany({
            where: {
                product: {
                    seller: {
                        city: user.city,
                    },
                },
            },
            orderBy: { timestamp: 'desc' },
            take: 50,
        });
        const cityViewedProductIds = recentCityViews.map(view => view.productId);
        const cityViewedProducts = await this.prisma.product.findMany({
            where: { id: { in: cityViewedProductIds } },
            select: { category: true },
        });
        const cityCategoryCount = {};
        cityViewedProducts.forEach(product => {
            if (product.category) {
                cityCategoryCount[product.category] = (cityCategoryCount[product.category] || 0) + 1;
            }
        });
        const trendingInYourCity = {
            city: user.city,
            categories: Object.entries(cityCategoryCount)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([category]) => category),
        };
        const becauseYouViewed = await this.getCollaborativeRecommendations(userId, viewedProductIds);
        const popularInYourArea = await this.prisma.user.findMany({
            where: {
                role: 'SELLER',
                city: user.city,
                products: {
                    some: {},
                },
            },
            orderBy: [
                { ratingAvg: 'desc' },
                { ratingCount: 'desc' },
            ],
            include: {
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
            take: 10,
        });
        return {
            recommendedForYou,
            trendingInYourCity,
            becauseYouViewed,
            popularInYourArea,
        };
    }
    async getCollaborativeRecommendations(userId, viewedProductIds) {
        const similarUserViews = await this.prisma.productView.findMany({
            where: {
                productId: { in: viewedProductIds },
                userId: { not: userId },
            },
        });
        const userSimilarity = {};
        similarUserViews.forEach(view => {
            userSimilarity[view.userId] = (userSimilarity[view.userId] || 0) + 1;
        });
        const similarUsers = Object.entries(userSimilarity)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([userId]) => userId);
        if (similarUsers.length === 0) {
            return this.getTrendingProducts(10);
        }
        const similarUserProductViews = await this.prisma.productView.findMany({
            where: {
                userId: { in: similarUsers },
                productId: { notIn: viewedProductIds },
            },
        });
        const productCount = {};
        similarUserProductViews.forEach(view => {
            productCount[view.productId] = (productCount[view.productId] || 0) + 1;
        });
        const recommendedProductIds = Object.entries(productCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([productId]) => productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: recommendedProductIds } },
            include: {
                seller: {
                    select: {
                        shopName: true,
                        ratingAvg: true,
                        ratingCount: true,
                    },
                },
                _count: {
                    select: {
                        views: true,
                    },
                },
            },
            orderBy: [
                { seller: { ratingAvg: 'desc' } },
                { seller: { ratingCount: 'desc' } },
                { views: { _count: 'desc' } },
            ],
        });
        return products;
    }
    async getTrendingProducts(limit) {
        return this.prisma.product.findMany({
            take: limit,
            orderBy: {
                views: {
                    _count: 'desc',
                },
            },
            include: {
                seller: {
                    select: {
                        shopName: true,
                        ratingAvg: true,
                        ratingCount: true,
                    },
                },
                _count: {
                    select: {
                        views: true,
                    },
                },
            },
        });
    }
};
exports.DiscoveryService = DiscoveryService;
exports.DiscoveryService = DiscoveryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DiscoveryService);
//# sourceMappingURL=discovery.service.js.map