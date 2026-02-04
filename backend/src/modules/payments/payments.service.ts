import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

type CreateIntentInput = {
  orderId: string;
  provider: 'flutterwave' | 'paystack' | 'stripe';
};

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  /**
   * Calculate marketplace fee from order total.
   * Default take rate is 5%, premium sellers get 3%.
   */
  calculateMarketplaceFee(
    orderTotal: number,
    sellerTier: 'STANDARD' | 'PREMIUM' = 'STANDARD',
  ) {
    if (!orderTotal || orderTotal <= 0) {
      return 0;
    }

    const feePercent = sellerTier === 'PREMIUM' ? 3 : 5;
    return Number(((orderTotal * feePercent) / 100).toFixed(2));
  }

  /**
   * Helper: Call Paystack API to initialize payment
   */
  private async initPaystack(order: any, customerEmail: string) {
    const amountMinorUnits = Math.round(Number(order.total) * 100); // cents/kobo
    const currency = order.currency || 'NGN'; // Paystack default

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountMinorUnits,
        currency,
        email: customerEmail,
        metadata: {
          orderId: order.id,
        },
        callback_url: `${process.env.FRONTEND_BASE_URL}/checkout/verify?orderId=${order.id}`,
      }),
    });

    const json = await response.json();
    if (!json.status) {
      throw new InternalServerErrorException('Paystack initialization failed');
    }

    return {
      externalRef: json.data.reference,
      checkoutUrl: json.data.authorization_url,
    };
  }

  /**
   * Helper: Call Flutterwave API to initialize payment
   */
  private async initFlutterwave(order: any, customerEmail: string, customerName: string) {
    const amount = Number(order.total);
    const currency = order.currency || 'USD';

    const response = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref: `tx_${order.id}_${Date.now()}`,
        amount,
        currency,
        redirect_url: `${process.env.FRONTEND_BASE_URL}/checkout/verify?orderId=${order.id}`,
        customer: {
          email: customerEmail,
          name: customerName,
        },
        customizations: {
          title: 'SokoNova Order',
          description: `Order ${order.id}`,
          logo: `${process.env.FRONTEND_BASE_URL}/logo.png`,
        },
        meta: {
          orderId: order.id,
        },
      }),
    });

    const json = await response.json();
    if (json.status !== 'success') {
      throw new InternalServerErrorException('Flutterwave initialization failed');
    }

    return {
      externalRef: json.data.tx_ref,
      checkoutUrl: json.data.link,
    };
  }

  /**
   * Helper: Create Stripe Payment Intent
   * Note: Stripe uses client-side card capture, so we return clientSecret instead of checkoutUrl
   */
  private async initStripe(order: any, customerEmail: string) {
    const amountMinorUnits = Math.round(Number(order.total) * 100); // cents
    const currency = order.currency?.toLowerCase() || 'usd';

    // In production, use Stripe SDK: const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: amountMinorUnits.toString(),
        currency,
        'metadata[orderId]': order.id,
        receipt_email: customerEmail,
      }).toString(),
    });

    const json = await response.json();
    if (json.error) {
      throw new InternalServerErrorException('Stripe initialization failed');
    }

    return {
      externalRef: json.id, // payment_intent id
      clientSecret: json.client_secret, // for frontend Stripe.js
      checkoutUrl: null, // Stripe doesn't use redirect, uses inline form
    };
  }

  /**
   * Step 1: Create a payment intent for an order
   * This calls the real PSP API and returns a checkout URL or client secret
   */
  async createPaymentIntent({ orderId, provider }: CreateIntentInput) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true, // need email for PSP
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const customerEmail = order.user.email || 'buyer@sokonova.com';
    const customerName = order.user.name || 'SokoNova Buyer';

    let externalRef: string;
    let checkoutUrl: string | null = null;
    let clientSecret: string | null = null;

    // Call appropriate PSP based on provider
    if (provider === 'paystack') {
      const result = await this.initPaystack(order, customerEmail);
      externalRef = result.externalRef;
      checkoutUrl = result.checkoutUrl;
    } else if (provider === 'flutterwave') {
      const result = await this.initFlutterwave(order, customerEmail, customerName);
      externalRef = result.externalRef;
      checkoutUrl = result.checkoutUrl;
    } else if (provider === 'stripe') {
      const result = await this.initStripe(order, customerEmail);
      externalRef = result.externalRef;
      clientSecret = result.clientSecret;
      checkoutUrl = result.checkoutUrl; // null for Stripe
    } else {
      throw new InternalServerErrorException('Unsupported payment provider');
    }

    // Upsert payment record (in case this is a retry)
    const payment = await this.prisma.payment.upsert({
      where: { orderId: orderId },
      update: {
        provider,
        externalRef,
        amount: order.total,
        currency: order.currency,
        status: 'INITIATED',
        updatedAt: new Date(),
      },
      create: {
        orderId: orderId,
        provider,
        externalRef,
        amount: order.total,
        currency: order.currency,
      },
    });

    // Save payment reference on order for traceability
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentRef: externalRef,
      },
    });

    // Return payment info for frontend
    return {
      orderId,
      provider,
      externalRef: payment.externalRef,
      status: payment.status,
      amount: payment.amount.toString(),
      currency: payment.currency,
      checkoutUrl, // Paystack/Flutterwave redirect URL
      clientSecret, // Stripe client secret
    };
  }

  /**
   * Step 2: Mark payment as successful
   * Called by PSP webhook after successful payment
   */
  async markPaymentSuccess(externalRef: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { externalRef },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Idempotency: if already succeeded, just return
    if (payment.status === 'SUCCEEDED') {
      return payment;
    }

    // Mark payment as succeeded
    const updatedPayment = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'SUCCEEDED',
      },
    });

    // Move order to PAID status and fetch order details for notifications
    const order = await this.prisma.order.update({
      where: { id: payment.orderId },
      data: {
        status: 'PAID',
      },
      include: {
        items: {
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

    // Send notifications (non-blocking)
    try {
      // Notify buyer: payment confirmed
      await this.notifications.notifyOrderPaid(
        order.userId,
        order.id,
        Number(order.total),
        order.currency,
      );

      // Notify each seller: new order to fulfill
      for (const item of order.items) {
        await this.notifications.notifySellerNewOrder(
          item.sellerId,
          order.id,
          item.id,
          item.product.title,
          item.qty,
        );
      }
    } catch (error) {
      // Log notification errors but don't block payment success
      this.logger.error(`Failed to send payment notifications: ${error.message}`);
    }

    return updatedPayment;
  }

  /**
   * Step 3: Mark payment as failed
   * Called by PSP webhook if payment fails
   */
  async markPaymentFailed(externalRef: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { externalRef },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Idempotency: if already failed, just return
    if (payment.status === 'FAILED') {
      return payment;
    }

    const updatedPayment = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'FAILED',
      },
    });

    // Cancel the order (or leave as PENDING for retry)
    await this.prisma.order.update({
      where: { id: payment.orderId },
      data: {
        status: 'CANCELLED',
      },
    });

    try {
      const order = await this.prisma.order.findUnique({
        where: { id: payment.orderId },
        select: {
          id: true,
          userId: true,
          total: true,
          currency: true,
        },
      });

      if (order?.userId) {
        await this.notifications.notifyOrderPaymentFailed(
          order.userId,
          order.id,
          Number(order.total || 0),
          order.currency || 'USD',
        );
      }
    } catch (error) {
      this.logger.error(`Failed to send payment failure notification: ${error.message}`);
    }

    return updatedPayment;
  }

  /**
   * Mark payment success by reference (for webhooks)
   * Includes orderId for extra verification
   */
  async markPaymentSuccessByRef(externalRef: string, orderId?: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { externalRef },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundException(
        `Payment not found for reference: ${externalRef}`,
      );
    }

    // Verify orderId matches if provided
    if (orderId && payment.orderId !== orderId) {
      throw new BadRequestException(
        `OrderId mismatch: expected ${payment.orderId}, got ${orderId}`,
      );
    }

    // Idempotency: if already succeeded, just return
    if (payment.status === 'SUCCEEDED') {
      return payment;
    }

    // Mark payment as succeeded
    const updatedPayment = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'SUCCEEDED',
      },
    });

    // Move order to PAID status and fetch order details for notifications
    const order = await this.prisma.order.update({
      where: { id: payment.orderId },
      data: {
        status: 'PAID',
      },
      include: {
        items: {
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

    // Send notifications (non-blocking)
    try {
      // Notify buyer: payment confirmed
      await this.notifications.notifyOrderPaid(
        order.userId,
        order.id,
        Number(order.total),
        order.currency,
      );

      // Notify each seller: new order to fulfill
      for (const item of order.items) {
        await this.notifications.notifySellerNewOrder(
          item.sellerId,
          order.id,
          item.id,
          item.product.title,
          item.qty,
        );
      }
    } catch (error) {
      // Log notification errors but don't block payment success
      this.logger.error(`Failed to send payment notifications: ${error.message}`);
    }

    return updatedPayment;
  }

  /**
   * Mark payment failed by reference (for webhooks)
   */
  async markPaymentFailedByRef(externalRef: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { externalRef },
    });

    if (!payment) {
      throw new NotFoundException(
        `Payment not found for reference: ${externalRef}`,
      );
    }

    // Idempotency: if already failed, just return
    if (payment.status === 'FAILED') {
      return payment;
    }

    const updatedPayment = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'FAILED',
      },
    });

    // Cancel the order (or leave as PENDING for retry)
    await this.prisma.order.update({
      where: { id: payment.orderId },
      data: {
        status: 'CANCELLED',
      },
    });

    try {
      const order = await this.prisma.order.findUnique({
        where: { id: payment.orderId },
        select: {
          id: true,
          userId: true,
          total: true,
          currency: true,
        },
      });

      if (order?.userId) {
        await this.notifications.notifyOrderPaymentFailed(
          order.userId,
          order.id,
          Number(order.total || 0),
          order.currency || 'USD',
        );
      }
    } catch (error) {
      this.logger.error(`Failed to send payment failure notification: ${error.message}`);
    }

    return updatedPayment;
  }

  /**
   * Get payment status for an order
   */
  async getPaymentByOrderId(orderId: string) {
    return this.prisma.payment.findUnique({
      where: { orderId },
      include: {
        order: {
          select: {
            id: true,
            status: true,
            total: true,
            currency: true,
            createdAt: true,
          },
        },
      },
    });
  }
}
