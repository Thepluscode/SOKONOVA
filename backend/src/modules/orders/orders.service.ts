import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CreateOrderDto } from './dto/create-order.dto'

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) { }

  async listForUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async listForSeller(sellerId: string) {
    return this.prisma.order.findMany({
      where: {
        items: {
          some: {
            sellerId,
          },
        },
      },
      include: {
        items: {
          where: { sellerId },
          include: { product: true },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              include: {
                seller: {
                  select: {
                    id: true,
                    name: true,
                    sellerHandle: true,
                    shopLogoUrl: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  // Centralized fee calculation
  private calculateFee(grossAmount: number): { gross: number; fee: number; net: number } {
    const gross = grossAmount;
    const fee = gross * 0.10; // 10% marketplace commission
    const net = gross - fee;
    return { gross, fee, net };
  }

  /**
   * MVP TESTING: Create order directly without cart
   * Used for E2E testing and manual order creation
   */
  async createDirect(
    userId: string,
    items: Array<{ productId: string; qty: number; price: number }>,
    total: number,
    currency: string,
  ) {
    // Calculate total and prepare order items
    let calculatedTotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await this.prisma.product.findFirst({
        where: { id: item.productId, isActive: true },
      });

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      const lineTotal = item.price * item.qty;
      calculatedTotal += lineTotal;

      const { gross, fee, net } = this.calculateFee(lineTotal);

      orderItemsData.push({
        productId: item.productId,
        qty: item.qty,
        price: item.price,
        sellerId: product.sellerId,
        grossAmount: gross,
        feeAmount: fee,
        netAmount: net,
        payoutStatus: 'PENDING',
        currency: currency || 'USD',
      });
    }

    // Create order with items
    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId,
          total: calculatedTotal,
          currency,
          status: 'PENDING',
        },
      });

      for (const itemData of orderItemsData) {
        await tx.orderItem.create({
          data: {
            orderId: created.id,
            ...itemData,
          },
        });
      }

      return created;
    });

    return order;
  }

  async createFromCart(dto: CreateOrderDto, cartId: string) {
    // 1. Verify cart ownership
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: true } } },
    })
    if (!cart) {
      throw new NotFoundException('Cart not found')
    }


    // Check if the cart belongs to the requesting user
    // For anonymous carts (no userId), allow access
    // For user carts, verify ownership
    if (cart.userId && cart.userId !== dto.userId) {
      throw new ForbiddenException('You do not have permission to access this cart')
    }


    if (!cart.items.length) {
      throw new Error('Cart is empty')
    }

    // 2. Calculate total on the server side
    let calculatedTotal = 0;
    const orderItemsData = [];
    let defaultCurrency = 'USD';

    for (const ci of cart.items) {
      const unitPrice = Number(ci.product.price); // Decimal -> number
      const qty = ci.qty;
      const lineTotal = unitPrice * qty;
      calculatedTotal += lineTotal;
      defaultCurrency = ci.product.currency || 'USD';

      // Snapshot seller earnings data at order time
      const sellerId = ci.product.sellerId;

      // Calculate earnings using centralized function
      const { gross, fee, net } = this.calculateFee(lineTotal);

      orderItemsData.push({
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
      });
    }

    // 3. Optional: Verify the client-supplied total if provided
    if (dto.total !== undefined) {
      const tolerance = 0.01; // Allow for small floating point differences
      if (Math.abs(dto.total - calculatedTotal) > tolerance) {
        throw new Error(`Total mismatch: expected ${calculatedTotal}, got ${dto.total}`)
      }
    }

    // 4. Create order with verified data
    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: dto.userId,
          total: calculatedTotal, // Use our calculated total
          currency: dto.currency || defaultCurrency,
          status: 'PENDING',
          shippingAdr: dto.shippingAdr,
          buyerName: dto.buyerName,
          buyerPhone: dto.buyerPhone,
          buyerEmail: dto.buyerEmail,
        },
      })

      // Create order items
      for (const itemData of orderItemsData) {
        await tx.orderItem.create({
          data: {
            orderId: created.id,
            ...itemData,
          },
        })
      }

      // Clear the cart
      await tx.cartItem.deleteMany({ where: { cartId } })

      return created
    })

    return order
  }

}
