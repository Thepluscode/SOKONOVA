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
    async createFromCart(dto, cartId) {
        const cart = await this.prisma.cart.findUnique({
            where: { id: cartId },
            include: { items: { include: { product: true } } },
        });
        if (!cart || !cart.items.length) {
            throw new Error('Cart empty or not found');
        }
        const order = await this.prisma.$transaction(async (tx) => {
            const created = await tx.order.create({
                data: {
                    userId: dto.userId,
                    total: dto.total,
                    currency: dto.currency,
                    status: 'PENDING',
                    shippingAdr: dto.shippingAdr,
                },
            });
            for (const ci of cart.items) {
                const sellerId = ci.product.sellerId;
                const unitPrice = Number(ci.product.price);
                const qty = ci.qty;
                const gross = unitPrice * qty;
                const fee = gross * 0.10;
                const net = gross - fee;
                await tx.orderItem.create({
                    data: {
                        orderId: created.id,
                        productId: ci.productId,
                        qty,
                        price: ci.product.price,
                        sellerId,
                        grossAmount: gross,
                        feeAmount: fee,
                        netAmount: net,
                        payoutStatus: 'PENDING',
                        currency: ci.product.currency || 'USD',
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