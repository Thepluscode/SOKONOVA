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
        provider: "stripe" | "flutterwave" | "paystack";
        externalRef: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        amount: string;
        currency: string;
        checkoutUrl: string;
        clientSecret: string;
    }>;
    markPaymentSuccess(externalRef: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        provider: string;
        orderId: string;
        externalRef: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    markPaymentFailed(externalRef: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        provider: string;
        orderId: string;
        externalRef: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    markPaymentSuccessByRef(externalRef: string, orderId?: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        provider: string;
        orderId: string;
        externalRef: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    markPaymentFailedByRef(externalRef: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        provider: string;
        orderId: string;
        externalRef: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    getPaymentByOrderId(orderId: string): Promise<{
        order: {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            total: import("@prisma/client/runtime/library").Decimal;
            currency: string;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        provider: string;
        orderId: string;
        externalRef: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
    }>;
}
export {};
