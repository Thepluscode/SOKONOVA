import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SocialService {
  constructor(private prisma: PrismaService) {}

  // Get community stories
  async getCommunityStories(limit: number = 10) {
    return this.prisma.communityStory.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            sellerHandle: true,
            shopName: true,
            shopLogoUrl: true,
          },
        },
        product: {
          select: {
            title: true,
            imageUrl: true,
            price: true,
            currency: true,
          },
        },
      },
    });
  }

  // Create community story
  async createCommunityStory(data: { 
    userId: string; 
    productId: string; 
    content: string; 
    imageUrl?: string;
  }) {
    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Verify product exists
    const product = await this.prisma.product.findFirst({
      where: { id: data.productId, isActive: true },
    });
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    // Create community story
    return this.prisma.communityStory.create({
      data: {
        userId: data.userId,
        productId: data.productId,
        content: data.content,
        imageUrl: data.imageUrl,
      },
      include: {
        user: {
          select: {
            name: true,
            sellerHandle: true,
            shopName: true,
            shopLogoUrl: true,
          },
        },
        product: {
          select: {
            title: true,
            imageUrl: true,
            price: true,
            currency: true,
          },
        },
      },
    });
  }

  // Get influencer storefronts
  async getInfluencerStorefronts(limit: number = 10) {
    // For now, we'll treat top-rated sellers as influencers
    const influencers = await this.prisma.user.findMany({
      where: {
        role: 'SELLER',
        ratingAvg: { gte: 4.5 },
        ratingCount: { gte: 10 },
      },
      take: limit,
      orderBy: [
        { ratingAvg: 'desc' },
        { ratingCount: 'desc' },
      ],
      select: {
        id: true,
        name: true,
        sellerHandle: true,
        shopName: true,
        shopLogoUrl: true,
        shopBannerUrl: true,
        bio: true,
        city: true,
        country: true,
        ratingAvg: true,
        ratingCount: true,
        products: {
          take: 6,
          select: {
            id: true,
            title: true,
            price: true,
            currency: true,
            imageUrl: true,
          },
        },
      },
    });
    
    return influencers;
  }

  // Get influencer storefront by ID
  async getInfluencerStorefront(id: string) {
    const influencer = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        sellerHandle: true,
        shopName: true,
        shopLogoUrl: true,
        shopBannerUrl: true,
        bio: true,
        city: true,
        country: true,
        ratingAvg: true,
        ratingCount: true,
        products: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            currency: true,
            imageUrl: true,
            category: true,
            ratingAvg: true,
            ratingCount: true,
          },
        },
      },
    });
    
    return influencer;
  }
}
