import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { OpenDisputeDto } from './dto/open-dispute.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class DisputesService {
  private readonly logger = new Logger(DisputesService.name);

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  // Buyer opens a dispute
  async open(dto: OpenDisputeDto) {
    // 1. Verify buyer owns the order item
    const oi = await this.prisma.orderItem.findUnique({
      where: { id: dto.orderItemId },
      include: { order: true },
    });
    if (!oi) throw new NotFoundException('Order item not found');
    if (oi.order.userId !== dto.buyerId) {
      throw new ForbiddenException('Not your order item');
    }

    // 2. Create dispute with product info
    const dispute = await this.prisma.dispute.create({
      data: {
        orderItemId: dto.orderItemId,
        buyerId: dto.buyerId,
        reasonCode: dto.reasonCode as any, // This will be validated by DTO
        description: dto.description,
        photoProofUrl: dto.photoProofUrl || null,
        status: 'OPEN',
      },
      include: {
        orderItem: {
          include: {
            product: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    // 3. Flip fulfillmentStatus to ISSUE on that line item
    await this.prisma.orderItem.update({
      where: { id: dto.orderItemId },
      data: {
        fulfillmentStatus: 'ISSUE',
      },
    });

    // Notify seller: dispute opened
    try {
      await this.notifications.notifyDisputeOpened(
        oi.sellerId,
        dispute.id,
        dto.orderItemId,
        dispute.orderItem.product.title,
        dto.reasonCode,
        oi.order.id,
      );
    } catch (error) {
      this.logger.error(`Failed to send dispute opened notification: ${error.message}`);
    }

    return dispute;
  }

  // Buyer can view their own disputes
  async listMine(buyerId: string) {
    return this.prisma.dispute.findMany({
      where: { buyerId },
      orderBy: { createdAt: 'desc' },
      include: {
        orderItem: {
          include: {
            product: { select: { title: true, imageUrl: true, sellerId: true } },
            order: { select: { id: true, createdAt: true } },
          },
        },
      },
    });
  }

  // Seller/Admin view open issues for seller
  async listForSeller(sellerId: string) {
    // Get disputes where the related OrderItem belongs to this seller
    return this.prisma.dispute.findMany({
      where: {
        orderItem: {
          sellerId,
        },
        status: { in: ['OPEN', 'SELLER_RESPONDED'] },
      },
      orderBy: { createdAt: 'asc' },
      include: {
        orderItem: {
          include: {
            product: { select: { title: true, imageUrl: true } },
            order: {
              select: {
                id: true,
                userId: true,
                createdAt: true,
              },
            },
          },
        },
        buyer: {
          select: { id: true, email: true, name: true },
        },
      },
    });
  }

  // Admin view all disputes
  async listAll() {
    return this.prisma.dispute.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        buyer: {
          select: { id: true, name: true, email: true },
        },
        orderItem: {
          include: {
            order: {
              select: { id: true, total: true, currency: true },
            },
            product: {
              select: {
                title: true,
                seller: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });
  }

  // Seller/Admin resolves dispute
  async resolve(disputeId: string, dto: ResolveDisputeDto) {
    // Load dispute and ownership chain
    const d = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        orderItem: true,
      },
    });
    if (!d) throw new NotFoundException('Dispute not found');

    // Ownership / permission check:
    // Either:
    //  - actor is ADMIN, or
    //  - actor is the seller of the item
    const actor = await this.prisma.user.findUnique({
      where: { id: dto.actorId },
    });
    if (!actor) throw new ForbiddenException('Unknown actor');
    const isAdmin = actor.role === 'ADMIN';
    const isSellerOwner = actor.id === d.orderItem.sellerId;

    if (!isAdmin && !isSellerOwner) {
      throw new ForbiddenException('Not allowed to resolve this dispute');
    }

    // Update dispute status
    const now = new Date();
    const updatedDispute = await this.prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: dto.status as any, // This will be validated by DTO
        resolutionNote: dto.resolutionNote || null,
        resolvedById: dto.actorId,
        resolvedAt: now,
      },
      include: {
        buyer: {
          select: {
            id: true,
          },
        },
        orderItem: {
          select: {
            orderId: true,
          },
        },
      },
    });

    // Notify buyer: dispute resolved
    try {
      await this.notifications.notifyDisputeResolved(
        updatedDispute.buyer.id,
        disputeId,
        dto.status,
        dto.resolutionNote,
        updatedDispute.orderItem?.orderId,
      );
    } catch (error) {
      this.logger.error(`Failed to send dispute resolved notification: ${error.message}`);
    }

    // Business rule: if resolved in seller's / buyer's favor,
    // we might also update fulfillmentStatus back to DELIVERED,
    // or keep ISSUE if we refunded.
    let nextFulfillment: string | null = null;
    if (dto.status === 'RESOLVED_REDELIVERED') {
      // we re-sent a good item
      nextFulfillment = 'DELIVERED';
    } else if (dto.status === 'RESOLVED_BUYER_COMPENSATED') {
      // refunded; item considered closed but contested
      nextFulfillment = 'ISSUE'; // stays issue (we'll eat the loss)
    } else if (dto.status === 'REJECTED') {
      // dispute invalid, seller wins
      nextFulfillment = 'DELIVERED';
    } else {
      // SELLER_RESPONDED or anything interim:
      nextFulfillment = null;
    }

    if (nextFulfillment) {
      await this.prisma.orderItem.update({
        where: { id: d.orderItemId },
        data: {
          fulfillmentStatus: nextFulfillment as any, // This will be validated by Prisma
        },
      });
    }

    return updatedDispute;
  }
}
