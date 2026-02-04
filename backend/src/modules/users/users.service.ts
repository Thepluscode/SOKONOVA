import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    
    return user;
  }

  async findOneById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    
    return user;
  }

  async createUser(data: {
    email: string;
    name?: string;
    role?: string;
  }) {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: data.role || 'BUYER',
      },
    });
    
    return user;
  }

  async updateUserProfile(
    userId: string,
    data: {
      name?: string;
      city?: string;
      country?: string;
      phone?: string;
      bio?: string;
    },
  ) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });
    
    return user;
  }

  async updateSellerProfile(
    userId: string,
    data: {
      shopName?: string;
      shopLogoUrl?: string;
      shopBannerUrl?: string;
      shopBio?: string;
      sellerHandle?: string;
    },
  ) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });
    
    return user;
  }

  async updateNotificationPreferences(
    userId: string,
    data: {
      notifyEmail?: boolean;
      notifySms?: boolean;
      notifyPush?: boolean;
    },
  ) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });
    
    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.password) {
      throw new BadRequestException('Password change not available for this account');
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    if (currentPassword === newPassword) {
      throw new BadRequestException('New password must be different');
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    return { success: true };
  }

  async getSellerByHandle(handle: string) {
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

  async getBuyerProfile(userId: string) {
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

  async getSellerProfile(userId: string) {
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
}
