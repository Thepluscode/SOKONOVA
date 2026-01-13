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
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        orderId: string;
        currency: string;
        provider: string;
        externalRef: string | null;
        status: import(".prisma/client").$Enums.PaymentStatus;
    }>;
    markPaymentFailed(externalRef: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        orderId: string;
        currency: string;
        provider: string;
        externalRef: string | null;
        status: import(".prisma/client").$Enums.PaymentStatus;
    }>;
    markPaymentSuccessByRef(externalRef: string, orderId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        orderId: string;
        currency: string;
        provider: string;
        externalRef: string | null;
        status: import(".prisma/client").$Enums.PaymentStatus;
    }>;
    markPaymentFailedByRef(externalRef: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        orderId: string;
        currency: string;
        provider: string;
        externalRef: string | null;
        status: import(".prisma/client").$Enums.PaymentStatus;
    }>;
    getPaymentByOrderId(orderId: string): Promise<{
        order: {
            id: string;
            createdAt: Date;
            currency: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            total: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        orderId: string;
        currency: string;
        provider: string;
        externalRef: string | null;
        status: import(".prisma/client").$Enums.PaymentStatus;
    }>;
}
export {};
