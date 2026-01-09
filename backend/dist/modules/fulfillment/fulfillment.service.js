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
    async calculateDeliveryEstimate(productId, location) {
        const minDays = 2;
        const maxDays = 7;
        return {
            productId,
            location: location || 'default',
            estimatedMinDays: minDays,
            estimatedMaxDays: maxDays,
            confidenceLevel: 0.85,
            carriers: ['Standard Shipping', 'Express Shipping'],
        };
    }
    async getShippingOptions(items, location) {
        return [
            {
                id: 'standard',
                name: 'Standard Shipping',
                description: 'Delivered in 3-5 business days',
                cost: 5.99,
                estimatedDays: 5,
            },
            {
                id: 'express',
                name: 'Express Shipping',
                description: 'Delivered in 1-2 business days',
                cost: 12.99,
                estimatedDays: 2,
            },
            {
                id: 'overnight',
                name: 'Overnight Shipping',
                description: 'Delivered by next business day',
                cost: 24.99,
                estimatedDays: 1,
            },
        ];
    }
    async trackShipment(trackingNumber) {
        return {
            trackingNumber,
            status: 'in_transit',
            estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            carrier: 'Mock Carrier',
            events: [
                {
                    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    location: 'Warehouse',
                    description: 'Package shipped',
                },
                {
                    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                    location: 'Distribution Center',
                    description: 'Package in transit',
                },
            ],
        };
    }
    async getDeliveryPerformanceMetrics(sellerId) {
        return {
            sellerId,
            onTimeDeliveryRate: 0.92,
            avgDeliveryTime: 3.2,
            lateDeliveries: 8,
            totalDeliveries: 100,
            customerSatisfaction: 4.7,
        };
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
    async calculateDeliveryPromise(productId, location) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: {},
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const sellerPerformance = {
            onTimeDeliveryRate: 0.92,
            avgDeliveryTime: 3.2,
            customerSatisfaction: 4.7,
        };
        const standardEstimate = await this.calculateDeliveryEstimate(productId, location);
        const confidenceLevel = Math.min(0.95, Math.max(0.7, sellerPerformance.onTimeDeliveryRate * 0.8 +
            (1 - (sellerPerformance.avgDeliveryTime / 10)) * 0.2));
        const promisedMinDays = Math.max(1, Math.round(standardEstimate.estimatedMinDays * 0.9));
        const promisedMaxDays = Math.round(standardEstimate.estimatedMaxDays * 1.1);
        return {
            productId,
            location: location || 'default',
            promisedMinDays,
            promisedMaxDays,
            confidenceLevel,
            sellerRating: sellerPerformance.customerSatisfaction,
            deliveryGuarantee: confidenceLevel > 0.85,
            message: confidenceLevel > 0.9
                ? "Delivery guaranteed or your shipping is free!"
                : confidenceLevel > 0.8
                    ? "High confidence delivery estimate"
                    : "Estimated delivery window",
        };
    }
    async getExceptionStatus(orderItemId) {
        const orderItem = await this.prisma.orderItem.findUnique({
            where: { id: orderItemId },
            include: {
                order: {
                    include: {
                        user: true,
                    },
                },
                product: {
                    include: {},
                },
            },
        });
        if (!orderItem) {
            throw new common_1.NotFoundException('Order item not found');
        }
        const now = new Date();
        const shippedAt = orderItem.shippedAt;
        const expectedDelivery = shippedAt
            ? new Date(shippedAt.getTime() + 5 * 24 * 60 * 60 * 1000)
            : null;
        const isLate = expectedDelivery && now > expectedDelivery;
        const hasTrackingIssues = !orderItem.trackingCode || orderItem.trackingCode.length < 5;
        const hasSellerNotes = orderItem.notes && orderItem.notes.toLowerCase().includes('issue');
        let exceptionType = null;
        let exceptionSeverity = 'low';
        let nextAction = null;
        let slaDeadline = null;
        if (orderItem.fulfillmentStatus === 'ISSUE') {
            exceptionType = 'reported_issue';
            exceptionSeverity = 'high';
            nextAction = 'seller_resolution_required';
        }
        else if (isLate) {
            exceptionType = 'delivery_delay';
            exceptionSeverity = now > new Date(expectedDelivery.getTime() + 2 * 24 * 60 * 60 * 1000)
                ? 'high' : 'medium';
            nextAction = 'seller_notification';
            slaDeadline = new Date(expectedDelivery.getTime() + 3 * 24 * 60 * 60 * 1000);
        }
        else if (hasTrackingIssues) {
            exceptionType = 'tracking_issue';
            exceptionSeverity = 'medium';
            nextAction = 'seller_reminder';
        }
        else if (hasSellerNotes) {
            exceptionType = 'seller_note';
            exceptionSeverity = 'medium';
            nextAction = 'review_required';
        }
        return {
            orderItemId,
            exceptionType,
            exceptionSeverity,
            nextAction,
            slaDeadline,
            orderDetails: {
                orderId: orderItem.orderId,
                productTitle: orderItem.product.title,
                buyerName: orderItem.order.user.name,
                buyerEmail: orderItem.order.user.email,
                fulfillmentStatus: orderItem.fulfillmentStatus,
                shippedAt: orderItem.shippedAt,
                expectedDelivery,
            },
        };
    }
    async getMicroFulfillmentMetrics(sellerId) {
        const partners = [
            {
                id: 'partner-1',
                name: 'Express Fulfillment Co.',
                performance: {
                    onTimeRate: 0.96,
                    avgProcessingTime: 1.2,
                    accuracyRate: 0.99,
                    costPerItem: 2.5,
                },
                capacity: {
                    available: 1200,
                    total: 1500,
                },
            },
            {
                id: 'partner-2',
                name: 'Local Distribution Hub',
                performance: {
                    onTimeRate: 0.89,
                    avgProcessingTime: 2.5,
                    accuracyRate: 0.97,
                    costPerItem: 1.8,
                },
                capacity: {
                    available: 800,
                    total: 1000,
                },
            },
        ];
        return {
            optedIn: false,
            partners,
            sellerMetrics: {
                fulfillmentRate: 0.93,
                avgTurnaround: 1.8,
                costSavings: 1250.75,
            },
        };
    }
    async optInToMicroFulfillment(sellerId, partnerId) {
        return {
            success: true,
            sellerId,
            partnerId,
            optInDate: new Date(),
        };
    }
    async getFulfillmentPartners(sellerId) {
        return [
            {
                id: 'partner-1',
                name: 'Express Fulfillment Co.',
                description: 'Fast processing with same-day shipping options',
                locations: ['Lagos', 'Abuja', 'Port Harcourt'],
                pricing: {
                    pickPack: 2.5,
                    storage: 0.1,
                },
                capabilities: ['Same-day shipping', 'Fragile handling', 'Returns processing'],
                rating: 4.8,
            },
            {
                id: 'partner-2',
                name: 'Local Distribution Hub',
                description: 'Cost-effective solution for high-volume sellers',
                locations: ['Nairobi', 'Mombasa', 'Kisumu'],
                pricing: {
                    pickPack: 1.8,
                    storage: 0.05,
                },
                capabilities: ['Bulk processing', 'Inventory management', 'Multi-channel fulfillment'],
                rating: 4.5,
            },
            {
                id: 'partner-3',
                name: 'Regional Logistics Network',
                description: 'Comprehensive fulfillment across West Africa',
                locations: ['Accra', 'Kumasi', 'Takoradi'],
                pricing: {
                    pickPack: 2.2,
                    storage: 0.08,
                },
                capabilities: ['Cross-border shipping', 'Customs handling', 'Temperature control'],
                rating: 4.6,
            },
        ];
    }
};
exports.FulfillmentService = FulfillmentService;
exports.FulfillmentService = FulfillmentService = FulfillmentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], FulfillmentService);
//# sourceMappingURL=fulfillment.service.js.map