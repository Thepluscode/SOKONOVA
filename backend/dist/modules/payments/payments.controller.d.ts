import { Request, Response } from 'express';
import { PaymentsService } from './payments.service';
import { CreateIntentDto } from './dto/create-intent.dto';
export declare class PaymentsController {
    private payments;
    constructor(payments: PaymentsService);
    createIntent(dto: CreateIntentDto): Promise<{
        orderId: string;
        provider: "stripe" | "flutterwave" | "paystack";
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
