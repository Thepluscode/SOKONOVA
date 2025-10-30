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
var FulfillmentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FulfillmentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let FulfillmentService = FulfillmentService_1 = class FulfillmentService {
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
        this.logger = new common_1.Logger(FulfillmentService_1.name);
    }
    async getOrderTracking(orderId, userId) {
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, userId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                title: true,
                                imageUrl: true,
                                sellerId: true,
                            },
                        },
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found or access denied');
        }
        return {
            orderId: order.id,
            status: order.status,
            createdAt: order.createdAt,
            shippingAddress: order.shippingAdr,
            items: order.items.map((it) => ({
                orderItemId: it.id,
                productTitle: it.product.title,
                productImage: it.product.imageUrl,
                qty: it.qty,
                price: it.price.toString(),
                fulfillmentStatus: it.fulfillmentStatus,
                trackingCode: it.trackingCode,
                carrier: it.carrier,
                shippedAt: it.shippedAt,
                deliveredAt: it.deliveredAt,
                deliveryProofUrl: it.deliveryProofUrl,
                notes: it.notes,
            })),
        };
    }
    async getSellerOpenFulfillment(sellerId) {
        const pending = await this.prisma.orderItem.findMany({
            where: {
                sellerId,
                fulfillmentStatus: { in: ['PACKED', 'SHIPPED'] },
            },
            orderBy: { createdAt: 'asc' },
            select: {
                id: true,
                orderId: true,
                qty: true,
                price: true,
                fulfillmentStatus: true,
                trackingCode: true,
                carrier: true,
                shippedAt: true,
                deliveredAt: true,
                deliveryProofUrl: true,
                notes: true,
                createdAt: true,
                product: {
                    select: {
                        title: true,
                        imageUrl: true,
                    },
                },
                order: {
                    select: {
                        id: true,
                        status: true,
                        shippingAdr: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        return pending.map((it) => ({
            id: it.id,
            orderId: it.orderId,
            qty: it.qty,
            price: it.price.toString(),
            fulfillmentStatus: it.fulfillmentStatus,
            trackingCode: it.trackingCode,
            carrier: it.carrier,
            shippedAt: it.shippedAt,
            deliveredAt: it.deliveredAt,
            deliveryProofUrl: it.deliveryProofUrl,
            notes: it.notes,
            createdAt: it.createdAt,
            product: it.product,
            order: {
                id: it.order.id,
                status: it.order.status,
                shippingAddress: it.order.shippingAdr,
                buyerName: it.order.user.name,
                buyerEmail: it.order.user.email,
            },
        }));
    }
    async markShipped(orderItemId, sellerId, carrier, trackingCode, note) {
        const row = await this.prisma.orderItem.findUnique({
            where: { id: orderItemId },
            select: { sellerId: true, fulfillmentStatus: true },
        });
        if (!row) {
            throw new common_1.NotFoundException('Order item not found');
        }
        if (row.sellerId !== sellerId) {
            throw new common_1.ForbiddenException('Not authorized to update this item');
        }
        const now = new Date();
        const updatedItem = await this.prisma.orderItem.update({
            where: { id: orderItemId },
            data: {
                fulfillmentStatus: 'SHIPPED',
                carrier,
                trackingCode,
                notes: note,
                shippedAt: now,
                updatedAt: now,
            },
            include: {
                order: {
                    select: {
                        userId: true,
                    },
                },
            },
        });
        try {
            await this.notifications.notifyShipmentUpdate(updatedItem.order.userId, updatedItem.id, 'SHIPPED', trackingCode, carrier);
        }
        catch (error) {
            this.logger.error(`Failed to send shipment notification: ${error.message}`);
        }
        return updatedItem;
    }
    async markDelivered(orderItemId, sellerId, proofUrl, note) {
        const row = await this.prisma.orderItem.findUnique({
            where: { id: orderItemId },
            select: { sellerId: true, fulfillmentStatus: true },
        });
        if (!row) {
            throw new common_1.NotFoundException('Order item not found');
        }
        if (row.sellerId !== sellerId) {
            throw new common_1.ForbiddenException('Not authorized to update this item');
        }
        const now = new Date();
        const updatedItem = await this.prisma.orderItem.update({
            where: { id: orderItemId },
            data: {
                fulfillmentStatus: 'DELIVERED',
                deliveredAt: now,
                deliveryProofUrl: proofUrl,
                notes: note,
                updatedAt: now,
            },
            include: {
                order: {
                    select: {
                        userId: true,
                    },
                },
            },
        });
        try {
            await this.notifications.notifyShipmentUpdate(updatedItem.order.userId, updatedItem.id, 'DELIVERED');
        }
        catch (error) {
            this.logger.error(`Failed to send delivery notification: ${error.message}`);
        }
        return updatedItem;
    }
    async markIssue(orderItemId, sellerId, note) {
        const row = await this.prisma.orderItem.findUnique({
            where: { id: orderItemId },
            select: { sellerId: true },
        });
        if (!row) {
            throw new common_1.NotFoundException('Order item not found');
        }
        if (row.sellerId !== sellerId) {
            throw new common_1.ForbiddenException('Not authorized to update this item');
        }
        return this.prisma.orderItem.update({
            where: { id: orderItemId },
            data: {
                fulfillmentStatus: 'ISSUE',
                notes: note,
                updatedAt: new Date(),
            },
        });
    }
    async getSellerStats(sellerId) {
        const items = await this.prisma.orderItem.findMany({
            where: { sellerId },
            select: { fulfillmentStatus: true },
        });
        const stats = {
            PACKED: 0,
            SHIPPED: 0,
            DELIVERED: 0,
            ISSUE: 0,
            total: items.length,
        };
        items.forEach((it) => {
            stats[it.fulfillmentStatus] = (stats[it.fulfillmentStatus] || 0) + 1;
        });
        return stats;
    }
};
exports.FulfillmentService = FulfillmentService;
exports.FulfillmentService = FulfillmentService = FulfillmentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], FulfillmentService);
//# sourceMappingURL=fulfillment.service.js.map