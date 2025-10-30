
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } })
  }

  findOrCreateByEmail(email: string, name?: string, role?: string) {
    return this.prisma.user.upsert({
      where: { email },
      update: { name },
      create: {
        email,
        name,
        role: role === 'SELLER' ? 'SELLER' : role === 'ADMIN' ? 'ADMIN' : 'BUYER',
      },
    })
  }

  async updateStorefrontProfile(
    userId: string,
    data: {
      shopName?: string;
      sellerHandle?: string;
      shopLogoUrl?: string;
      shopBannerUrl?: string;
      shopBio?: string;
      country?: string;
      city?: string;
    }
  ) {
    // We trust 'sellerHandle' uniqueness because it's unique in schema;
    // Prisma will throw if duplicate.
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        shopName: true,
        sellerHandle: true,
        shopLogoUrl: true,
        shopBannerUrl: true,
        shopBio: true,
        country: true,
        city: true,
        ratingAvg: true,
        ratingCount: true,
      },
    });
  }
}
