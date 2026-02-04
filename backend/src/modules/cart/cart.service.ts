import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
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
    // Use transaction for atomicity and inventory checking
    return this.prisma.$transaction(async (tx) => {
      // 1. Verify cart exists and get current version
      const cart = await tx.cart.findUnique({
        where: { id: cartId },
        include: { items: true },
      })

      if (!cart) {
        throw new NotFoundException('Cart not found')
      }

      const currentVersion = cart.version;

      // 2. Verify product exists and check inventory
      const product = await tx.product.findFirst({
        where: { id: productId, isActive: true },
        include: { inventory: true },
      })

      if (!product) {
        throw new NotFoundException('Product not found')
      }

      // 3. Check inventory availability
      const existingItem = cart.items.find(item => item.productId === productId)
      const currentQty = existingItem?.qty || 0
      const newTotalQty = currentQty + qty

      if (product.inventory && product.inventory.quantity < newTotalQty) {
        throw new BadRequestException(
          `Only ${product.inventory.quantity} units available. You currently have ${currentQty} in cart.`
        )
      }

      // 4. First try to find the existing cart item
      const cartItem = await tx.cartItem.findFirst({
        where: {
          cartId,
          productId
        }
      })

      let updatedItem;
      if (cartItem) {
        // Update existing item
        updatedItem = await tx.cartItem.update({
          where: {
            id: cartItem.id
          },
          data: {
            qty: { increment: qty },
            updatedAt: new Date()
          },
          include: {
            product: true
          }
        })
      } else {
        // Create new item
        updatedItem = await tx.cartItem.create({
          data: {
            cartId,
            productId,
            qty
          },
          include: {
            product: true
          }
        })
      }

      // 5. Update cart version for optimistic locking
      const updatedCart = await tx.cart.update({
        where: { 
          id: cartId,
          version: currentVersion  // Optimistic locking
        },
        data: {
          version: { increment: 1 },
          updatedAt: new Date()
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      return updatedCart
    })
  }

  async removeItem(cartId: string, productId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Verify cart exists and get current version
      const cart = await tx.cart.findUnique({
        where: { id: cartId },
        include: { items: true },
      })

      if (!cart) {
        throw new NotFoundException('Cart not found')
      }

      const currentVersion = cart.version;

      // 2. Delete the cart item
      await tx.cartItem.deleteMany({
        where: { cartId, productId },
      })

      // 3. Update cart version for optimistic locking
      const updatedCart = await tx.cart.update({
        where: { 
          id: cartId,
          version: currentVersion  // Optimistic locking
        },
        data: {
          version: { increment: 1 },
          updatedAt: new Date()
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      return updatedCart
    })
  }

  async clear(cartId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Verify cart exists and get current version
      const cart = await tx.cart.findUnique({
        where: { id: cartId },
        include: { items: true },
      })

      if (!cart) {
        throw new NotFoundException('Cart not found')
      }

      const currentVersion = cart.version;

      // 2. Clear all cart items
      await tx.cartItem.deleteMany({
        where: { cartId },
      })

      // 3. Update cart version for optimistic locking
      const updatedCart = await tx.cart.update({
        where: { 
          id: cartId,
          version: currentVersion  // Optimistic locking
        },
        data: {
          version: { increment: 1 },
          updatedAt: new Date()
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      return updatedCart
    })
  }
}
