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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let CartService = class CartService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCart(cartId) {
        return this.prisma.cart.findUnique({
            where: { id: cartId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }
    async ensureCartForUser(userId, anonKey) {
        if (userId) {
            let cart = await this.prisma.cart.findFirst({
                where: { userId },
                include: { items: { include: { product: true } } },
            });
            if (!cart) {
                cart = await this.prisma.cart.create({
                    data: { userId },
                    include: { items: { include: { product: true } } },
                });
            }
            return cart;
        }
        if (anonKey) {
            let cart = await this.prisma.cart.findFirst({
                where: { anonKey },
                include: { items: { include: { product: true } } },
            });
            if (!cart) {
                cart = await this.prisma.cart.create({
                    data: { anonKey },
                    include: { items: { include: { product: true } } },
                });
            }
            return cart;
        }
        return this.prisma.cart.create({
            data: {},
            include: { items: { include: { product: true } } },
        });
    }
    async addItem(cartId, productId, qty) {
        const existing = await this.prisma.cartItem.findFirst({
            where: { cartId, productId },
        });
        if (existing) {
            return this.prisma.cartItem.update({
                where: { id: existing.id },
                data: { qty: existing.qty + qty },
            });
        }
        return this.prisma.cartItem.create({
            data: { cartId, productId, qty },
        });
    }
    async removeItem(cartId, productId) {
        return this.prisma.cartItem.deleteMany({
            where: { cartId, productId },
        });
    }
    async clear(cartId) {
        return this.prisma.cartItem.deleteMany({
            where: { cartId },
        });
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map