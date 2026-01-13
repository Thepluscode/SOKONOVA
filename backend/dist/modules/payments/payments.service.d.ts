import { PrismaService } from '../prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
type CreateIntentInput = {
    orderId: string;
    provider: 'flutterwave' | 'paystack' | 'stripe';
};
export declare class PaymentsService {
    private prisma;
    private notifications;
    private readonly logger;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    private initPaystack;
    private initFlutterwave;
    private initStripe;
    createPaymentIntent({ orderId, provider }: CreateIntentInput): Promise<{
        orderId: string;
        provider: "flutterwave" | "paystack" | "stripe";
        externalRef: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        amount: string;
        currency: string;
        checkoutUrl: string;
        clientSecret: string;
    }>;
    markPaymentSuccess(externalRef: string): Promise<{
        id: string;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
        orderId: string;
        provider: string;
        externalRef: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    markPaymentFailed(externalRef: string): Promise<{
        id: string;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
        orderId: string;
        provider: string;
        externalRef: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    markPaymentSuccessByRef(externalRef: string, orderId?: string): Promise<{
        id: string;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
        orderId: string;
        provider: string;
        externalRef: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    markPaymentFailedByRef(externalRef: string): Promise<{
        id: string;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
        orderId: string;
        provider: string;
        externalRef: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    getPaymentByOrderId(orderId: string): Promise<{
        order: {
            id: string;
            currency: string;
            createdAt: Date;
            total: import("@prisma/client/runtime/library").Decimal;
            status: import(".prisma/client").$Enums.OrderStatus;
        };
    } & {
        id: string;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
        orderId: string;
        provider: string;
        externalRef: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
    }>;
}
export {};
