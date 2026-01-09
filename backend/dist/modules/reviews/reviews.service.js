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
var ReviewsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ReviewsService = ReviewsService_1 = class ReviewsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ReviewsService_1.name);
    }
    async createReview(data) {
        const orderItem = await this.prisma.orderItem.findUnique({
            where: { id: data.orderItemId },
            include: { product: true },
        });
        if (!orderItem) {
            throw new common_1.NotFoundException('Order item not found');
        }
        const review = await this.prisma.review.create({
            data: {
                orderItemId: data.orderItemId,
                buyerId: data.buyerId,
                sellerId: data.sellerId || orderItem.sellerId,
                productId: data.productId || orderItem.productId,
                rating: data.rating,
                comment: data.comment,
                isVisible: true,
            },
        });
        return review;
    }
    async getSellerReviews(handle, limit = 10) {
        const reviews = await this.prisma.review.findMany({
            where: {
                seller: {
                    sellerHandle: handle,
                },
                isVisible: true,
            },
            include: {
                orderItem: {
                    include: {
                        product: {
                            select: {
                                title: true,
                            },
                        },
                    },
                },
                buyer: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        });
        return reviews;
    }
    async listForSellerHandle(handle, limit = 10) {
        return this.getSellerReviews(handle, limit);
    }
    async hideReview(id, body) {
        const review = await this.prisma.review.update({
            where: { id },
            data: { isVisible: false },
        });
        return review;
    }
    async getProductReviews(productId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [reviews, total] = await Promise.all([
            this.prisma.review.findMany({
                where: {
                    productId,
                    isVisible: true,
                },
                include: {
                    buyer: {
                        select: {
                            id: true,
                            name: true,
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
                    productId,
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
    async getProductReviewsSummary(productId) {
        const reviews = await this.prisma.review.findMany({
            where: {
                productId,
                isVisible: true,
            },
            select: {
                rating: true,
            },
        });
        if (reviews.length === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution: {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                },
            };
        }
        const totalReviews = reviews.length;
        const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
        const ratingDistribution = {
            1: reviews.filter((r) => r.rating === 1).length,
            2: reviews.filter((r) => r.rating === 2).length,
            3: reviews.filter((r) => r.rating === 3).length,
            4: reviews.filter((r) => r.rating === 4).length,
            5: reviews.filter((r) => r.rating === 5).length,
        };
        return {
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews,
            ratingDistribution,
        };
    }
    async updateReview(id, buyerId, data) {
        var _a, _b;
        const review = await this.prisma.review.findUnique({
            where: { id },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        if (review.buyerId !== buyerId) {
            throw new common_1.ForbiddenException('You can only update your own reviews');
        }
        const updated = await this.prisma.review.update({
            where: { id },
            data: {
                rating: (_a = data.rating) !== null && _a !== void 0 ? _a : review.rating,
                comment: (_b = data.comment) !== null && _b !== void 0 ? _b : review.comment,
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
                    },
                },
            },
        });
        return updated;
    }
    async deleteReview(id, buyerId) {
        const review = await this.prisma.review.findUnique({
            where: { id },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        if (review.buyerId !== buyerId) {
            throw new common_1.ForbiddenException('You can only delete your own reviews');
        }
        await this.prisma.review.delete({
            where: { id },
        });
        return { message: 'Review deleted successfully' };
    }
    async getUserReviews(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [reviews, total] = await Promise.all([
            this.prisma.review.findMany({
                where: {
                    buyerId: userId,
                },
                include: {
                    product: {
                        select: {
                            id: true,
                            title: true,
                            imageUrl: true,
                        },
                    },
                    seller: {
                        select: {
                            id: true,
                            name: true,
                            sellerHandle: true,
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
                    buyerId: userId,
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
    async getPendingReviews(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [reviews, total] = await Promise.all([
            this.prisma.review.findMany({
                where: {
                    isVisible: false,
                },
                include: {
                    buyer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    seller: {
                        select: {
                            id: true,
                            name: true,
                            sellerHandle: true,
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
                    isVisible: false,
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
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = ReviewsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map