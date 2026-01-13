import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Req,
  Res,
  HttpCode,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import { PaymentsService } from './payments.service';
import { CreateIntentDto } from './dto/create-intent.dto';

/**
 * PaymentsController
 *
 * Handles payment intent creation and PSP webhooks
 *
 * Endpoints:
 * - POST /payments/intent - Create payment intent for an order
 * - POST /payments/webhook - Receive PSP webhook notifications
 * - GET /payments/:orderId - Get payment status for an order
 */
@Controller('payments')
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  /**
   * Create a payment intent
   *
   * Called by frontend after order creation
   * Returns PSP reference and checkout URL (if applicable)
   *
   * Example request:
   * POST /payments/intent
   * {
   *   "orderId": "clx123abc",
   *   "provider": "flutterwave"
   * }
   */
  @Post('intent')
  async createIntent(@Body() dto: CreateIntentDto) {
    return this.payments.createPaymentIntent({
      orderId: dto.orderId,
      provider: dto.provider,
    });
  }

  /**
   * Paystack Webhook
   *
   * Verifies Paystack signature and processes payment events
   * Signature verification uses HMAC SHA512
   */
  @Post('webhook/paystack')
  @HttpCode(200)
  async webhookPaystack(@Req() req: Request, @Res() res: Response) {
    try {
      // 1. Verify signature
      const signature = req.headers['x-paystack-signature'] as string;
      if (!signature) {
        throw new UnauthorizedException('No signature provided');
      }

      const secret = process.env.PAYSTACK_SECRET_KEY;
      if (!secret) {
        throw new Error('PAYSTACK_SECRET_KEY not configured');
      }

      const hash = crypto
        .createHmac('sha512', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (hash !== signature) {
        throw new UnauthorizedException('Invalid signature');
      }

      // 2. Check event type
      const { event, data } = req.body;
      if (event !== 'charge.success') {
        return res.send('ignored');
      }

      // 3. Extract payment details
      const externalRef = data.reference;
      const status = data.status;
      const metadata = data.metadata || {};
      const orderId = metadata.orderId;

      // 4. Mark payment status
      if (status === 'success') {
        await this.payments.markPaymentSuccessByRef(externalRef, orderId);
        return res.send('ok');
      } else {
        await this.payments.markPaymentFailedByRef(externalRef);
        return res.send('failed recorded');
      }
    } catch (error) {
      console.error('Paystack webhook error:', error);
      return res.status(400).send('webhook error');
    }
  }

  /**
   * Flutterwave Webhook
   *
   * Verifies Flutterwave signature and processes payment events
   * Signature is a simple hash match in the 'verif-hash' header
   */
  @Post('webhook/flutterwave')
  @HttpCode(200)
  async webhookFlutterwave(@Req() req: Request, @Res() res: Response) {
    try {
      // 1. Verify signature
      const signature = req.headers['verif-hash'] as string;
      const secret = process.env.FLUTTERWAVE_WEBHOOK_SECRET;

      if (!signature || !secret) {
        throw new UnauthorizedException('Invalid webhook signature');
      }

      if (signature !== secret) {
        throw new UnauthorizedException('Signature mismatch');
      }

      // 2. Check event type
      const { event, data } = req.body;
      if (event !== 'charge.completed') {
        return res.send('ignored');
      }

      // 3. Extract payment details
      const externalRef = data.tx_ref;
      const status = data.status;
      const metadata = data.meta || {};
      const orderId = metadata.orderId;

      // 4. Mark payment status
      if (status === 'successful') {
        await this.payments.markPaymentSuccessByRef(externalRef, orderId);
        return res.send('ok');
      } else {
        await this.payments.markPaymentFailedByRef(externalRef);
        return res.send('failed recorded');
      }
    } catch (error) {
      console.error('Flutterwave webhook error:', error);
      return res.status(400).send('webhook error');
    }
  }

  /**
   * Stripe Webhook
   *
   * Verifies Stripe signature and processes payment events
   * Uses Stripe's webhook signature verification
   */
  @Post('webhook/stripe')
  @HttpCode(200)
  async webhookStripe(@Req() req: Request, @Res() res: Response) {
    try {
      const signature = req.headers['stripe-signature'] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!signature || !webhookSecret) {
        throw new UnauthorizedException('Invalid webhook signature');
      }

      const rawBody = (req as any).rawBody;
      if (!rawBody) {
        throw new BadRequestException('Missing raw body for Stripe webhook');
      }

      // Stripe signature format: t=timestamp,v1=signature
      const sigParts = signature.split(',');
      const timestamp = sigParts.find((s) => s.startsWith('t='))?.substring(2);
      const v1Signatures = sigParts
        .filter((s) => s.startsWith('v1='))
        .map((s) => s.substring(3));

      if (!timestamp || v1Signatures.length === 0) {
        throw new UnauthorizedException('Invalid Stripe signature format');
      }

      const signedPayload = `${timestamp}.${rawBody}`;
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(signedPayload)
        .digest('hex');

      const signatureMatches = v1Signatures.some((sig) =>
        crypto.timingSafeEqual(
          Buffer.from(expectedSignature),
          Buffer.from(sig),
        ),
      );

      if (!signatureMatches) {
        throw new UnauthorizedException('Signature verification failed');
      }

      const timestampAge = Math.abs(Date.now() / 1000 - Number(timestamp));
      if (Number.isNaN(timestampAge) || timestampAge > 300) {
        throw new UnauthorizedException('Stripe signature timestamp is too old');
      }

      // 2. Check event type
      const { type, data } = req.body;
      const paymentIntent = data?.object;
      if (!paymentIntent?.id) {
        throw new BadRequestException('Missing payment intent data');
      }

      const externalRef = paymentIntent.id;
      const metadata = paymentIntent.metadata || {};
      const orderId = metadata.orderId;

      if (type === 'payment_intent.succeeded') {
        await this.payments.markPaymentSuccessByRef(externalRef, orderId);
        return res.send('ok');
      }

      if (type === 'payment_intent.payment_failed' || type === 'payment_intent.canceled') {
        await this.payments.markPaymentFailedByRef(externalRef);
        return res.send('failed recorded');
      }

      return res.send('ignored');
    } catch (error) {
      console.error('Stripe webhook error:', error);
      return res.status(400).send('webhook error');
    }
  }

  /**
   * Get payment status for an order
   *
   * GET /payments/:orderId
   */
  @Get(':orderId')
  async getPayment(@Param('orderId') orderId: string) {
    return this.payments.getPaymentByOrderId(orderId);
  }
}
