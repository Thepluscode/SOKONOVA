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
var DisputesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisputesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const common_2 = require("@nestjs/common");
let DisputesService = DisputesService_1 = class DisputesService {
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
        this.logger = new common_2.Logger(DisputesService_1.name);
    }
    async open(dto) {
        const oi = await this.prisma.orderItem.findUnique({
            where: { id: dto.orderItemId },
            include: { order: true },
        });
        if (!oi)
            throw new common_1.NotFoundException('Order item not found');
        if (oi.order.userId !== dto.buyerId) {
            throw new common_1.ForbiddenException('Not your order item');
        }
        const dispute = await this.prisma.dispute.create({
            data: {
                orderItemId: dto.orderItemId,
                buyerId: dto.buyerId,
                reasonCode: dto.reasonCode,
                description: dto.description,
                photoProofUrl: dto.photoProofUrl || null,
                status: 'OPEN',
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
            },
        });
        await this.prisma.orderItem.update({
            where: { id: dto.orderItemId },
            data: {
                fulfillmentStatus: 'ISSUE',
            },
        });
        try {
            await this.notifications.notifyDisputeOpened(oi.sellerId, dispute.id, dto.orderItemId, dispute.orderItem.product.title, dto.reasonCode, oi.order.id);
        }
        catch (error) {
            this.logger.error(`Failed to send dispute opened notification: ${error.message}`);
        }
        return dispute;
    }
    async listMine(buyerId) {
        return this.prisma.dispute.findMany({
            where: { buyerId },
            orderBy: { createdAt: 'desc' },
            include: {
                orderItem: {
                    include: {
                        product: { select: { title: true, imageUrl: true, sellerId: true } },
                        order: { select: { id: true, createdAt: true } },
                    },
                },
            },
        });
    }
    async listForSeller(sellerId) {
        return this.prisma.dispute.findMany({
            where: {
                orderItem: {
                    sellerId,
                },
                status: { in: ['OPEN', 'SELLER_RESPONDED'] },
            },
            orderBy: { createdAt: 'asc' },
            include: {
                orderItem: {
                    include: {
                        product: { select: { title: true, imageUrl: true } },
                        order: {
                            select: {
                                id: true,
                                userId: true,
                                createdAt: true,
                            },
                        },
                    },
                },
                buyer: {
                    select: { id: true, email: true, name: true },
                },
            },
        });
    }
    async listAll() {
        return this.prisma.dispute.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                buyer: {
                    select: { id: true, name: true, email: true },
                },
                orderItem: {
                    include: {
                        order: {
                            select: { id: true, total: true, currency: true },
                        },
                        product: {
                            select: {
                                title: true,
                                seller: { select: { id: true, name: true } },
                            },
                        },
                    },
                },
            },
        });
    }
    async resolve(disputeId, dto) {
        var _a;
        const d = await this.prisma.dispute.findUnique({
            where: { id: disputeId },
            include: {
                orderItem: true,
            },
        });
        if (!d)
            throw new common_1.NotFoundException('Dispute not found');
        const actor = await this.prisma.user.findUnique({
            where: { id: dto.actorId },
        });
        if (!actor)
            throw new common_1.ForbiddenException('Unknown actor');
        const isAdmin = actor.role === 'ADMIN';
        const isSellerOwner = actor.id === d.orderItem.sellerId;
        if (!isAdmin && !isSellerOwner) {
            throw new common_1.ForbiddenException('Not allowed to resolve this dispute');
        }
        const now = new Date();
        const updatedDispute = await this.prisma.dispute.update({
            where: { id: disputeId },
            data: {
                status: dto.status,
                resolutionNote: dto.resolutionNote || null,
                resolvedById: dto.actorId,
                resolvedAt: now,
            },
            include: {
                buyer: {
                    select: {
                        id: true,
                    },
                },
                orderItem: {
                    select: {
                        orderId: true,
                    },
                },
            },
        });
        try {
            await this.notifications.notifyDisputeResolved(updatedDispute.buyer.id, disputeId, dto.status, dto.resolutionNote, (_a = updatedDispute.orderItem) === null || _a === void 0 ? void 0 : _a.orderId);
        }
        catch (error) {
            this.logger.error(`Failed to send dispute resolved notification: ${error.message}`);
        }
        let nextFulfillment = null;
        if (dto.status === 'RESOLVED_REDELIVERED') {
            nextFulfillment = 'DELIVERED';
        }
        else if (dto.status === 'RESOLVED_BUYER_COMPENSATED') {
            nextFulfillment = 'ISSUE';
        }
        else if (dto.status === 'REJECTED') {
            nextFulfillment = 'DELIVERED';
        }
        else {
            nextFulfillment = null;
        }
        if (nextFulfillment) {
            await this.prisma.orderItem.update({
                where: { id: d.orderItemId },
                data: {
                    fulfillmentStatus: nextFulfillment,
                },
            });
        }
        return updatedDispute;
    }
};
exports.DisputesService = DisputesService;
exports.DisputesService = DisputesService = DisputesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], DisputesService);
//# sourceMappingURL=disputes.service.js.map