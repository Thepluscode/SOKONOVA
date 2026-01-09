import { StorefrontService } from './storefront.service';
export declare class StorefrontController {
    private readonly sf;
    constructor(sf: StorefrontService);
    getFeaturedSellers(limit?: string): Promise<{
        id: string;
        country: string;
        shopName: string;
        shopLogoUrl: string;
        ratingAvg: number;
        ratingCount: number;
        products: ({
            _count: {
                views: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            ratingAvg: number | null;
            ratingCount: number | null;
            currency: string;
            sellerId: string;
            title: string;
            description: string;
            price: import("@prisma/client/runtime/library").Decimal;
            imageUrl: string | null;
            category: string | null;
            viewCount: number;
        })[];
    }[]>;
    getAllSellers(page?: string, limit?: string): Promise<{
        sellers: {
            id: string;
            country: string;
            city: string;
            sellerHandle: string;
            shopName: string;
            shopLogoUrl: string;
            ratingAvg: number;
            ratingCount: number;
            _count: {
                products: number;
            };
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getSellerById(id: string): Promise<{
        id: string;
        country: string;
        city: string;
        sellerHandle: string;
        shopName: string;
        shopLogoUrl: string;
        shopBannerUrl: string;
        ratingAvg: number;
        ratingCount: number;
        bio: string;
        products: ({
            _count: {
                views: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            ratingAvg: number | null;
            ratingCount: number | null;
            currency: string;
            sellerId: string;
            title: string;
            description: string;
            price: import("@prisma/client/runtime/library").Decimal;
            imageUrl: string | null;
            category: string | null;
            viewCount: number;
        })[];
        _count: {
            products: number;
        };
    }>;
    getSellerProducts(handle: string, page?: string, limit?: string): Promise<{
        products: ({
            _count: {
                views: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            ratingAvg: number | null;
            ratingCount: number | null;
            currency: string;
            sellerId: string;
            title: string;
            description: string;
            price: import("@prisma/client/runtime/library").Decimal;
            imageUrl: string | null;
            category: string | null;
            viewCount: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getSellerReviews(handle: string, page?: string, limit?: string): Promise<{
        reviews: ({
            product: {
                id: string;
                title: string;
                imageUrl: string;
            };
            buyer: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sellerId: string;
            orderItemId: string;
            buyerId: string;
            productId: string;
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
    getStorefrontByHandle(handle: string): Promise<{
        id: string;
        country: string;
        city: string;
        shopName: string;
        shopLogoUrl: string;
        shopBannerUrl: string;
        ratingAvg: number;
        ratingCount: number;
        bio: string;
        products: ({
            _count: {
                views: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            ratingAvg: number | null;
            ratingCount: number | null;
            currency: string;
            sellerId: string;
            title: string;
            description: string;
            price: import("@prisma/client/runtime/library").Decimal;
            imageUrl: string | null;
            category: string | null;
            viewCount: number;
        })[];
        _count: {
            products: number;
        };
    }>;
}
