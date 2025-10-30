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
exports.AnalyticsRollupService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
}
let AnalyticsRollupService = class AnalyticsRollupService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOpsSummary(adminId) {
        var _a, _b, _c, _d;
        const admin = await this.prisma.user.findUnique({
            where: { id: adminId },
            select: { role: true },
        });
        if (!admin || admin.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Not authorized');
        }
        const since7 = daysAgo(7);
        const since30 = daysAgo(30);
        const items7d = await this.prisma.orderItem.findMany({
            where: {
                createdAt: { gte: since7 },
                order: { status: 'PAID' },
            },
            select: {
                grossAmount: true,
                currency: true,
                sellerId: true,
            },
        });
        const sellerIds = [...new Set(items7d.map(it => it.sellerId))];
        const sellers = await this.prisma.user.findMany({
            where: { id: { in: sellerIds } },
            select: { id: true, city: true, country: true },
        });
        const sellerMap = new Map(sellers.map(s => [s.id, s]));
        const gmvByCity = {};
        for (const it of items7d) {
            const seller = sellerMap.get(it.sellerId);
            const cityKey = ((seller === null || seller === void 0 ? void 0 : seller.city) || (seller === null || seller === void 0 ? void 0 : seller.country) || 'Unknown').toLowerCase();
            if (!gmvByCity[cityKey]) {
                gmvByCity[cityKey] = {
                    cityLabel: (seller === null || seller === void 0 ? void 0 : seller.city)
                        ? `${seller.city}${seller.country ? ', ' + seller.country : ''}`
                        : (seller === null || seller === void 0 ? void 0 : seller.country) || 'Unknown',
                    gmv: 0,
                    currency: it.currency || 'USD',
                };
            }
            gmvByCity[cityKey].gmv += Number(it.grossAmount);
        }
        const gmvByCityArr = Object.values(gmvByCity).sort((a, b) => b.gmv - a.gmv);
        const itemsWithCat = await this.prisma.orderItem.findMany({
            where: {
                createdAt: { gte: since7 },
                order: { status: 'PAID' },
            },
            include: {
                product: {
                    select: {
                        category: true,
                    },
                },
            },
        });
        const catAgg = {};
        for (const it of itemsWithCat) {
            const cat = ((_a = it.product) === null || _a === void 0 ? void 0 : _a.category) || 'other';
            if (!catAgg[cat]) {
                catAgg[cat] = { category: cat, gmv: 0 };
            }
            catAgg[cat].gmv += Number(it.grossAmount);
        }
        const topCategories = Object.values(catAgg)
            .sort((a, b) => b.gmv - a.gmv)
            .slice(0, 5);
        const sellerRevMap = {};
        const sellerRevRows = await this.prisma.orderItem.findMany({
            where: {
                createdAt: { gte: since7 },
                order: { status: 'PAID' },
            },
            select: {
                sellerId: true,
                netAmount: true,
            },
        });
        const revenueSellerIds = [...new Set(sellerRevRows.map(r => r.sellerId))];
        const revenueSellers = await this.prisma.user.findMany({
            where: { id: { in: revenueSellerIds } },
            select: {
                id: true,
                shopName: true,
                sellerHandle: true,
                city: true,
                country: true,
                ratingAvg: true,
                ratingCount: true,
            },
        });
        const revenueSellerMap = new Map(revenueSellers.map(s => [s.id, s]));
        for (const row of sellerRevRows) {
            if (!sellerRevMap[row.sellerId]) {
                const sellerInfo = revenueSellerMap.get(row.sellerId);
                sellerRevMap[row.sellerId] = {
                    sellerId: row.sellerId,
                    shopName: (sellerInfo === null || sellerInfo === void 0 ? void 0 : sellerInfo.shopName) || null,
                    handle: (sellerInfo === null || sellerInfo === void 0 ? void 0 : sellerInfo.sellerHandle) || null,
                    city: (sellerInfo === null || sellerInfo === void 0 ? void 0 : sellerInfo.city) || null,
                    country: (sellerInfo === null || sellerInfo === void 0 ? void 0 : sellerInfo.country) || null,
                    netRevenue7d: 0,
                    ratingAvg: (_b = sellerInfo === null || sellerInfo === void 0 ? void 0 : sellerInfo.ratingAvg) !== null && _b !== void 0 ? _b : 0,
                    ratingCount: (_c = sellerInfo === null || sellerInfo === void 0 ? void 0 : sellerInfo.ratingCount) !== null && _c !== void 0 ? _c : 0,
                };
            }
            sellerRevMap[row.sellerId].netRevenue7d += Number(row.netAmount);
        }
        const topSellersByRevenue = Object.values(sellerRevMap)
            .sort((a, b) => b.netRevenue7d - a.netRevenue7d)
            .slice(0, 10);
        const soldCounts = await this.prisma.orderItem.groupBy({
            by: ['sellerId'],
            where: {
                createdAt: { gte: since30 },
                order: { status: 'PAID' },
            },
            _count: {
                _all: true,
            },
        });
        const disputeCounts = await this.prisma.dispute.groupBy({
            by: ['orderItemId'],
            where: {
                createdAt: { gte: since30 },
                status: { not: 'REJECTED' },
            },
            _count: {
                _all: true,
            },
        });
        let riskMap = {};
        for (const s of soldCounts) {
            riskMap[s.sellerId] = {
                sellerId: s.sellerId,
                disputes: 0,
                sold: s._count._all,
                disputeRatePct: 0,
                shopName: null,
                handle: null,
                city: null,
                country: null,
            };
        }
        for (const d of disputeCounts) {
            const oi = await this.prisma.orderItem.findUnique({
                where: { id: d.orderItemId },
                select: {
                    sellerId: true,
                },
            });
            if (!oi)
                continue;
            if (!riskMap[oi.sellerId]) {
                riskMap[oi.sellerId] = {
                    sellerId: oi.sellerId,
                    disputes: 0,
                    sold: 0,
                    disputeRatePct: 0,
                    shopName: null,
                    handle: null,
                    city: null,
                    country: null,
                };
            }
            riskMap[oi.sellerId].disputes += d._count._all;
        }
        for (const sellerId of Object.keys(riskMap)) {
            const info = await this.prisma.user.findUnique({
                where: { id: sellerId },
                select: {
                    shopName: true,
                    sellerHandle: true,
                    city: true,
                    country: true,
                },
            });
            const sold = riskMap[sellerId].sold;
            const disputes = riskMap[sellerId].disputes;
            riskMap[sellerId].shopName = (info === null || info === void 0 ? void 0 : info.shopName) || null;
            riskMap[sellerId].handle = (info === null || info === void 0 ? void 0 : info.sellerHandle) || null;
            riskMap[sellerId].city = (info === null || info === void 0 ? void 0 : info.city) || null;
            riskMap[sellerId].country = (info === null || info === void 0 ? void 0 : info.country) || null;
            riskMap[sellerId].disputeRatePct =
                sold === 0 ? 0 : (disputes / sold) * 100;
        }
        const highDisputeSellers = Object.values(riskMap)
            .filter((s) => s.sold > 0)
            .sort((a, b) => b.disputeRatePct - a.disputeRatePct)
            .slice(0, 10);
        const unpaid = await this.prisma.orderItem.findMany({
            where: {
                payoutStatus: 'PENDING',
                fulfillmentStatus: 'DELIVERED',
            },
            select: {
                sellerId: true,
                netAmount: true,
                currency: true,
            },
        });
        let totalLiability = 0;
        let liabilityCurrency = ((_d = unpaid[0]) === null || _d === void 0 ? void 0 : _d.currency) || 'USD';
        const liabilityPerSeller = {};
        for (const row of unpaid) {
            totalLiability += Number(row.netAmount);
            if (!liabilityPerSeller[row.sellerId]) {
                liabilityPerSeller[row.sellerId] = {
                    sellerId: row.sellerId,
                    amount: 0,
                };
            }
            liabilityPerSeller[row.sellerId].amount += Number(row.netAmount);
        }
        const topLiabilitySellers = Object.values(liabilityPerSeller)
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 10);
        const liabilityDetailed = [];
        for (const li of topLiabilitySellers) {
            const info = await this.prisma.user.findUnique({
                where: { id: li.sellerId },
                select: {
                    shopName: true,
                    sellerHandle: true,
                    city: true,
                    country: true,
                },
            });
            liabilityDetailed.push({
                sellerId: li.sellerId,
                shopName: (info === null || info === void 0 ? void 0 : info.shopName) || null,
                handle: (info === null || info === void 0 ? void 0 : info.sellerHandle) || null,
                city: (info === null || info === void 0 ? void 0 : info.city) || null,
                country: (info === null || info === void 0 ? void 0 : info.country) || null,
                amount: li.amount,
            });
        }
        return {
            windowDaysGMV: 7,
            windowDaysDispute: 30,
            gmvByCity: gmvByCityArr,
            topCategories,
            topSellersByRevenue,
            highDisputeSellers,
            payoutLiability: {
                totalLiability,
                currency: liabilityCurrency,
                topOwed: liabilityDetailed,
            },
        };
    }
};
exports.AnalyticsRollupService = AnalyticsRollupService;
exports.AnalyticsRollupService = AnalyticsRollupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsRollupService);
//# sourceMappingURL=analytics-rollup.service.js.map