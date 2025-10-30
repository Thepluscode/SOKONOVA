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
        currency: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        orderId: string;
        provider: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        externalRef: string | null;
    }>;
    markPaymentFailed(externalRef: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        orderId: string;
        provider: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        externalRef: string | null;
    }>;
    markPaymentSuccessByRef(externalRef: string, orderId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        orderId: string;
        provider: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        externalRef: string | null;
    }>;
    markPaymentFailedByRef(externalRef: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        orderId: string;
        provider: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        externalRef: string | null;
    }>;
    getPaymentByOrderId(orderId: string): Promise<{
        order: {
            id: string;
            createdAt: Date;
            currency: string;
            total: import("@prisma/client/runtime/library").Decimal;
            status: import(".prisma/client").$Enums.OrderStatus;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        orderId: string;
        provider: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        externalRef: string | null;
    }>;
}
export {};
