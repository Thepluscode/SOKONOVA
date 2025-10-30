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
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.product.findMany();
    }
    findOne(id) {
        return this.prisma.product.findUnique({ where: { id } });
    }
    listAll() {
        return this.prisma.product.findMany({
            include: { inventory: true, seller: { select: { id: true, name: true } } },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
    getById(id) {
        return this.prisma.product.findUnique({
            where: { id },
            include: { inventory: true, seller: { select: { id: true, name: true } } },
        });
    }
    async create(dto) {
        const product = await this.prisma.product.create({
            data: {
                sellerId: dto.sellerId,
                title: dto.title,
                description: dto.description,
                price: dto.price,
                currency: dto.currency,
                imageUrl: dto.imageUrl,
                inventory: { create: { quantity: 100 } },
            },
        });
        return product;
    }
    async sellerList(sellerId) {
        return this.prisma.product.findMany({
            where: { sellerId },
            include: {
                inventory: true,
                orderItems: {
                    include: {
                        order: {
                            select: {
                                id: true,
                                status: true,
                                createdAt: true,
                                userId: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async sellerUpdate(sellerId, productId, data) {
        const existing = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (existing.sellerId !== sellerId) {
            throw new common_1.ForbiddenException('Not authorized to update this product');
        }
        return this.prisma.product.update({
            where: { id: productId },
            data,
        });
    }
    async sellerUpdateInventory(sellerId, productId, quantity) {
        const existing = await this.prisma.product.findUnique({
            where: { id: productId },
            include: { inventory: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (existing.sellerId !== sellerId) {
            throw new common_1.ForbiddenException('Not authorized to update inventory');
        }
        if (existing.inventory) {
            return this.prisma.inventory.update({
                where: { productId: productId },
                data: { quantity },
            });
        }
        else {
            return this.prisma.inventory.create({
                data: {
                    productId: productId,
                    quantity,
                },
            });
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map