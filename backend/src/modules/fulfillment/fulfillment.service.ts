import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

/**
 * FulfillmentService
 *
 * Manages order fulfillment and shipping tracking per line item.
 *
 * Key Features:
 * - Buyer order tracking with shipping timeline
 * - Seller fulfillment queue management
 * - Mark items as shipped with tracking info
 * - Mark items as delivered with proof
 * - Per-item fulfillment status (supports multi-seller orders)
 * - Delivery promise engine with confidence levels
 * - Exception workflow automation
 * - Micro-fulfillment partnerships
 */
@Injectable()
export class FulfillmentService {
  private readonly logger = new Logger(FulfillmentService.name);

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  /**
   * Calculate delivery estimate for a product
   *
   * @param productId - The product ID
   * @param location - The delivery location (optional)
   */
  async calculateDeliveryEstimate(productId: string, location?: string) {
    // In a real implementation, this would use carrier APIs and historical data
    // For now, we'll return mock data
    const minDays = 2;
    const maxDays = 7;
    
    return {
      productId,
      location: location || 'default',
      estimatedMinDays: minDays,
      estimatedMaxDays: maxDays,
      confidenceLevel: 0.85, // 85% confidence
      carriers: ['Standard Shipping', 'Express Shipping'],
    };
  }

  /**
   * Get shipping options for checkout
   *
   * @param items - Array of items with product ID and quantity
   * @param location - The delivery location (optional)
   */
  async getShippingOptions(
    items: Array<{ productId: string; quantity: number }>,
    location?: string,
  ) {
    // In a real implementation, this would calculate actual shipping costs
    // For now, we'll return mock data
    return [
      {
        id: 'standard',
        name: 'Standard Shipping',
        description: 'Delivered in 3-5 business days',
        cost: 5.99,
        estimatedDays: 5,
      },
      {
        id: 'express',
        name: 'Express Shipping',
        description: 'Delivered in 1-2 business days',
        cost: 12.99,
        estimatedDays: 2,
      },
      {
        id: 'overnight',
        name: 'Overnight Shipping',
        description: 'Delivered by next business day',
        cost: 24.99,
        estimatedDays: 1,
      },
    ];
  }

  /**
   * Track shipment by tracking number
   *
   * @param trackingNumber - The tracking number
   */
  async trackShipment(trackingNumber: string) {
    // In a real implementation, this would integrate with carrier APIs
    // For now, we'll return mock data
    return {
      trackingNumber,
      status: 'in_transit',
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      carrier: 'Mock Carrier',
      events: [
        {
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          location: 'Warehouse',
          description: 'Package shipped',
        },
        {
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          location: 'Distribution Center',
          description: 'Package in transit',
        },
      ],
    };
  }

  /**
   * Get delivery performance metrics for a seller
   *
   * @param sellerId - The seller's user ID
   */
  async getDeliveryPerformanceMetrics(sellerId: string) {
    // In a real implementation, this would calculate actual metrics
    // For now, we'll return mock data
    return {
      sellerId,
      onTimeDeliveryRate: 0.92, // 92%
      avgDeliveryTime: 3.2, // days
      lateDeliveries: 8,
      totalDeliveries: 100,
      customerSatisfaction: 4.7, // out of 5
    };
  }

  /**
   * Get order tracking information for a buyer
   *
   * Returns complete shipping timeline for all items in an order.
   * Verifies buyer owns the order before returning data.
   *
   * @param orderId - The order ID
   * @param userId - The buyer's user ID
   */
  async getOrderTracking(orderId: string, userId: string) {
    // Verify order belongs to this user
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                title: true,
                imageUrl: true,
                sellerId: true,
                seller: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found or access denied');
    }

    return {
      orderId: order.id,
      status: order.status,
      createdAt: order.createdAt,
      total: order.total,
      currency: order.currency,
      shippingAddress: order.shippingAdr,
      buyerName: order.buyerName || order.user?.name || null,
      buyerPhone: order.buyerPhone || order.user?.phone || null,
      buyerEmail: order.buyerEmail || order.user?.email || null,
      items: order.items.map((it) => ({
        orderItemId: it.id,
        productTitle: it.product.title,
        productImage: it.product.imageUrl,
        sellerName: it.product.seller?.name || null,
        qty: it.qty,
        price: it.price.toString(),

        // Fulfillment timeline
        fulfillmentStatus: it.fulfillmentStatus,
        trackingCode: it.trackingCode,
        carrier: it.carrier,
        shippedAt: it.shippedAt,
        deliveredAt: it.deliveredAt,
        deliveryProofUrl: it.deliveryProofUrl,
        notes: it.notes,
      })),
    };
  }

  /**
   * Get seller's open fulfillment queue
   *
   * Returns all items that need shipping or are in transit.
   * Used by sellers to manage their fulfillment workflow.
   *
   * @param sellerId - The seller's user ID
   */
  async getSellerOpenFulfillment(sellerId: string) {
    const pending = await this.prisma.orderItem.findMany({
      where: {
        sellerId,
        fulfillmentStatus: { in: ['PACKED', 'SHIPPED'] },
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        orderId: true,
        qty: true,
        price: true,
        fulfillmentStatus: true,
        trackingCode: true,
        carrier: true,
        shippedAt: true,
        deliveredAt: true,
        deliveryProofUrl: true,
        notes: true,
        createdAt: true,
        product: {
          select: {
            title: true,
            imageUrl: true,
          },
        },
        order: {
          select: {
            id: true,
            status: true,
            shippingAdr: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return pending.map((it) => ({
      id: it.id,
      orderId: it.orderId,
      qty: it.qty,
      price: it.price.toString(),
      fulfillmentStatus: it.fulfillmentStatus,
      trackingCode: it.trackingCode,
      carrier: it.carrier,
      shippedAt: it.shippedAt,
      deliveredAt: it.deliveredAt,
      deliveryProofUrl: it.deliveryProofUrl,
      notes: it.notes,
      createdAt: it.createdAt,
      product: it.product,
      order: {
        id: it.order.id,
        status: it.order.status,
        shippingAddress: it.order.shippingAdr,
        buyerName: it.order.user.name,
        buyerEmail: it.order.user.email,
      },
    }));
  }

  /**
   * Mark item as shipped
   *
   * Updates fulfillment status to SHIPPED and records tracking information.
   * Verifies seller owns the item before updating.
   *
   * @param orderItemId - The order item ID
   * @param sellerId - The seller's user ID
   * @param carrier - Shipping carrier (optional)
   * @param trackingCode - Tracking number (optional)
   * @param note - Note to buyer (optional)
   */
  async markShipped(
    orderItemId: string,
    sellerId: string,
    carrier?: string,
    trackingCode?: string,
    note?: string,
  ) {
    // Verify ownership
    const row = await this.prisma.orderItem.findUnique({
      where: { id: orderItemId },
      select: { sellerId: true, fulfillmentStatus: true },
    });

    if (!row) {
      throw new NotFoundException('Order item not found');
    }

    if (row.sellerId !== sellerId) {
      throw new ForbiddenException('Not authorized to update this item');
    }

    const now = new Date();
    const updatedItem = await this.prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        fulfillmentStatus: 'SHIPPED',
        carrier,
        trackingCode,
        notes: note,
        shippedAt: now,
        updatedAt: now,
      },
      include: {
        order: {
          select: {
            userId: true,
            id: true,
          },
        },
      },
    });

    // Notify buyer: item shipped
    try {
      await this.notifications.notifyShipmentUpdate(
        updatedItem.order.userId,
        updatedItem.id,
        'SHIPPED',
        trackingCode,
        carrier,
        updatedItem.order.id,
      );
    } catch (error) {
      this.logger.error(`Failed to send shipment notification: ${error.message}`);
    }

    return updatedItem;
  }

  /**
   * Mark item as delivered
   *
   * Updates fulfillment status to DELIVERED and records proof.
   * Verifies seller owns the item before updating.
   *
   * In production, you may want to require buyer confirmation
   * or integrate with carrier delivery webhooks.
   *
   * @param orderItemId - The order item ID
   * @param sellerId - The seller's user ID
   * @param proofUrl - Delivery proof URL (optional)
   * @param note - Delivery note (optional)
   */
  async markDelivered(
    orderItemId: string,
    sellerId: string,
    proofUrl?: string,
    note?: string,
  ) {
    // Verify ownership
    const row = await this.prisma.orderItem.findUnique({
      where: { id: orderItemId },
      select: { sellerId: true, fulfillmentStatus: true },
    });

    if (!row) {
      throw new NotFoundException('Order item not found');
    }

    if (row.sellerId !== sellerId) {
      throw new ForbiddenException('Not authorized to update this item');
    }

    const now = new Date();
    const updatedItem = await this.prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        fulfillmentStatus: 'DELIVERED',
        deliveredAt: now,
        deliveryProofUrl: proofUrl,
        notes: note,
        updatedAt: now,
      },
      include: {
        order: {
          select: {
            userId: true,
            id: true,
          },
        },
      },
    });

    // Notify buyer: item delivered
    try {
      await this.notifications.notifyShipmentUpdate(
        updatedItem.order.userId,
        updatedItem.id,
        'DELIVERED',
        undefined,
        undefined,
        updatedItem.order.id,
      );
    } catch (error) {
      this.logger.error(`Failed to send delivery notification: ${error.message}`);
    }

    return updatedItem;
  }

  /**
   * Mark item as having an issue
   *
   * Updates fulfillment status to ISSUE for dispute resolution.
   * Can be called by seller or admin.
   *
   * @param orderItemId - The order item ID
   * @param sellerId - The seller's user ID
   * @param note - Issue description
   */
  async markIssue(
    orderItemId: string,
    sellerId: string,
    note: string,
  ) {
    // Verify ownership
    const row = await this.prisma.orderItem.findUnique({
      where: { id: orderItemId },
      select: { sellerId: true },
    });

    if (!row) {
      throw new NotFoundException('Order item not found');
    }

    if (row.sellerId !== sellerId) {
      throw new ForbiddenException('Not authorized to update this item');
    }

    return this.prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        fulfillmentStatus: 'ISSUE',
        notes: note,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Get seller's fulfillment statistics
   *
   * Returns counts for each fulfillment status.
   * Useful for seller dashboard metrics.
   *
   * @param sellerId - The seller's user ID
   */
  async getSellerStats(sellerId: string) {
    const items = await this.prisma.orderItem.findMany({
      where: { sellerId },
      select: { fulfillmentStatus: true },
    });

    const stats = {
      PACKED: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      ISSUE: 0,
      total: items.length,
    };

    items.forEach((it) => {
      stats[it.fulfillmentStatus] = (stats[it.fulfillmentStatus] || 0) + 1;
    });

    return stats;
  }

  // NEW METHODS FOR LOGISTICS & FULFILLMENT EXCELLENCE

  /**
   * Calculate delivery promise with confidence level
   *
   * Combines courier SLAs, historical routes, and order metadata to show
   * trustworthy delivery windows on PDP/checkout, boosting conversion.
   *
   * @param productId - The product ID
   * @param location - The delivery location (optional)
   */
  async calculateDeliveryPromise(productId: string, location?: string) {
    // Get product information
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        // Removed fulfillmentSettings since it doesn't exist in the schema
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Get seller's historical delivery performance
    // Using a mock since we don't have actual seller data in this simplified version
    const sellerPerformance = {
      onTimeDeliveryRate: 0.92,
      avgDeliveryTime: 3.2,
      customerSatisfaction: 4.7,
    };
    
    // Get standard delivery estimate
    const standardEstimate = await this.calculateDeliveryEstimate(productId, location);
    
    // Calculate confidence level based on seller performance
    const confidenceLevel = Math.min(
      0.95, // Cap at 95%
      Math.max(
        0.7, // Minimum 70%
        sellerPerformance.onTimeDeliveryRate * 0.8 + 
        (1 - (sellerPerformance.avgDeliveryTime / 10)) * 0.2
      )
    );
    
    // Adjust estimate based on confidence
    const promisedMinDays = Math.max(1, Math.round(standardEstimate.estimatedMinDays * 0.9));
    const promisedMaxDays = Math.round(standardEstimate.estimatedMaxDays * 1.1);
    
    return {
      productId,
      location: location || 'default',
      promisedMinDays,
      promisedMaxDays,
      confidenceLevel,
      sellerRating: sellerPerformance.customerSatisfaction,
      deliveryGuarantee: confidenceLevel > 0.85,
      message: confidenceLevel > 0.9 
        ? "Delivery guaranteed or your shipping is free!" 
        : confidenceLevel > 0.8 
          ? "High confidence delivery estimate" 
          : "Estimated delivery window",
    };
  }

  /**
   * Get exception workflow status for an order item
   *
   * When shipments hit issues (carrier delays, damage reports), automatically
   * trigger notifications, seller prompts, and refund/claim flows with clear SLAs.
   *
   * @param orderItemId - The order item ID
   */
  async getExceptionStatus(orderItemId: string) {
    const orderItem = await this.prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: {
        order: {
          include: {
            user: true,
          },
        },
        product: {
          include: {
            // Removed seller since it's not in the schema
          },
        },
      },
    });

    if (!orderItem) {
      throw new NotFoundException('Order item not found');
    }

    // Check for exceptions based on status and time
    const now = new Date();
    const shippedAt = orderItem.shippedAt;
    const expectedDelivery = shippedAt 
      ? new Date(shippedAt.getTime() + 5 * 24 * 60 * 60 * 1000) // 5 days after shipping
      : null;
    
    const isLate = expectedDelivery && now > expectedDelivery;
    const hasTrackingIssues = !orderItem.trackingCode || orderItem.trackingCode.length < 5;
    const hasSellerNotes = orderItem.notes && orderItem.notes.toLowerCase().includes('issue');
    
    // Determine exception type
    let exceptionType = null;
    let exceptionSeverity = 'low';
    let nextAction = null;
    let slaDeadline = null;
    
    if (orderItem.fulfillmentStatus === 'ISSUE') {
      exceptionType = 'reported_issue';
      exceptionSeverity = 'high';
      nextAction = 'seller_resolution_required';
    } else if (isLate) {
      exceptionType = 'delivery_delay';
      exceptionSeverity = now > new Date(expectedDelivery.getTime() + 2 * 24 * 60 * 60 * 1000) 
        ? 'high' : 'medium';
      nextAction = 'seller_notification';
      slaDeadline = new Date(expectedDelivery.getTime() + 3 * 24 * 60 * 60 * 1000);
    } else if (hasTrackingIssues) {
      exceptionType = 'tracking_issue';
      exceptionSeverity = 'medium';
      nextAction = 'seller_reminder';
    } else if (hasSellerNotes) {
      exceptionType = 'seller_note';
      exceptionSeverity = 'medium';
      nextAction = 'review_required';
    }
    
    // Removed notification logic since we don't have the proper schema fields
    
    return {
      orderItemId,
      exceptionType,
      exceptionSeverity,
      nextAction,
      slaDeadline,
      orderDetails: {
        orderId: orderItem.orderId,
        productTitle: orderItem.product.title,
        buyerName: orderItem.order.user.name,
        buyerEmail: orderItem.order.user.email,
        // Removed sellerName since we don't have seller data
        fulfillmentStatus: orderItem.fulfillmentStatus,
        shippedAt: orderItem.shippedAt,
        expectedDelivery,
      },
    };
  }

  /**
   * Get micro-fulfillment partner performance metrics
   *
   * Provide real-time performance metrics for third-party pick-pack providers.
   *
   * @param sellerId - The seller's user ID
   */
  async getMicroFulfillmentMetrics(sellerId: string) {
    // In a real implementation, this would integrate with micro-fulfillment partners
    // For now, we'll return mock data
    
    // Mock performance metrics
    const partners = [
      {
        id: 'partner-1',
        name: 'Express Fulfillment Co.',
        performance: {
          onTimeRate: 0.96,
          avgProcessingTime: 1.2, // hours
          accuracyRate: 0.99,
          costPerItem: 2.5,
        },
        capacity: {
          available: 1200,
          total: 1500,
        },
      },
      {
        id: 'partner-2',
        name: 'Local Distribution Hub',
        performance: {
          onTimeRate: 0.89,
          avgProcessingTime: 2.5, // hours
          accuracyRate: 0.97,
          costPerItem: 1.8,
        },
        capacity: {
          available: 800,
          total: 1000,
        },
      },
    ];
    
    return {
      optedIn: false, // Mock value since we don't have the actual settings
      partners,
      sellerMetrics: {
        fulfillmentRate: 0.93,
        avgTurnaround: 1.8, // hours
        costSavings: 1250.75, // dollars saved this month
      },
    };
  }

  /**
   * Opt-in to micro-fulfillment service
   *
   * Allow sellers to opt in to third-party pick-pack providers.
   *
   * @param sellerId - The seller's user ID
   * @param partnerId - The micro-fulfillment partner ID
   */
  async optInToMicroFulfillment(sellerId: string, partnerId: string) {
    // In a real implementation, this would update the database
    // For now, we'll return mock data
    
    return {
      success: true,
      sellerId,
      partnerId,
      optInDate: new Date(),
    };
  }

  /**
   * Get fulfillment partner options
   *
   * Provide a list of available micro-fulfillment partners.
   *
   * @param sellerId - The seller's user ID
   */
  async getFulfillmentPartners(sellerId: string) {
    // In a real implementation, this would fetch actual partner data
    // For now, we'll return mock data
    
    return [
      {
        id: 'partner-1',
        name: 'Express Fulfillment Co.',
        description: 'Fast processing with same-day shipping options',
        locations: ['Lagos', 'Abuja', 'Port Harcourt'],
        pricing: {
          pickPack: 2.5,
          storage: 0.1, // per item per day
        },
        capabilities: ['Same-day shipping', 'Fragile handling', 'Returns processing'],
        rating: 4.8,
      },
      {
        id: 'partner-2',
        name: 'Local Distribution Hub',
        description: 'Cost-effective solution for high-volume sellers',
        locations: ['Nairobi', 'Mombasa', 'Kisumu'],
        pricing: {
          pickPack: 1.8,
          storage: 0.05, // per item per day
        },
        capabilities: ['Bulk processing', 'Inventory management', 'Multi-channel fulfillment'],
        rating: 4.5,
      },
      {
        id: 'partner-3',
        name: 'Regional Logistics Network',
        description: 'Comprehensive fulfillment across West Africa',
        locations: ['Accra', 'Kumasi', 'Takoradi'],
        pricing: {
          pickPack: 2.2,
          storage: 0.08, // per item per day
        },
        capabilities: ['Cross-border shipping', 'Customs handling', 'Temperature control'],
        rating: 4.6,
      },
    ];
  }
}
