
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany()
  }

  findOne(id: string) {
    return this.prisma.product.findUnique({ where: { id } })
  }

  listAll() {
    return this.prisma.product.findMany({
      include: { inventory: true, seller: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
  }

  getById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { inventory: true, seller: { select: { id: true, name: true } } },
    })
  }

  async create(dto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        sellerId: dto.sellerId,
        title: dto.title,
        description: dto.description,
        price: dto.price,
        currency: dto.currency,
        imageUrl: dto.imageUrl,
        inventory: { create: { quantity: 100 } },
      },
    })
    return product
  }

  // ========== SELLER-SCOPED METHODS ==========

  /**
   * Return only products owned by this seller
   */
  async sellerList(sellerId: string) {
    return this.prisma.product.findMany({
      where: { sellerId },
      include: {
        inventory: true,
        orderItems: {
          include: {
            order: {
              select: {
                id: true,
                status: true,
                createdAt: true,
                userId: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Update a product if the seller owns it
   */
  async sellerUpdate(sellerId: string, productId: string, data: UpdateProductDto) {
    // Verify ownership
    const existing = await this.prisma.product.findUnique({
      where: { id: productId },
    })

    if (!existing) {
      throw new NotFoundException('Product not found')
    }

    if (existing.sellerId !== sellerId) {
      throw new ForbiddenException('Not authorized to update this product')
    }

    return this.prisma.product.update({
      where: { id: productId },
      data,
    })
  }

  /**
   * Update inventory for a product if the seller owns it
   */
  async sellerUpdateInventory(sellerId: string, productId: string, quantity: number) {
    const existing = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { inventory: true },
    })

    if (!existing) {
      throw new NotFoundException('Product not found')
    }

    if (existing.sellerId !== sellerId) {
      throw new ForbiddenException('Not authorized to update inventory')
    }

    if (existing.inventory) {
      return this.prisma.inventory.update({
        where: { productId: productId },
        data: { quantity },
      })
    } else {
      return this.prisma.inventory.create({
        data: {
          productId: productId,
          quantity,
        },
      })
    }
  }
}
