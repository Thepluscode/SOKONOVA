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
exports.AnalyticsSellerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
}
let AnalyticsSellerService = class AnalyticsSellerService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSellerSummary(sellerId) {
        var _a, _b;
        const since7 = daysAgo(7);
        const recentItems = await this.prisma.orderItem.findMany({
            where: {
                sellerId,
                createdAt: { gte: since7 },
                order: { status: 'PAID' },
            },
            select: {
                netAmount: true,
                currency: true,
                productId: true,
                qty: true,
                product: {
                    select: { title: true },
                },
            },
        });
        const revenueCurrency = ((_a = recentItems[0]) === null || _a === void 0 ? void 0 : _a.currency) || 'USD';
        const revenue7d = recentItems.reduce((acc, it) => acc + Number(it.netAmount), 0);
        const skuMap = {};
        for (const it of recentItems) {
            const pid = it.productId;
            if (!skuMap[pid]) {
                skuMap[pid] = {
                    productId: pid,
                    title: ((_b = it.product) === null || _b === void 0 ? void 0 : _b.title) || 'Untitled',
                    qty: 0,
                };
            }
            skuMap[pid].qty += it.qty;
        }
        const topSkus = Object.values(skuMap)
            .sort((a, b) => b.qty - a.qty)
            .slice(0, 5);
        const since30 = daysAgo(30);
        const sold30 = await this.prisma.orderItem.count({
            where: {
                sellerId,
                createdAt: { gte: since30 },
                order: { status: 'PAID' },
            },
        });
        const disputes30 = await this.prisma.dispute.count({
            where: {
                orderItem: {
                    sellerId,
                    createdAt: { gte: since30 },
                },
                status: {
                    not: 'REJECTED',
                },
            },
        });
        const disputeRate = sold30 === 0 ? 0 : (disputes30 / sold30) * 100;
        const lastReviews = await this.prisma.review.findMany({
            where: {
                sellerId,
                isVisible: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: {
                rating: true,
                createdAt: true,
            },
        });
        const trendPoints = [...lastReviews]
            .reverse()
            .map((r) => ({
            rating: r.rating,
            ts: r.createdAt,
        }));
        const seller = await this.prisma.user.findUnique({
            where: { id: sellerId },
            select: {
                ratingAvg: true,
                ratingCount: true,
                shopName: true,
                sellerHandle: true,
            },
        });
        return {
            sellerMeta: {
                shopName: (seller === null || seller === void 0 ? void 0 : seller.shopName) || null,
                sellerHandle: (seller === null || seller === void 0 ? void 0 : seller.sellerHandle) || null,
            },
            revenue7d: {
                amount: revenue7d,
                currency: revenueCurrency,
            },
            topSkus,
            dispute: {
                disputeRatePct: disputeRate,
                soldWindow: sold30,
                disputesWindow: disputes30,
            },
            rating: {
                avg: (seller === null || seller === void 0 ? void 0 : seller.ratingAvg) || 0,
                count: (seller === null || seller === void 0 ? void 0 : seller.ratingCount) || 0,
                trend: trendPoints,
            },
        };
    }
};
exports.AnalyticsSellerService = AnalyticsSellerService;
exports.AnalyticsSellerService = AnalyticsSellerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsSellerService);
//# sourceMappingURL=analytics-seller.service.js.map