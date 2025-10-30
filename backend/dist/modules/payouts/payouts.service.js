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
var PayoutsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let PayoutsService = PayoutsService_1 = class PayoutsService {
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
        this.logger = new common_1.Logger(PayoutsService_1.name);
    }
    async getPendingForSeller(sellerId) {
        var _a;
        const items = await this.prisma.orderItem.findMany({
            where: {
                sellerId,
                payoutStatus: 'PENDING',
            },
            select: {
                id: true,
                orderId: true,
                productId: true,
                qty: true,
                price: true,
                grossAmount: true,
                feeAmount: true,
                netAmount: true,
                currency: true,
                createdAt: true,
                product: {
                    select: {
                        title: true,
                        imageUrl: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
        const totalGross = items.reduce((acc, it) => acc + Number(it.grossAmount), 0);
        const totalFees = items.reduce((acc, it) => acc + Number(it.feeAmount), 0);
        const totalNet = items.reduce((acc, it) => acc + Number(it.netAmount), 0);
        return {
            currency: ((_a = items[0]) === null || _a === void 0 ? void 0 : _a.currency) || 'USD',
            totalGross,
            totalFees,
            totalNet,
            count: items.length,
            items,
        };
    }
    async getAllForSeller(sellerId) {
        const items = await this.prisma.orderItem.findMany({
            where: { sellerId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                orderId: true,
                productId: true,
                qty: true,
                price: true,
                grossAmount: true,
                feeAmount: true,
                netAmount: true,
                currency: true,
                payoutStatus: true,
                payoutBatchId: true,
                paidAt: true,
                createdAt: true,
                product: {
                    select: {
                        title: true,
                    },
                },
            },
        });
        return items;
    }
    async markPaidOut(orderItemIds, batchId) {
        const now = new Date();
        await this.prisma.orderItem.updateMany({
            where: {
                id: { in: orderItemIds },
            },
            data: {
                payoutStatus: 'PAID_OUT',
                payoutBatchId: batchId,
                paidAt: now,
            },
        });
        const updated = await this.prisma.orderItem.findMany({
            where: { id: { in: orderItemIds } },
            select: {
                id: true,
                sellerId: true,
                netAmount: true,
                currency: true,
                payoutBatchId: true,
                paidAt: true,
                product: {
                    select: {
                        title: true,
                    },
                },
            },
        });
        const sellerPayouts = new Map();
        for (const item of updated) {
            if (!sellerPayouts.has(item.sellerId)) {
                sellerPayouts.set(item.sellerId, {
                    amount: 0,
                    count: 0,
                    currency: item.currency,
                });
            }
            const payout = sellerPayouts.get(item.sellerId);
            payout.amount += Number(item.netAmount);
            payout.count++;
        }
        try {
            for (const [sellerId, payout] of sellerPayouts) {
                await this.notifications.notifyPayoutReleased(sellerId, payout.amount, payout.currency, batchId, payout.count);
            }
        }
        catch (error) {
            this.logger.error(`Failed to send payout notifications: ${error.message}`);
        }
        return {
            batchId,
            paidAt: now,
            count: updated.length,
            lines: updated,
        };
    }
    async getCsvForSeller(sellerId) {
        const items = await this.prisma.orderItem.findMany({
            where: { sellerId },
            orderBy: { createdAt: 'asc' },
            select: {
                id: true,
                orderId: true,
                productId: true,
                qty: true,
                price: true,
                grossAmount: true,
                feeAmount: true,
                netAmount: true,
                currency: true,
                payoutStatus: true,
                payoutBatchId: true,
                paidAt: true,
                createdAt: true,
                product: {
                    select: {
                        title: true,
                    },
                },
            },
        });
        const header = [
            'orderItemId',
            'orderId',
            'productTitle',
            'qty',
            'unitPrice',
            'gross',
            'fee',
            'net',
            'currency',
            'payoutStatus',
            'payoutBatchId',
            'paidAt',
            'createdAt',
        ].join(',');
        const rows = items.map((it) => {
            var _a, _b, _c;
            return [
                it.id,
                it.orderId,
                `"${it.product.title}"`,
                it.qty,
                Number(it.price).toFixed(2),
                Number(it.grossAmount).toFixed(2),
                Number(it.feeAmount).toFixed(2),
                Number(it.netAmount).toFixed(2),
                it.currency,
                it.payoutStatus,
                (_a = it.payoutBatchId) !== null && _a !== void 0 ? _a : '',
                (_c = (_b = it.paidAt) === null || _b === void 0 ? void 0 : _b.toISOString()) !== null && _c !== void 0 ? _c : '',
                it.createdAt.toISOString(),
            ].join(',');
        });
        const csv = [header, ...rows].join('\n');
        return csv;
    }
    async getAdminSummary() {
        const items = await this.prisma.orderItem.findMany({
            where: {
                payoutStatus: 'PENDING',
            },
            select: {
                sellerId: true,
                netAmount: true,
                currency: true,
                product: {
                    select: {
                        seller: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        const grouped = items.reduce((acc, item) => {
            const seller = item.product.seller;
            if (!acc[seller.id]) {
                acc[seller.id] = {
                    sellerId: seller.id,
                    sellerName: seller.name || 'Unknown',
                    sellerEmail: seller.email,
                    totalNet: 0,
                    currency: item.currency,
                    count: 0,
                };
            }
            acc[seller.id].totalNet += Number(item.netAmount);
            acc[seller.id].count += 1;
            return acc;
        }, {});
        return Object.values(grouped);
    }
};
exports.PayoutsService = PayoutsService;
exports.PayoutsService = PayoutsService = PayoutsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], PayoutsService);
//# sourceMappingURL=payouts.service.js.map