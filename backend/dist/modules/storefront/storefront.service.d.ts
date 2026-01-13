import { PrismaService } from '../prisma.service';
export declare class StorefrontService {
    private prisma;
    constructor(prisma: PrismaService);
    getSellerByHandle(handle: string): Promise<{
        id: string;
        ratingAvg: number;
        ratingCount: number;
        _count: {
            products: number;
        };
        city: string;
        country: string;
        shopName: string;
        shopLogoUrl: string;
        shopBannerUrl: string;
        bio: string;
        products: ({
            _count: {
                views: number;
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
        })[];
    }>;
    getFeaturedSellers(limit?: number): Promise<{
        id: string;
        ratingAvg: number;
        ratingCount: number;
        country: string;
        shopName: string;
        shopLogoUrl: string;
        products: ({
            _count: {
                views: number;
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
        })[];
    }[]>;
    getAllSellers(page?: number, limit?: number): Promise<{
        sellers: {
            id: string;
            ratingAvg: number;
            ratingCount: number;
            _count: {
                products: number;
            };
            city: string;
            country: string;
            sellerHandle: string;
            shopName: string;
            shopLogoUrl: string;
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
        ratingAvg: number;
        ratingCount: number;
        _count: {
            products: number;
        };
        city: string;
        country: string;
        sellerHandle: string;
        shopName: string;
        shopLogoUrl: string;
        shopBannerUrl: string;
        bio: string;
        products: ({
            _count: {
                views: number;
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
        })[];
    }>;
    getSellerProducts(handle: string, page?: number, limit?: number): Promise<{
        products: ({
            _count: {
                views: number;
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
            sellerId: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            rating: number;
            comment: string;
            isVisible: boolean;
            orderItemId: string;
            buyerId: string;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
