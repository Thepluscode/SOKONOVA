import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductViewsService {
  constructor(private prisma: PrismaService) {}

  // Track a product view for personalized recommendations
  async trackView(userId: string, productId: string) {
    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Create product view record
    const productView = await this.prisma.productView.create({
      data: {
        userId,
        productId,
      },
    });
    
    return {
      success: true,
      productView,
    };
  }
}