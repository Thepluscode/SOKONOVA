import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    listForUser(userId: string): Promise<({
        items: ({
            product: {
                id: string;
                sellerId: string;
                title: string;
                description: string;
                price: import("@prisma/client/runtime/library").Decimal;
                currency: string;
                imageUrl: string | null;
                category: string | null;
                ratingAvg: number | null;
                ratingCount: number | null;
                viewCount: number;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            sellerId: string;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            orderId: string;
            qty: number;
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
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentRef: string | null;
        shippingAdr: string | null;
        buyerName: string | null;
        buyerPhone: string | null;
        buyerEmail: string | null;
    })[]>;
    listForSeller(sellerId: string): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
        };
        items: ({
            product: {
                id: string;
                sellerId: string;
                title: string;
                description: string;
                price: import("@prisma/client/runtime/library").Decimal;
                currency: string;
                imageUrl: string | null;
                category: string | null;
                ratingAvg: number | null;
                ratingCount: number | null;
                viewCount: number;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            sellerId: string;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            orderId: string;
            qty: number;
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
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentRef: string | null;
        shippingAdr: string | null;
        buyerName: string | null;
        buyerPhone: string | null;
        buyerEmail: string | null;
    })[]>;
    findById(orderId: string): Promise<{
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
                sellerId: string;
                title: string;
                description: string;
                price: import("@prisma/client/runtime/library").Decimal;
                currency: string;
                imageUrl: string | null;
                category: string | null;
                ratingAvg: number | null;
                ratingCount: number | null;
                viewCount: number;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            sellerId: string;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            orderId: string;
            qty: number;
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
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentRef: string | null;
        shippingAdr: string | null;
        buyerName: string | null;
        buyerPhone: string | null;
        buyerEmail: string | null;
    }>;
    private calculateFee;
    createDirect(userId: string, items: Array<{
        productId: string;
        qty: number;
        price: number;
    }>, total: number, currency: string): Promise<{
        id: string;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentRef: string | null;
        shippingAdr: string | null;
        buyerName: string | null;
        buyerPhone: string | null;
        buyerEmail: string | null;
    }>;
    createFromCart(dto: CreateOrderDto, cartId: string): Promise<{
        id: string;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentRef: string | null;
        shippingAdr: string | null;
        buyerName: string | null;
        buyerPhone: string | null;
        buyerEmail: string | null;
    }>;
}
