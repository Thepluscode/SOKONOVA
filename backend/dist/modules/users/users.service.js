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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOneByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        return user;
    }
    async findOneById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        return user;
    }
    async createUser(data) {
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                role: data.role || 'BUYER',
            },
        });
        return user;
    }
    async updateUserProfile(userId, data) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data,
        });
        return user;
    }
    async updateSellerProfile(userId, data) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data,
        });
        return user;
    }
    async updateNotificationPreferences(userId, data) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data,
        });
        return user;
    }
    async getSellerByHandle(handle) {
        const seller = await this.prisma.user.findFirst({
            where: {
                sellerHandle: handle,
                role: 'SELLER',
            },
            include: {
                products: {
                    take: 12,
                    include: {
                        _count: {
                            select: {
                                views: true,
                            },
                        },
                    },
                },
            },
        });
        return seller;
    }
    async getBuyerProfile(userId) {
        const buyer = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                orders: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        items: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
            },
        });
        return buyer;
    }
    async getSellerProfile(userId) {
        const seller = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                products: {
                    take: 20,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        _count: {
                            select: {
                                views: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        });
        return seller;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map