import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { FulfillmentModule } from './fulfillment.module';
import { PrismaService } from '../prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

describe('FulfillmentController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [FulfillmentModule],
      providers: [
        PrismaService,
        {
          provide: NotificationsService,
          useValue: {
            notifyShipmentUpdate: jest.fn(),
            notifyException: jest.fn(),
            notifySellerException: jest.fn(),
            notifyMicroFulfillmentOptIn: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Delivery Promise Endpoint', () => {
    it('should calculate delivery promise for a product', () => {
      return request(app.getHttpServer())
        .get('/fulfillment/delivery-promise/product-123')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('promisedMinDays');
          expect(res.body).toHaveProperty('promisedMaxDays');
          expect(res.body).toHaveProperty('confidenceLevel');
        });
    });
  });

  describe('Exception Status Endpoint', () => {
    it('should get exception status for an order item', () => {
      return request(app.getHttpServer())
        .get('/fulfillment/exceptions/item-123')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('exceptionType');
          expect(res.body).toHaveProperty('exceptionSeverity');
          expect(res.body).toHaveProperty('nextAction');
        });
    });
  });

  describe('Micro-Fulfillment Endpoints', () => {
    it('should get micro-fulfillment metrics for a seller', () => {
      return request(app.getHttpServer())
        .get('/fulfillment/micro-fulfillment/seller-123/metrics')
        .expect(200);
    });

    it('should get fulfillment partners for a seller', () => {
      return request(app.getHttpServer())
        .get('/fulfillment/micro-fulfillment/seller-123/partners')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should opt in to micro-fulfillment service', () => {
      return request(app.getHttpServer())
        .post('/fulfillment/micro-fulfillment/seller-123/opt-in')
        .send({ partnerId: 'partner-123' })
        .expect(201);
    });
  });
});