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
const notifications_service_1 = require("../notifications/notifications.service");
let ReviewsService = ReviewsService_1 = class ReviewsService {
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
        this.logger = new common_1.Logger(ReviewsService_1.name);
    }
    async createReview(dto) {
        const oi = await this.prisma.orderItem.findUnique({
            where: { id: dto.orderItemId },
            include: {
                order: true,
            },
        });
        if (!oi)
            throw new common_1.NotFoundException('Order item not found');
        if (oi.order.userId !== dto.buyerId) {
            throw new common_1.ForbiddenException('Not your order item');
        }
        if (oi.fulfillmentStatus !== 'DELIVERED') {
            throw new common_1.BadRequestException('Item not delivered yet');
        }
        const existing = await this.prisma.review.findFirst({
            where: {
                orderItemId: dto.orderItemId,
                buyerId: dto.buyerId,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Already reviewed');
        }
        const review = await this.prisma.review.create({
            data: {
                orderItemId: dto.orderItemId,
                buyerId: dto.buyerId,
                sellerId: oi.sellerId,
                rating: dto.rating,
                comment: dto.comment,
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
        });
        await this.recomputeSellerRating(oi.sellerId);
        try {
            await this.notifications.notifyNewReview(oi.sellerId, review.id, review.orderItem.product.title, review.rating, review.buyer.name || 'A customer');
        }
        catch (error) {
            this.logger.error(`Failed to send review notification: ${error.message}`);
        }
        return review;
    }
    async listForSellerHandle(handle, limit = 20) {
        const seller = await this.prisma.user.findFirst({
            where: {
                sellerHandle: handle,
                role: { in: ['SELLER', 'ADMIN'] },
            },
            select: {
                id: true,
                sellerHandle: true,
                shopName: true,
                name: true,
                ratingAvg: true,
                ratingCount: true,
            },
        });
        if (!seller)
            throw new common_1.NotFoundException('Seller not found');
        const reviews = await this.prisma.review.findMany({
            where: {
                sellerId: seller.id,
                isVisible: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
            select: {
                id: true,
                rating: true,
                comment: true,
                createdAt: true,
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return {
            seller: {
                id: seller.id,
                handle: seller.sellerHandle,
                displayName: seller.shopName || seller.name,
                ratingAvg: seller.ratingAvg || 0,
                ratingCount: seller.ratingCount || 0,
            },
            reviews,
        };
    }
    async hideReview(reviewId, dto) {
        const admin = await this.prisma.user.findUnique({
            where: { id: dto.adminId },
        });
        if (!admin || admin.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Not authorized');
        }
        const rev = await this.prisma.review.findUnique({
            where: { id: reviewId },
        });
        if (!rev)
            throw new common_1.NotFoundException('Review not found');
        const updated = await this.prisma.review.update({
            where: { id: reviewId },
            data: {
                isVisible: false,
            },
        });
        await this.recomputeSellerRating(updated.sellerId);
        return updated;
    }
    async recomputeSellerRating(sellerId) {
        var _a, _b, _c, _d;
        const agg = await this.prisma.review.groupBy({
            by: ['sellerId'],
            where: {
                sellerId,
                isVisible: true,
            },
            _avg: {
                rating: true,
            },
            _count: {
                rating: true,
            },
        });
        const avg = (_b = (_a = agg[0]) === null || _a === void 0 ? void 0 : _a._avg.rating) !== null && _b !== void 0 ? _b : 0;
        const count = (_d = (_c = agg[0]) === null || _c === void 0 ? void 0 : _c._count.rating) !== null && _d !== void 0 ? _d : 0;
        await this.prisma.user.update({
            where: { id: sellerId },
            data: {
                ratingAvg: avg,
                ratingCount: count,
            },
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = ReviewsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map