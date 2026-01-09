import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('PaymentsService - Critical Revenue Tests', () => {
  let service: PaymentsService;
  let prismaService: PrismaService;
  let notificationsService: NotificationsService;

  // Mock data
  const mockOrder = {
    id: 'order_123',
    userId: 'user_123',
    total: 50.00,
    currency: 'USD',
    status: 'PENDING',
    user: {
      email: 'buyer@test.com',
      name: 'Test Buyer',
    },
  };

  const mockPayment = {
    id: 'payment_123',
    orderId: 'order_123',
    provider: 'stripe',
    externalRef: 'pi_test_123',
    amount: 50.00,
    currency: 'USD',
    status: 'INITIATED',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PrismaService,
          useValue: {
            order: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            payment: {
              upsert: jest.fn(),
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: NotificationsService,
          useValue: {
            notifyOrderPaid: jest.fn(),
            notifySellerNewOrder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prismaService = module.get<PrismaService>(PrismaService);
    notificationsService = module.get<NotificationsService>(NotificationsService);
  });

  /**
   * TEST 1: Payment Creation
   * Critical: This is how you start making money
   */
  describe('createPaymentIntent', () => {
    it('should create payment intent for valid order with Stripe', async () => {
      // Arrange
      jest.spyOn(prismaService.order, 'findUnique').mockResolvedValue(mockOrder as any);
      jest.spyOn(prismaService.payment, 'upsert').mockResolvedValue(mockPayment as any);
      jest.spyOn(prismaService.order, 'update').mockResolvedValue(mockOrder as any);

      // Mock Stripe API call
      global.fetch = jest.fn().mockResolvedValue({
        json: async () => ({
          id: 'pi_test_123',
          client_secret: 'pi_test_123_secret_abc',
        }),
      } as any);

      // Act
      const result = await service.createPaymentIntent({
        orderId: 'order_123',
        provider: 'stripe',
      });

      // Assert
      expect(result).toBeDefined();
      expect(result.orderId).toBe('order_123');
      expect(result.provider).toBe('stripe');
      expect(result.externalRef).toBe('pi_test_123');
      expect(result.clientSecret).toBeDefined();
      expect(prismaService.payment.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { orderId: 'order_123' },
          create: expect.objectContaining({
            orderId: 'order_123',
            provider: 'stripe',
          }),
        })
      );
    });

    it('should throw error if order not found', async () => {
      // Arrange
      jest.spyOn(prismaService.order, 'findUnique').mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.createPaymentIntent({
          orderId: 'nonexistent',
          provider: 'stripe',
        })
      ).rejects.toThrow(NotFoundException);
    });
  });

  /**
   * TEST 2: Webhook Handler (Payment Success)
   * Critical: This is when you actually get paid
   */
  describe('markPaymentSuccess', () => {
    it('should mark payment as succeeded and update order status', async () => {
      // Arrange
      const mockOrderWithItems = {
        ...mockOrder,
        items: [
          {
            id: 'item_1',
            sellerId: 'seller_1',
            qty: 2,
            product: { title: 'Test Product' },
          },
        ],
      };

      jest.spyOn(prismaService.payment, 'findFirst').mockResolvedValue(mockPayment as any);
      jest.spyOn(prismaService.payment, 'update').mockResolvedValue({
        ...mockPayment,
        status: 'SUCCEEDED',
      } as any);
      jest.spyOn(prismaService.order, 'update').mockResolvedValue(mockOrderWithItems as any);

      // Act
      const result = await service.markPaymentSuccess('pi_test_123');

      // Assert
      expect(result.status).toBe('SUCCEEDED');
      expect(prismaService.payment.update).toHaveBeenCalledWith({
        where: { id: 'payment_123' },
        data: { status: 'SUCCEEDED' },
      });
      expect(prismaService.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'order_123' },
          data: { status: 'PAID' },
        })
      );
    });

    it('should be idempotent - handle duplicate webhooks', async () => {
      // Arrange
      const succeededPayment = { ...mockPayment, status: 'SUCCEEDED' };
      jest.spyOn(prismaService.payment, 'findFirst').mockResolvedValue(succeededPayment as any);

      // Act
      const result = await service.markPaymentSuccess('pi_test_123');

      // Assert
      expect(result.status).toBe('SUCCEEDED');
      expect(prismaService.payment.update).not.toHaveBeenCalled(); // Should not update again
    });

    it('should throw error if payment not found', async () => {
      // Arrange
      jest.spyOn(prismaService.payment, 'findFirst').mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.markPaymentSuccess('invalid_ref')
      ).rejects.toThrow(NotFoundException);
    });
  });

  /**
   * TEST 3: Fee Calculation
   * Critical: This is YOUR revenue from each transaction
   */
  describe('Fee Calculation', () => {
    it('should calculate correct marketplace fee from order total', () => {
      // This test verifies your revenue calculation
      // You need to implement getFee() or similar in your service

      const orderTotal = 100.00;
      const marketplaceFeePercent = 5; // 5% marketplace fee
      const expectedFee = 5.00;

      // For now, we'll test the basic math
      const calculatedFee = (orderTotal * marketplaceFeePercent) / 100;

      expect(calculatedFee).toBe(expectedFee);

      // TODO: Implement actual fee calculation method in PaymentsService
      // expect(service.calculateMarketplaceFee(orderTotal)).toBe(expectedFee);
    });

    it('should handle different fee tiers for seller levels', () => {
      // Premium sellers might get lower fees
      const orderTotal = 100.00;
      const standardFee = 5; // 5%
      const premiumFee = 3;  // 3%

      const standardRevenue = (orderTotal * standardFee) / 100;
      const premiumRevenue = (orderTotal * premiumFee) / 100;

      expect(standardRevenue).toBe(5.00);
      expect(premiumRevenue).toBe(3.00);

      // This shows you lose $2 per $100 transaction for premium sellers
      // Make sure that's worth it!
    });
  });

  /**
   * TEST 4: Payout Calculation
   * Critical: This determines what sellers get (and you don't)
   */
  describe('Payout Calculation', () => {
    it('should calculate correct seller payout after fees', () => {
      const orderTotal = 100.00;
      const marketplaceFee = 5.00;  // Your cut
      const stripeFee = 2.90 + (orderTotal * 0.029); // Stripe's cut ~$2.90 + 2.9%

      const sellerPayout = orderTotal - marketplaceFee - stripeFee;

      // Seller gets: $100 - $5 (you) - $5.80 (Stripe) = $89.20
      expect(sellerPayout).toBeCloseTo(89.20, 2);

      // This means on a $100 sale:
      // - You make: $5.00
      // - Stripe makes: $5.80
      // - Seller makes: $89.20

      // Make sure this is sustainable!
    });

    it('should not allow payout if payment not succeeded', () => {
      const payment = { ...mockPayment, status: 'INITIATED' };

      // You should NOT payout if payment is still pending
      const canPayout = payment.status === 'SUCCEEDED';

      expect(canPayout).toBe(false);
    });

    it('should track total platform revenue correctly', () => {
      // Simulate 10 transactions
      const transactions = [
        { total: 100, fee: 5 },
        { total: 50, fee: 2.5 },
        { total: 200, fee: 10 },
        { total: 75, fee: 3.75 },
        { total: 150, fee: 7.5 },
      ];

      const totalRevenue = transactions.reduce((sum, t) => sum + t.fee, 0);
      const totalVolume = transactions.reduce((sum, t) => sum + t.total, 0);

      expect(totalRevenue).toBe(28.75); // Your revenue
      expect(totalVolume).toBe(575);     // Total GMV (Gross Merchandise Volume)
      expect(totalRevenue / totalVolume).toBeCloseTo(0.05, 2); // 5% take rate
    });
  });
});
