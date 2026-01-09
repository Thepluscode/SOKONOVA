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
exports.SellerApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let SellerApplicationsService = class SellerApplicationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async apply(dto) {
        const existing = await this.prisma.sellerApplication.findUnique({
            where: { userId: dto.userId },
        });
        if (existing && existing.status !== 'REJECTED') {
            throw new common_1.BadRequestException('Application already submitted or approved.');
        }
        return this.prisma.sellerApplication.upsert({
            where: { userId: dto.userId },
            update: {
                businessName: dto.businessName,
                phone: dto.phone,
                country: dto.country,
                city: dto.city,
                storefrontDesc: dto.storefrontDesc,
                bankName: dto.bankName || null,
                accountNumber: dto.accountNumber || null,
                accountName: dto.accountName || null,
                bankCode: dto.bankCode || null,
                status: 'PENDING',
                adminNote: null,
                reviewedAt: null,
            },
            create: {
                userId: dto.userId,
                businessName: dto.businessName,
                phone: dto.phone,
                country: dto.country,
                city: dto.city,
                storefrontDesc: dto.storefrontDesc,
                bankName: dto.bankName || null,
                accountNumber: dto.accountNumber || null,
                accountName: dto.accountName || null,
                bankCode: dto.bankCode || null,
                status: 'PENDING',
            },
        });
    }
    async applyAndActivateInstantly(dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: dto.userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.role === 'SELLER' || user.role === 'ADMIN') {
            throw new common_1.BadRequestException('User is already a seller');
        }
        const now = new Date();
        const [application, updatedUser] = await this.prisma.$transaction([
            this.prisma.sellerApplication.upsert({
                where: { userId: dto.userId },
                update: {
                    businessName: dto.businessName,
                    phone: dto.phone,
                    country: dto.country,
                    city: dto.city,
                    storefrontDesc: dto.storefrontDesc,
                    bankName: dto.bankName || null,
                    accountNumber: dto.accountNumber || null,
                    accountName: dto.accountName || null,
                    bankCode: dto.bankCode || null,
                    status: 'APPROVED',
                    adminNote: 'Auto-approved for MVP launch',
                    reviewedAt: now,
                },
                create: {
                    userId: dto.userId,
                    businessName: dto.businessName,
                    phone: dto.phone,
                    country: dto.country,
                    city: dto.city,
                    storefrontDesc: dto.storefrontDesc,
                    bankName: dto.bankName || null,
                    accountNumber: dto.accountNumber || null,
                    accountName: dto.accountName || null,
                    bankCode: dto.bankCode || null,
                    status: 'APPROVED',
                    adminNote: 'Auto-approved for MVP launch',
                    reviewedAt: now,
                },
            }),
            this.prisma.user.update({
                where: { id: dto.userId },
                data: {
                    role: 'SELLER',
                    shopName: dto.businessName,
                },
            }),
        ]);
        return {
            success: true,
            application,
            user: updatedUser,
            message: 'Seller activated instantly! You can now list products.',
        };
    }
    async getMine(userId) {
        return this.prisma.sellerApplication.findUnique({
            where: { userId },
        });
    }
    async listPending(adminId) {
        const adminUser = await this.prisma.user.findUnique({
            where: { id: adminId },
        });
        if (!adminUser || adminUser.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Not authorized');
        }
        return this.prisma.sellerApplication.findMany({
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'asc' },
            include: {
                user: { select: { id: true, email: true, name: true, role: true } },
            },
        });
    }
    async approve(appId, dto) {
        const adminUser = await this.prisma.user.findUnique({
            where: { id: dto.adminId },
        });
        if (!adminUser || adminUser.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Not authorized');
        }
        const app = await this.prisma.sellerApplication.findUnique({
            where: { id: appId },
        });
        if (!app)
            throw new common_1.NotFoundException('Application not found');
        const now = new Date();
        const [updatedApp, updatedUser] = await this.prisma.$transaction([
            this.prisma.sellerApplication.update({
                where: { id: appId },
                data: {
                    status: 'APPROVED',
                    adminNote: dto.adminNote || null,
                    reviewedAt: now,
                },
            }),
            this.prisma.user.update({
                where: { id: app.userId },
                data: { role: 'SELLER' },
            }),
        ]);
        return { application: updatedApp, user: updatedUser };
    }
    async reject(appId, dto) {
        const adminUser = await this.prisma.user.findUnique({
            where: { id: dto.adminId },
        });
        if (!adminUser || adminUser.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Not authorized');
        }
        const app = await this.prisma.sellerApplication.findUnique({
            where: { id: appId },
        });
        if (!app)
            throw new common_1.NotFoundException('Application not found');
        const now = new Date();
        const updatedApp = await this.prisma.sellerApplication.update({
            where: { id: appId },
            data: {
                status: 'REJECTED',
                adminNote: dto.adminNote || null,
                reviewedAt: now,
            },
        });
        return updatedApp;
    }
};
exports.SellerApplicationsService = SellerApplicationsService;
exports.SellerApplicationsService = SellerApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SellerApplicationsService);
//# sourceMappingURL=seller-applications.service.js.map