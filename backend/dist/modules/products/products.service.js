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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ProductsService = class ProductsService {
    async getByIds(idArray) {
        return this.prisma.product.findMany({
            where: { id: { in: idArray } },
        });
    }
    async list(filters) {
        return this.prisma.product.findMany({
            where: filters || {},
            include: {
                seller: {
                    select: {
                        id: true,
                        shopName: true,
                        ratingAvg: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getById(id) {
        return this.getProductById(id);
    }
    create(body) {
        return this.createProduct(body);
    }
    async update(id, body) {
        return this.updateProduct(id, body);
    }
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProduct(data) {
        const product = await this.prisma.product.create({
            data: {
                sellerId: data.sellerId,
                title: data.title,
                description: data.description,
                price: data.price,
                currency: data.currency || 'USD',
                imageUrl: data.imageUrl,
                category: data.category,
            },
        });
        await this.prisma.inventory.create({
            data: {
                productId: product.id,
                quantity: 0,
            },
        });
        return product;
    }
    async getSellerProducts(sellerId) {
        const products = await this.prisma.product.findMany({
            where: { sellerId },
            include: {
                inventory: true,
                _count: {
                    select: {
                        views: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return products;
    }
    async getProductById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                seller: {
                    select: {
                        id: true,
                        shopName: true,
                        shopLogoUrl: true,
                        ratingAvg: true,
                        ratingCount: true,
                    },
                },
                inventory: true,
                _count: {
                    select: {
                        views: true,
                    },
                },
            },
        });
        return product;
    }
    async updateProduct(productId, data) {
        const product = await this.prisma.product.update({
            where: { id: productId },
            data,
        });
        return product;
    }
    async updateInventory(productId, quantity) {
        const inventory = await this.prisma.inventory.upsert({
            where: { productId },
            update: { quantity },
            create: {
                productId,
                quantity,
            },
        });
        return inventory;
    }
    async deleteProduct(productId) {
        const product = await this.prisma.product.delete({
            where: { id: productId },
        });
        return product;
    }
    async recordProductView(userId, productId) {
        await this.prisma.productView.create({
            data: {
                userId,
                productId,
            },
        });
        const product = await this.prisma.product.update({
            where: { id: productId },
            data: {
                viewCount: {
                    increment: 1,
                },
            },
        });
        return product;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map