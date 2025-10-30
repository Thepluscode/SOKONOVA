import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ApplyDto } from './dto/apply.dto';
import { ModerateDto } from './dto/moderate.dto';

@Injectable()
export class SellerApplicationsService {
  constructor(private prisma: PrismaService) {}

  // 1. User applies
  async apply(dto: ApplyDto) {
    // Check if this user already applied
    const existing = await this.prisma.sellerApplication.findUnique({
      where: { userId: dto.userId },
    });
    if (existing && existing.status !== 'REJECTED') {
      throw new BadRequestException(
        'Application already submitted or approved.',
      );
    }

    // Upsert logic: if REJECTED, let them re-apply (nice touch for iteration)
    return this.prisma.sellerApplication.upsert({
      where: { userId: dto.userId },
      update: {
        businessName: dto.businessName,
        phone: dto.phone,
        country: dto.country,
        city: dto.city,
        storefrontDesc: dto.storefrontDesc,
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
        status: 'PENDING',
      },
    });
  }

  // 2. Applicant can view their own status
  async getMine(userId: string) {
    return this.prisma.sellerApplication.findUnique({
      where: { userId },
    });
  }

  // 3. Admin queue
  async listPending(adminId: string) {
    // You'd normally verify adminId belongs to an ADMIN user.
    const adminUser = await this.prisma.user.findUnique({
      where: { id: adminId },
    });
    if (!adminUser || adminUser.role !== 'ADMIN') {
      throw new ForbiddenException('Not authorized');
    }

    return this.prisma.sellerApplication.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { id: true, email: true, name: true, role: true } },
      },
    });
  }

  // 4. Admin approves
  async approve(appId: string, dto: ModerateDto) {
    // Check admin
    const adminUser = await this.prisma.user.findUnique({
      where: { id: dto.adminId },
    });
    if (!adminUser || adminUser.role !== 'ADMIN') {
      throw new ForbiddenException('Not authorized');
    }

    // Fetch application
    const app = await this.prisma.sellerApplication.findUnique({
      where: { id: appId },
    });
    if (!app) throw new NotFoundException('Application not found');

    // Transaction: mark APPROVED + promote user to SELLER
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

  // 5. Admin rejects
  async reject(appId: string, dto: ModerateDto) {
    const adminUser = await this.prisma.user.findUnique({
      where: { id: dto.adminId },
    });
    if (!adminUser || adminUser.role !== 'ADMIN') {
      throw new ForbiddenException('Not authorized');
    }

    const app = await this.prisma.sellerApplication.findUnique({
      where: { id: appId },
    });
    if (!app) throw new NotFoundException('Application not found');

    const now = new Date();
    const updatedApp = await this.prisma.sellerApplication.update({
      where: { id: appId },
      data: {
        status: 'REJECTED',
        adminNote: dto.adminNote || null,
        reviewedAt: now,
      },
    });

    // Notice: We do NOT promote user when rejected 🙂.
    return updatedApp;
  }
}
