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
        return this.prisma.$transaction(async (tx) => {
            const cart = await tx.cart.findUnique({
                where: { id: cartId },
                include: { items: true },
            });
            if (!cart) {
                throw new common_1.NotFoundException('Cart not found');
            }
            const currentVersion = cart.version;
            const product = await tx.product.findUnique({
                where: { id: productId },
                include: { inventory: true },
            });
            if (!product) {
                throw new common_1.NotFoundException('Product not found');
            }
            const existingItem = cart.items.find(item => item.productId === productId);
            const currentQty = (existingItem === null || existingItem === void 0 ? void 0 : existingItem.qty) || 0;
            const newTotalQty = currentQty + qty;
            if (product.inventory && product.inventory.quantity < newTotalQty) {
                throw new common_1.BadRequestException(`Only ${product.inventory.quantity} units available. You currently have ${currentQty} in cart.`);
            }
            const cartItem = await tx.cartItem.findFirst({
                where: {
                    cartId,
                    productId
                }
            });
            let updatedItem;
            if (cartItem) {
                updatedItem = await tx.cartItem.update({
                    where: {
                        id: cartItem.id
                    },
                    data: {
                        qty: { increment: qty },
                        updatedAt: new Date()
                    },
                    include: {
                        product: true
                    }
                });
            }
            else {
                updatedItem = await tx.cartItem.create({
                    data: {
                        cartId,
                        productId,
                        qty
                    },
                    include: {
                        product: true
                    }
                });
            }
            const updatedCart = await tx.cart.update({
                where: {
                    id: cartId,
                    version: currentVersion
                },
                data: {
                    version: { increment: 1 },
                    updatedAt: new Date()
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
            return updatedCart;
        });
    }
    async removeItem(cartId, productId) {
        return this.prisma.$transaction(async (tx) => {
            const cart = await tx.cart.findUnique({
                where: { id: cartId },
                include: { items: true },
            });
            if (!cart) {
                throw new common_1.NotFoundException('Cart not found');
            }
            const currentVersion = cart.version;
            await tx.cartItem.deleteMany({
                where: { cartId, productId },
            });
            const updatedCart = await tx.cart.update({
                where: {
                    id: cartId,
                    version: currentVersion
                },
                data: {
                    version: { increment: 1 },
                    updatedAt: new Date()
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
            return updatedCart;
        });
    }
    async clear(cartId) {
        return this.prisma.$transaction(async (tx) => {
            const cart = await tx.cart.findUnique({
                where: { id: cartId },
                include: { items: true },
            });
            if (!cart) {
                throw new common_1.NotFoundException('Cart not found');
            }
            const currentVersion = cart.version;
            await tx.cartItem.deleteMany({
                where: { cartId },
            });
            const updatedCart = await tx.cart.update({
                where: {
                    id: cartId,
                    version: currentVersion
                },
                data: {
                    version: { increment: 1 },
                    updatedAt: new Date()
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
            return updatedCart;
        });
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map