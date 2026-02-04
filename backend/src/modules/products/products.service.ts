import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductsService {
  [x: string]: any;
  async getByIds(idArray: string[]) {
    return this.prisma.product.findMany({
      where: { id: { in: idArray }, isActive: true },
    });
  }
  async list(filters?: { sellerId?: string; category?: string; }) {
    return this.prisma.product.findMany({
      where: { ...(filters || {}), isActive: true },
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
      where: { sellerId, isActive: true },
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
    const product = await this.prisma.product.findFirst({
      where: { id, isActive: true },
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
    const product = await this.prisma.product.update({
      where: { id: productId },
      data: { isActive: false },
    });

    return product;
  }

  async sellerList(sellerId: string) {
    return this.getSellerProducts(sellerId);
  }

  async sellerListArchived(sellerId: string) {
    return this.prisma.product.findMany({
      where: { sellerId, isActive: false },
      include: {
        inventory: true,
        _count: {
          select: {
            views: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async sellerUpdate(
    sellerId: string,
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
    const product = await this.prisma.product.findFirst({
      where: { id: productId, sellerId, isActive: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.update({
      where: { id: productId },
      data,
    });
  }

  async sellerUpdateInventory(
    sellerId: string,
    productId: string,
    quantity: number,
  ) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, sellerId, isActive: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.updateInventory(productId, quantity);
  }

  async sellerDelete(sellerId: string, productId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, sellerId, isActive: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: { isActive: false },
    });
  }

  async sellerRestore(sellerId: string, productId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, sellerId, isActive: false },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: { isActive: true },
    });
  }

  async recordProductView(userId: string, productId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, isActive: true },
      select: { id: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Record the view
    await this.prisma.productView.create({
      data: {
        userId,
        productId,
      },
    });

    // Update product view count
    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    return updatedProduct;
  }
}
