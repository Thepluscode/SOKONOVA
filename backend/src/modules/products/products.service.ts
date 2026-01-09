import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductsService {
  [x: string]: any;
  async getByIds(idArray: string[]) {
    return this.prisma.product.findMany({
      where: { id: { in: idArray } },
    });
  }
  async list(filters?: { sellerId?: string; category?: string; }) {
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
  async getById(id: string) {
    return this.getProductById(id);
  }
  create(body: { sellerId: string; title: string; description: string; price: number; currency?: string; imageUrl?: string; category?: string; }) {
    return this.createProduct(body);
  }
  async update(id: string, body: { title?: string; description?: string; price?: number; currency?: string; imageUrl?: string; category?: string; }) {
    return this.updateProduct(id, body);
  }
  constructor(private prisma: PrismaService) {}

  async createProduct(data: {
    sellerId: string;
    title: string;
    description: string;
    price: number;
    currency?: string;
    imageUrl?: string;
    category?: string;
  }) {
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

    // Create inventory record
    await this.prisma.inventory.create({
      data: {
        productId: product.id,
        quantity: 0,
      },
    });

    return product;
  }

  async getSellerProducts(sellerId: string) {
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

  async getProductById(id: string) {
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

  async updateProduct(
    productId: string,
    data: {
      title?: string;
      description?: string;
      price?: number;
      currency?: string;
      imageUrl?: string;
      category?: string;
    },
  ) {
    const product = await this.prisma.product.update({
      where: { id: productId },
      data,
    });

    return product;
  }

  async updateInventory(productId: string, quantity: number) {
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

  async deleteProduct(productId: string) {
    // Soft delete by marking as inactive or actually delete
    const product = await this.prisma.product.delete({
      where: { id: productId },
    });

    return product;
  }

  async recordProductView(userId: string, productId: string) {
    // Record the view
    await this.prisma.productView.create({
      data: {
        userId,
        productId,
      },
    });

    // Update product view count
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
}