
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(cartId: string) {
    return this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })
  }

  async ensureCartForUser(userId?: string, anonKey?: string) {
    if (userId) {
      let cart = await this.prisma.cart.findFirst({
        where: { userId },
        include: { items: { include: { product: true } } },
      })
      if (!cart) {
        cart = await this.prisma.cart.create({
          data: { userId },
          include: { items: { include: { product: true } } },
        })
      }
      return cart
    }
    if (anonKey) {
      let cart = await this.prisma.cart.findFirst({
        where: { anonKey },
        include: { items: { include: { product: true } } },
      })
      if (!cart) {
        cart = await this.prisma.cart.create({
          data: { anonKey },
          include: { items: { include: { product: true } } },
        })
      }
      return cart
    }
    return this.prisma.cart.create({
      data: {},
      include: { items: { include: { product: true } } },
    })
  }

  async addItem(cartId: string, productId: string, qty: number) {
    const existing = await this.prisma.cartItem.findFirst({
      where: { cartId, productId },
    })
    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { qty: existing.qty + qty },
      })
    }
    return this.prisma.cartItem.create({
      data: { cartId, productId, qty },
    })
  }

  async removeItem(cartId: string, productId: string) {
    return this.prisma.cartItem.deleteMany({
      where: { cartId, productId },
    })
  }

  async clear(cartId: string) {
    return this.prisma.cartItem.deleteMany({
      where: { cartId },
    })
  }
}
