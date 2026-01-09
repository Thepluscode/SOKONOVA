import { PrismaService } from '../prisma.service';
export declare class DiscoveryService {
    private prisma;
    constructor(prisma: PrismaService);
    getDiscoveryHighlights(): Promise<{
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
        featuredSellers: ({
            _count: {
                products: number;
            };
        } & {
            id: string;
            phone: string | null;
            country: string | null;
            city: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            email: string;
            password: string | null;
            role: string;
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
        })[];
        newArrivals: ({
            seller: {
                shopName: string;
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
            userId: string;
            createdAt: Date;
            imageUrl: string | null;
            productId: string;
            content: string;
        })[];
    }>;
    getProductsByCategory(slug: string): Promise<({
        _count: {
            views: number;
        };
        seller: {
            shopName: string;
            ratingAvg: number;
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
    })[]>;
    getProductsByRegion(regionSlug: string): Promise<({
        _count: {
            views: number;
        };
        seller: {
            country: string;
            shopName: string;
            ratingAvg: number;
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
    })[]>;
    searchProducts(query: string): Promise<({
        _count: {
            views: number;
        };
        seller: {
            shopName: string;
            ratingAvg: number;
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
    })[]>;
    getCategoryPage(slug: string): Promise<{
        sellers: ({
            _count: {
                products: number;
            };
        } & {
            id: string;
            phone: string | null;
            country: string | null;
            city: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            email: string;
            password: string | null;
            role: string;
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
    }>;
    getRegionPage(regionSlug: string): Promise<{
        sellers: ({
            _count: {
                products: number;
            };
        } & {
            id: string;
            phone: string | null;
            country: string | null;
            city: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            email: string;
            password: string | null;
            role: string;
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
    }>;
    getPersonalizedDiscovery(userId: string): Promise<{
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
        popularInYourArea: ({
            _count: {
                products: number;
            };
        } & {
            id: string;
            phone: string | null;
            country: string | null;
            city: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            email: string;
            password: string | null;
            role: string;
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
        })[];
    }>;
    private getCollaborativeRecommendations;
    private getTrendingProducts;
}
