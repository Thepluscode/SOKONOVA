import { Role } from '@prisma/client';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';
export declare class ReviewsController {
    private reviews;
    constructor(reviews: ReviewsService);
    create(body: CreateReviewDto, user: {
        id: string;
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
    createAlias(body: CreateReviewDto, user: {
        id: string;
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
    listForSeller(handle: string): Promise<({
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
    getProductReviews(productId: string, page?: string, limit?: string): Promise<{
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
    getUserReviews(userId: string, user: {
        id: string;
        role: Role;
    }, page?: string, limit?: string): Promise<{
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
    getPendingReviews(page?: string, limit?: string): Promise<{
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
    update(id: string, body: {
        buyerId?: string;
        rating?: number;
        comment?: string;
    }, user: {
        id: string;
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
    delete(id: string, body: {
        buyerId?: string;
    }, user: {
        id: string;
    }): Promise<{
        message: string;
    }>;
    hide(reviewId: string, body: ModerateReviewDto): Promise<{
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
}
