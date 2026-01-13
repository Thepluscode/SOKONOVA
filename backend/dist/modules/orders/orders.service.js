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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listForUser(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            include: {
                items: { include: { product: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async listForSeller(sellerId) {
        return this.prisma.order.findMany({
            where: {
                items: {
                    some: {
                        sellerId,
                    },
                },
            },
            include: {
                items: {
                    where: { sellerId },
                    include: { product: true },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                seller: {
                                    select: {
                                        id: true,
                                        name: true,
                                        sellerHandle: true,
                                        shopLogoUrl: true,
                                    },
                                },
                            },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    calculateFee(grossAmount) {
        const gross = grossAmount;
        const fee = gross * 0.10;
        const net = gross - fee;
        return { gross, fee, net };
    }
    async createDirect(userId, items, total, currency) {
        let calculatedTotal = 0;
        const orderItemsData = [];
        for (const item of items) {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product ${item.productId} not found`);
            }
            const lineTotal = item.price * item.qty;
            calculatedTotal += lineTotal;
            const { gross, fee, net } = this.calculateFee(lineTotal);
            orderItemsData.push({
                productId: item.productId,
                qty: item.qty,
                price: item.price,
                sellerId: product.sellerId,
                grossAmount: gross,
                feeAmount: fee,
                netAmount: net,
                payoutStatus: 'PENDING',
                currency: currency || 'USD',
            });
        }
        const order = await this.prisma.$transaction(async (tx) => {
            const created = await tx.order.create({
                data: {
                    userId,
                    total: calculatedTotal,
                    currency,
                    status: 'PENDING',
                },
            });
            for (const itemData of orderItemsData) {
                await tx.orderItem.create({
                    data: {
                        orderId: created.id,
                        ...itemData,
                    },
                });
            }
            return created;
        });
        return order;
    }
    async createFromCart(dto, cartId) {
        const cart = await this.prisma.cart.findUnique({
            where: { id: cartId },
            include: { items: { include: { product: true } } },
        });
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
        }
        if (cart.userId !== dto.userId) {
            throw new common_1.ForbiddenException('You do not have permission to access this cart');
        }
        if (!cart.items.length) {
            throw new Error('Cart is empty');
        }
        let calculatedTotal = 0;
        const orderItemsData = [];
        for (const ci of cart.items) {
            const unitPrice = Number(ci.product.price);
            const qty = ci.qty;
            const lineTotal = unitPrice * qty;
            calculatedTotal += lineTotal;
            const sellerId = ci.product.sellerId;
            const { gross, fee, net } = this.calculateFee(lineTotal);
            orderItemsData.push({
                productId: ci.productId,
                qty,
                price: ci.product.price,
                sellerId,
                grossAmount: gross,
                feeAmount: fee,
                netAmount: net,
                payoutStatus: 'PENDING',
                currency: ci.product.currency || 'USD',
            });
        }
        const tolerance = 0.01;
        if (Math.abs(dto.total - calculatedTotal) > tolerance) {
            throw new Error(`Total mismatch: expected ${calculatedTotal}, got ${dto.total}`);
        }
        const order = await this.prisma.$transaction(async (tx) => {
            const created = await tx.order.create({
                data: {
                    userId: dto.userId,
                    total: calculatedTotal,
                    currency: dto.currency,
                    status: 'PENDING',
                    shippingAdr: dto.shippingAdr,
                },
            });
            for (const itemData of orderItemsData) {
                await tx.orderItem.create({
                    data: {
                        orderId: created.id,
                        ...itemData,
                    },
                });
            }
            await tx.cartItem.deleteMany({ where: { cartId } });
            return created;
        });
        return order;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map