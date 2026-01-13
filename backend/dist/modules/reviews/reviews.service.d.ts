import { PrismaService } from '../prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ModerateReviewDto } from './dto/moderate-review.dto';
export declare class ReviewsService {
    private prisma;
    private notifications;
    private readonly logger;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    createReview(data: {
        orderItemId: string;
        buyerId: string;
        sellerId?: string;
        productId?: string;
        rating: number;
        comment: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        sellerId: string;
        orderItemId: string;
        buyerId: string;
        rating: number;
        comment: string;
        isVisible: boolean;
    }>;
    getSellerReviews(handle: string, limit?: number): Promise<({
        orderItem: {
            product: {
                title: string;
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
        };
        buyer: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        sellerId: string;
        orderItemId: string;
        buyerId: string;
        rating: number;
        comment: string;
        isVisible: boolean;
    })[]>;
    listForSellerHandle(handle: string, limit?: number): Promise<({
        orderItem: {
            product: {
                title: string;
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
        };
        buyer: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        sellerId: string;
        orderItemId: string;
        buyerId: string;
        rating: number;
        comment: string;
        isVisible: boolean;
    })[]>;
    hideReview(id: string, body?: ModerateReviewDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        sellerId: string;
        orderItemId: string;
        buyerId: string;
        rating: number;
        comment: string;
        isVisible: boolean;
    }>;
    getProductReviews(productId: string, page?: number, limit?: number): Promise<{
        reviews: ({
            buyer: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            sellerId: string;
            orderItemId: string;
            buyerId: string;
            rating: number;
            comment: string;
            isVisible: boolean;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getProductReviewsSummary(productId: string): Promise<{
        averageRating: number;
        totalReviews: number;
        ratingDistribution: {
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
        };
    }>;
    updateReview(id: string, buyerId: string, data: {
        rating?: number;
        comment?: string;
    }): Promise<{
        product: {
            id: string;
            title: string;
        };
        buyer: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        sellerId: string;
        orderItemId: string;
        buyerId: string;
        rating: number;
        comment: string;
        isVisible: boolean;
    }>;
    deleteReview(id: string, buyerId: string): Promise<{
        message: string;
    }>;
    getUserReviews(userId: string, page?: number, limit?: number): Promise<{
        reviews: ({
            product: {
                id: string;
                title: string;
                imageUrl: string;
            };
            seller: {
                id: string;
                name: string;
                sellerHandle: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            sellerId: string;
            orderItemId: string;
            buyerId: string;
            rating: number;
            comment: string;
            isVisible: boolean;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getPendingReviews(page?: number, limit?: number): Promise<{
        reviews: ({
            product: {
                id: string;
                title: string;
                imageUrl: string;
            };
            seller: {
                id: string;
                name: string;
                sellerHandle: string;
            };
            buyer: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            sellerId: string;
            orderItemId: string;
            buyerId: string;
            rating: number;
            comment: string;
            isVisible: boolean;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
