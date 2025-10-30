import { Request, Response } from 'express';
import { PaymentsService } from './payments.service';
import { CreateIntentDto } from './dto/create-intent.dto';
export declare class PaymentsController {
    private payments;
    constructor(payments: PaymentsService);
    createIntent(dto: CreateIntentDto): Promise<{
        orderId: string;
        provider: "flutterwave" | "paystack" | "stripe";
        externalRef: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        amount: string;
        currency: string;
        checkoutUrl: string;
        clientSecret: string;
    }>;
    webhookPaystack(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    webhookFlutterwave(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    webhookStripe(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getPayment(orderId: string): Promise<{
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
