import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';
export declare class ReviewsController {
    private reviews;
    constructor(reviews: ReviewsService);
    create(body: CreateReviewDto): Promise<{
        orderItem: {
            product: {
                title: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            currency: string;
            orderId: string;
            sellerId: string;
            price: import("@prisma/client/runtime/library").Decimal;
            productId: string;
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
        };
        buyer: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sellerId: string;
        orderItemId: string;
        buyerId: string;
        rating: number;
        comment: string;
        isVisible: boolean;
    }>;
    listForSeller(handle: string): Promise<{
        seller: {
            id: string;
            handle: string;
            displayName: string;
            ratingAvg: number;
            ratingCount: number;
        };
        reviews: {
            id: string;
            createdAt: Date;
            buyer: {
                id: string;
                name: string;
                email: string;
            };
            rating: number;
            comment: string;
        }[];
    }>;
    hide(reviewId: string, body: ModerateReviewDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sellerId: string;
        orderItemId: string;
        buyerId: string;
        rating: number;
        comment: string;
        isVisible: boolean;
    }>;
}
