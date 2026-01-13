import { Role } from '@prisma/client';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private orders;
    constructor(orders: OrdersService);
    listMine(userId: string): Promise<({
        items: ({
            product: {
                id: string;
                ratingAvg: number | null;
                ratingCount: number | null;
                createdAt: Date;
                updatedAt: Date;
                price: import("@prisma/client/runtime/library").Decimal;
                sellerId: string;
                currency: string;
                title: string;
                description: string;
                imageUrl: string | null;
                category: string | null;
                viewCount: number;
            };
        } & {
            id: string;
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
            currency: string;
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
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: string;
        total: import("@prisma/client/runtime/library").Decimal;
        paymentRef: string | null;
        shippingAdr: string | null;
        buyerName: string | null;
        buyerPhone: string | null;
        buyerEmail: string | null;
    })[]>;
    listSeller(sellerId: string | undefined, user: {
        id: string;
        role: Role;
    }): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
        };
        items: ({
            product: {
                id: string;
                ratingAvg: number | null;
                ratingCount: number | null;
                createdAt: Date;
                updatedAt: Date;
                price: import("@prisma/client/runtime/library").Decimal;
                sellerId: string;
                currency: string;
                title: string;
                description: string;
                imageUrl: string | null;
                category: string | null;
                viewCount: number;
            };
        } & {
            id: string;
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
            currency: string;
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
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: string;
        total: import("@prisma/client/runtime/library").Decimal;
        paymentRef: string | null;
        shippingAdr: string | null;
        buyerName: string | null;
        buyerPhone: string | null;
        buyerEmail: string | null;
    })[]>;
    listForUser(userId: string): Promise<({
        items: ({
            product: {
                id: string;
                ratingAvg: number | null;
                ratingCount: number | null;
                createdAt: Date;
                updatedAt: Date;
                price: import("@prisma/client/runtime/library").Decimal;
                sellerId: string;
                currency: string;
                title: string;
                description: string;
                imageUrl: string | null;
                category: string | null;
                viewCount: number;
            };
        } & {
            id: string;
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
            currency: string;
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
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: string;
        total: import("@prisma/client/runtime/library").Decimal;
        paymentRef: string | null;
        shippingAdr: string | null;
        buyerName: string | null;
        buyerPhone: string | null;
        buyerEmail: string | null;
    })[]>;
    findById(id: string, user: {
        id: string;
        role: Role;
    }): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
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
                ratingAvg: number | null;
                ratingCount: number | null;
                createdAt: Date;
                updatedAt: Date;
                price: import("@prisma/client/runtime/library").Decimal;
                sellerId: string;
                currency: string;
                title: string;
                description: string;
                imageUrl: string | null;
                category: string | null;
                viewCount: number;
            };
        } & {
            id: string;
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
            currency: string;
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
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: string;
        total: import("@prisma/client/runtime/library").Decimal;
        paymentRef: string | null;
        shippingAdr: string | null;
        buyerName: string | null;
        buyerPhone: string | null;
        buyerEmail: string | null;
    }>;
    createFromCart(dto: CreateOrderDto, cartId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: string;
        total: import("@prisma/client/runtime/library").Decimal;
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
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: string;
        total: import("@prisma/client/runtime/library").Decimal;
        paymentRef: string | null;
        shippingAdr: string | null;
        buyerName: string | null;
        buyerPhone: string | null;
        buyerEmail: string | null;
    }>;
}
