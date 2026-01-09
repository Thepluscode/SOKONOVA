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
    async getSellerByHandle(handle) {
        const seller = await this.prisma.user.findFirst({
            where: {
                sellerHandle: handle,
                role: 'SELLER',
            },
            select: {
                id: true,
                shopName: true,
                shopLogoUrl: true,
                shopBannerUrl: true,
                bio: true,
                ratingAvg: true,
                ratingCount: true,
                country: true,
                city: true,
                products: {
                    take: 12,
                    orderBy: {
                        createdAt: 'desc',
                    },
                    include: {
                        _count: {
                            select: {
                                views: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        });
        return seller;
    }
    async getFeaturedSellers(limit = 10) {
        const sellers = await this.prisma.user.findMany({
            where: {
                role: 'SELLER',
                products: {
                    some: {},
                },
            },
            select: {
                id: true,
                shopName: true,
                shopLogoUrl: true,
                ratingAvg: true,
                ratingCount: true,
                country: true,
                products: {
                    take: 3,
                    orderBy: {
                        createdAt: 'desc',
                    },
                    include: {
                        _count: {
                            select: {
                                views: true,
                            },
                        },
                    },
                },
            },
            take: limit,
            orderBy: {
                ratingAvg: 'desc',
            },
        });
        return sellers;
    }
    async getAllSellers(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [sellers, total] = await Promise.all([
            this.prisma.user.findMany({
                where: {
                    role: 'SELLER',
                },
                select: {
                    id: true,
                    sellerHandle: true,
                    shopName: true,
                    shopLogoUrl: true,
                    ratingAvg: true,
                    ratingCount: true,
                    country: true,
                    city: true,
                    _count: {
                        select: {
                            products: true,
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.user.count({
                where: {
                    role: 'SELLER',
                },
            }),
        ]);
        return {
            sellers,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getSellerById(id) {
        const seller = await this.prisma.user.findUnique({
            where: {
                id,
                role: 'SELLER',
            },
            select: {
                id: true,
                sellerHandle: true,
                shopName: true,
                shopLogoUrl: true,
                shopBannerUrl: true,
                bio: true,
                ratingAvg: true,
                ratingCount: true,
                country: true,
                city: true,
                products: {
                    take: 12,
                    orderBy: {
                        createdAt: 'desc',
                    },
                    include: {
                        _count: {
                            select: {
                                views: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        });
        return seller;
    }
    async getSellerProducts(handle, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const seller = await this.prisma.user.findFirst({
            where: {
                sellerHandle: handle,
                role: 'SELLER',
            },
            select: {
                id: true,
            },
        });
        if (!seller) {
            return null;
        }
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where: {
                    sellerId: seller.id,
                },
                include: {
                    _count: {
                        select: {
                            views: true,
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.product.count({
                where: {
                    sellerId: seller.id,
                },
            }),
        ]);
        return {
            products,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getSellerReviews(handle, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const seller = await this.prisma.user.findFirst({
            where: {
                sellerHandle: handle,
                role: 'SELLER',
            },
            select: {
                id: true,
            },
        });
        if (!seller) {
            return null;
        }
        const [reviews, total] = await Promise.all([
            this.prisma.review.findMany({
                where: {
                    sellerId: seller.id,
                    isVisible: true,
                },
                include: {
                    buyer: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    product: {
                        select: {
                            id: true,
                            title: true,
                            imageUrl: true,
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.review.count({
                where: {
                    sellerId: seller.id,
                    isVisible: true,
                },
            }),
        ]);
        return {
            reviews,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
};
exports.StorefrontService = StorefrontService;
exports.StorefrontService = StorefrontService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StorefrontService);
//# sourceMappingURL=storefront.service.js.map