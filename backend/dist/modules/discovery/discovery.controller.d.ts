import { DiscoveryService } from './discovery.service';
export declare class DiscoveryController {
    private disc;
    constructor(disc: DiscoveryService);
    highlights(): Promise<{
        trendingProducts: ({
            _count: {
                views: number;
            };
            seller: {
                shopName: string;
                ratingAvg: number;
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
        featuredSellers: ({
            _count: {
                products: number;
            };
        } & {
            id: string;
            email: string;
            password: string | null;
            name: string | null;
            role: string;
            city: string | null;
            country: string | null;
            phone: string | null;
            sellerHandle: string | null;
            shopName: string | null;
            shopLogoUrl: string | null;
            shopBannerUrl: string | null;
            shopBio: string | null;
            ratingAvg: number | null;
            ratingCount: number | null;
            bio: string | null;
            notifyEmail: boolean;
            notifySms: boolean;
            notifyPush: boolean;
            timezone: string | null;
            quietHoursStart: number | null;
            quietHoursEnd: number | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        newArrivals: ({
            seller: {
                shopName: string;
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
        communityStories: ({
            user: {
                name: string;
                shopName: string;
            };
            product: {
                title: string;
                imageUrl: string;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            imageUrl: string | null;
            userId: string;
            content: string;
        })[];
    }>;
    personalized(userId: string): Promise<{
        recommendedForYou: {
            category: string;
            products: ({
                _count: {
                    views: number;
                };
                seller: {
                    shopName: string;
                    ratingAvg: number;
                    ratingCount: number;
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
        }[];
        trendingInYourCity: {
            city: string;
            categories: string[];
        };
        becauseYouViewed: ({
            _count: {
                views: number;
            };
            seller: {
                shopName: string;
                ratingAvg: number;
                ratingCount: number;
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
        popularInYourArea: ({
            _count: {
                products: number;
            };
        } & {
            id: string;
            email: string;
            password: string | null;
            name: string | null;
            role: string;
            city: string | null;
            country: string | null;
            phone: string | null;
            sellerHandle: string | null;
            shopName: string | null;
            shopLogoUrl: string | null;
            shopBannerUrl: string | null;
            shopBio: string | null;
            ratingAvg: number | null;
            ratingCount: number | null;
            bio: string | null;
            notifyEmail: boolean;
            notifySms: boolean;
            notifyPush: boolean;
            timezone: string | null;
            quietHoursStart: number | null;
            quietHoursEnd: number | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    search(q?: string, category?: string, minPrice?: string, maxPrice?: string, rating?: string, inStock?: string, country?: string, sellerId?: string, sort?: string, page?: string, limit?: string): Promise<{
        items: ({
            _count: {
                views: number;
            };
            seller: {
                country: string;
                shopName: string;
                ratingAvg: number;
                ratingCount: number;
            };
            inventory: {
                quantity: number;
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
    byCategory(slug: string): Promise<{
        sellers: ({
            _count: {
                products: number;
            };
        } & {
            id: string;
            email: string;
            password: string | null;
            name: string | null;
            role: string;
            city: string | null;
            country: string | null;
            phone: string | null;
            sellerHandle: string | null;
            shopName: string | null;
            shopLogoUrl: string | null;
            shopBannerUrl: string | null;
            shopBio: string | null;
            ratingAvg: number | null;
            ratingCount: number | null;
            bio: string | null;
            notifyEmail: boolean;
            notifySms: boolean;
            notifyPush: boolean;
            timezone: string | null;
            quietHoursStart: number | null;
            quietHoursEnd: number | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        products: ({
            _count: {
                views: number;
            };
            seller: {
                shopName: string;
                ratingAvg: number;
                ratingCount: number;
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
    }>;
    byRegion(regionSlug: string): Promise<{
        sellers: ({
            _count: {
                products: number;
            };
        } & {
            id: string;
            email: string;
            password: string | null;
            name: string | null;
            role: string;
            city: string | null;
            country: string | null;
            phone: string | null;
            sellerHandle: string | null;
            shopName: string | null;
            shopLogoUrl: string | null;
            shopBannerUrl: string | null;
            shopBio: string | null;
            ratingAvg: number | null;
            ratingCount: number | null;
            bio: string | null;
            notifyEmail: boolean;
            notifySms: boolean;
            notifyPush: boolean;
            timezone: string | null;
            quietHoursStart: number | null;
            quietHoursEnd: number | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        products: ({
            _count: {
                views: number;
            };
            seller: {
                country: string;
                shopName: string;
                ratingAvg: number;
                ratingCount: number;
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
    }>;
}
