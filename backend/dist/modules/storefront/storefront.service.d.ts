import { PrismaService } from '../prisma.service';
export declare class StorefrontService {
    private prisma;
    constructor(prisma: PrismaService);
    getSellerByHandle(handle: string): Promise<{
        id: string;
        city: string;
        country: string;
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
        })[];
        _count: {
            products: number;
        };
    }>;
    getFeaturedSellers(limit?: number): Promise<{
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
        })[];
    }[]>;
    getAllSellers(page?: number, limit?: number): Promise<{
        sellers: {
            id: string;
            city: string;
            country: string;
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
        city: string;
        country: string;
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
        })[];
        _count: {
            products: number;
        };
    }>;
    getSellerProducts(handle: string, page?: number, limit?: number): Promise<{
        products: ({
            _count: {
                views: number;
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
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getSellerReviews(handle: string, page?: number, limit?: number): Promise<{
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
