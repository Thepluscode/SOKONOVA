import { DiscoveryService } from './discovery.service';
export declare class DiscoveryController {
    private disc;
    constructor(disc: DiscoveryService);
    highlights(): Promise<{
        trendingProducts: ({
            seller: {
                ratingAvg: number;
                shopName: string;
            };
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
        featuredSellers: ({
            _count: {
                products: number;
            };
        } & {
            id: string;
            ratingAvg: number | null;
            ratingCount: number | null;
            createdAt: Date;
            updatedAt: Date;
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
            bio: string | null;
            notifyEmail: boolean;
            notifySms: boolean;
            notifyPush: boolean;
            timezone: string | null;
            quietHoursStart: number | null;
            quietHoursEnd: number | null;
        })[];
        newArrivals: ({
            seller: {
                shopName: string;
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
        communityStories: ({
            product: {
                title: string;
                imageUrl: string;
            };
            user: {
                name: string;
                shopName: string;
            };
        } & {
            id: string;
            imageUrl: string | null;
            createdAt: Date;
            userId: string;
            productId: string;
            content: string;
        })[];
    }>;
    personalized(userId: string): Promise<{
        recommendedForYou: {
            category: string;
            products: ({
                seller: {
                    ratingAvg: number;
                    ratingCount: number;
                    shopName: string;
                };
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
        }[];
        trendingInYourCity: {
            city: string;
            categories: string[];
        };
        becauseYouViewed: ({
            seller: {
                ratingAvg: number;
                ratingCount: number;
                shopName: string;
            };
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
        popularInYourArea: ({
            _count: {
                products: number;
            };
        } & {
            id: string;
            ratingAvg: number | null;
            ratingCount: number | null;
            createdAt: Date;
            updatedAt: Date;
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
            bio: string | null;
            notifyEmail: boolean;
            notifySms: boolean;
            notifyPush: boolean;
            timezone: string | null;
            quietHoursStart: number | null;
            quietHoursEnd: number | null;
        })[];
    }>;
    search(q?: string, category?: string, minPrice?: string, maxPrice?: string, rating?: string, inStock?: string, country?: string, sellerId?: string, sort?: string, page?: string, limit?: string): Promise<{
        items: ({
            seller: {
                ratingAvg: number;
                ratingCount: number;
                country: string;
                shopName: string;
            };
            inventory: {
                quantity: number;
            };
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
    byCategory(slug: string): Promise<{
        sellers: ({
            _count: {
                products: number;
            };
        } & {
            id: string;
            ratingAvg: number | null;
            ratingCount: number | null;
            createdAt: Date;
            updatedAt: Date;
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
            bio: string | null;
            notifyEmail: boolean;
            notifySms: boolean;
            notifyPush: boolean;
            timezone: string | null;
            quietHoursStart: number | null;
            quietHoursEnd: number | null;
        })[];
        products: ({
            seller: {
                ratingAvg: number;
                ratingCount: number;
                shopName: string;
            };
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
    byRegion(regionSlug: string): Promise<{
        sellers: ({
            _count: {
                products: number;
            };
        } & {
            id: string;
            ratingAvg: number | null;
            ratingCount: number | null;
            createdAt: Date;
            updatedAt: Date;
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
            bio: string | null;
            notifyEmail: boolean;
            notifySms: boolean;
            notifyPush: boolean;
            timezone: string | null;
            quietHoursStart: number | null;
            quietHoursEnd: number | null;
        })[];
        products: ({
            seller: {
                ratingAvg: number;
                ratingCount: number;
                country: string;
                shopName: string;
            };
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
}
