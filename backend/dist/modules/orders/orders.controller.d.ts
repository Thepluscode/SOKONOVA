import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private orders;
    constructor(orders: OrdersService);
    listForUser(userId: string): Promise<({
        items: ({
            product: {
                id: string;
                currency: string;
                createdAt: Date;
                updatedAt: Date;
                price: import("@prisma/client/runtime/library").Decimal;
                sellerId: string;
                title: string;
                description: string;
                imageUrl: string | null;
                category: string | null;
                ratingAvg: number | null;
                ratingCount: number | null;
                viewCount: number;
            };
        } & {
            id: string;
            currency: string;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            productId: string;
            qty: number;
            price: import("@prisma/client/runtime/library").Decimal;
            sellerId: string;
            grossAmount: import("@prisma/client/runtime/library").Decimal;
            feeAmount: import("@prisma/client/runtime/library").Decimal;
            netAmount: import("@prisma/client/runtime/library").Decimal;
            payoutStatus: import(".prisma/client").$Enums.PayoutStatus;
            payoutBatchId: string | null;
            paidAt: Date | null;
            fulfillmentStatus: import(".prisma/client").$Enums.FulfillmentStatus;
            shippedAt: Date | null;
            deliveredAt: Date | null;
            trackingCode: string | null;
            carrier: string | null;
            deliveryProofUrl: string | null;
            notes: string | null;
            exceptionNotified: boolean | null;
        })[];
    } & {
        id: string;
        userId: string;
        total: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        paymentRef: string | null;
        shippingAdr: string | null;
        buyerName: string | null;
        buyerPhone: string | null;
        buyerEmail: string | null;
    })[]>;
    findById(id: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
        items: ({
            product: {
                seller: {
                    id: string;
                    name: string;
                    sellerHandle: string;
                    shopLogoUrl: string;
                };
            } & {
                id: string;
                currency: string;
                createdAt: Date;
                updatedAt: Date;
                price: import("@prisma/client/runtime/library").Decimal;
                sellerId: string;
                title: string;
                description: string;
                imageUrl: string | null;
                category: string | null;
                ratingAvg: number | null;
                ratingCount: number | null;
                viewCount: number;
            };
        } & {
            id: string;
            currency: string;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            productId: string;
            qty: number;
            price: import("@prisma/client/runtime/library").Decimal;
            sellerId: string;
            grossAmount: import("@prisma/client/runtime/library").Decimal;
            feeAmount: import("@prisma/client/runtime/library").Decimal;
            netAmount: import("@prisma/client/runtime/library").Decimal;
            payoutStatus: import(".prisma/client").$Enums.PayoutStatus;
            payoutBatchId: string | null;
            paidAt: Date | null;
            fulfillmentStatus: import(".prisma/client").$Enums.FulfillmentStatus;
            shippedAt: Date | null;
            deliveredAt: Date | null;
            trackingCode: string | null;
            carrier: string | null;
            deliveryProofUrl: string | null;
            notes: string | null;
            exceptionNotified: boolean | null;
        })[];
    } & {
        id: string;
        userId: string;
        total: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        paymentRef: string | null;
        shippingAdr: string | null;
        buyerName: string | null;
        buyerPhone: string | null;
        buyerEmail: string | null;
    }>;
    createFromCart(dto: CreateOrderDto, cartId: string): Promise<{
        id: string;
        userId: string;
        total: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        paymentRef: string | null;
        shippingAdr: string | null;
        buyerName: string | null;
        buyerPhone: string | null;
        buyerEmail: string | null;
    }>;
    createDirect(body: {
        userId: string;
        items: Array<{
            productId: string;
            qty: number;
            price: number;
        }>;
        total: number;
        currency: string;
    }): Promise<{
        id: string;
        userId: string;
        total: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        paymentRef: string | null;
        shippingAdr: string | null;
        buyerName: string | null;
        buyerPhone: string | null;
        buyerEmail: string | null;
    }>;
}
