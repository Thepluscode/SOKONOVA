import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SponsoredPlacementStatus } from '@prisma/client';

@Injectable()
export class SponsoredPlacementsService {
  constructor(private prisma: PrismaService) {}

  async createSponsoredPlacement(data: {
    sellerId: string;
    productId: string;
    categorySlug?: string;
    searchTerm?: string;
    bidAmount: number;
    startDate: Date;
    endDate: Date;
  }) {
    const placement = await this.prisma.sponsoredPlacement.create({
      data: {
        sellerId: data.sellerId,
        productId: data.productId,
        categorySlug: data.categorySlug,
        searchTerm: data.searchTerm,
        bidAmount: data.bidAmount,
        startDate: data.startDate,
        endDate: data.endDate,
        status: 'PENDING' as SponsoredPlacementStatus,
      },
    });
    
    return placement;
  }

  async getSellerSponsoredPlacements(sellerId: string) {
    const placements = await this.prisma.sponsoredPlacement.findMany({
      where: { sellerId },
      include: {
        product: {
          select: {
            title: true,
            imageUrl: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return placements;
  }

  async updateSponsoredPlacement(id: string, data: { bidAmount?: number; startDate?: Date; endDate?: Date }) {
    const placement = await this.prisma.sponsoredPlacement.update({
      where: { id },
      data,
    });
    
    return placement;
  }

  async deleteSponsoredPlacement(id: string) {
    const placement = await this.prisma.sponsoredPlacement.delete({
      where: { id },
    });
    
    return placement;
  }

  async getSponsoredPlacementsForSearch(term: string) {
    const placements = await this.prisma.sponsoredPlacement.findMany({
      where: {
        searchTerm: term,
        status: 'ACTIVE' as SponsoredPlacementStatus,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
      include: {
        product: {
          select: {
            title: true,
            imageUrl: true,
            price: true,
          },
        },
      },
    });
    
    return placements;
  }

  async getSponsoredPlacementsForCategory(slug: string) {
    const placements = await this.prisma.sponsoredPlacement.findMany({
      where: {
        categorySlug: slug,
        status: 'ACTIVE' as SponsoredPlacementStatus,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
      include: {
        product: {
          select: {
            title: true,
            imageUrl: true,
            price: true,
          },
        },
      },
    });
    
    return placements;
  }

  async getAllSponsoredPlacements() {
    const placements = await this.prisma.sponsoredPlacement.findMany({
      include: {
        product: {
          select: {
            title: true,
            imageUrl: true,
            price: true,
          },
        },
        seller: {
          select: {
            shopName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return placements;
  }

  async updateSponsoredPlacementStatus(id: string, status: SponsoredPlacementStatus) {
    const placement = await this.prisma.sponsoredPlacement.update({
      where: { id },
      data: { status },
    });
    
    return placement;
  }
}