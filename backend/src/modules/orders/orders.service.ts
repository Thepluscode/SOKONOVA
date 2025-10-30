
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CreateOrderDto } from './dto/create-order.dto'

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async listForUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async createFromCart(dto: CreateOrderDto, cartId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: true } } },
    })
    if (!cart || !cart.items.length) {
      throw new Error('Cart empty or not found')
    }

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: dto.userId,
          total: dto.total,
          currency: dto.currency,
          status: 'PENDING',
          shippingAdr: dto.shippingAdr,
        },
      })

      for (const ci of cart.items) {
        // Snapshot seller earnings data at order time
        const sellerId = ci.product.sellerId
        const unitPrice = Number(ci.product.price) // Decimal -> number
        const qty = ci.qty

        // Calculate earnings: gross → fee → net
        const gross = unitPrice * qty
        const fee = gross * 0.10 // 10% marketplace commission
        const net = gross - fee

        await tx.orderItem.create({
          data: {
            orderId: created.id,
            productId: ci.productId,
            qty,
            price: ci.product.price,
            // Seller earnings tracking
            sellerId,
            grossAmount: gross,
            feeAmount: fee,
            netAmount: net,
            payoutStatus: 'PENDING',
            currency: ci.product.currency || 'USD',
          },
        })
      }

      await tx.cartItem.deleteMany({ where: { cartId } })

      return created
    })

    return order
  }
}
