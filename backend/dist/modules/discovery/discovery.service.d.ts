import { PrismaService } from '../prisma.service';
export declare class DiscoveryService {
    private prisma;
    constructor(prisma: PrismaService);
    getHighlights(): Promise<{
        categories: {
            sellers: any[];
            slug: string;
            label: string;
        }[];
        regions: {
            sellers: {
                id: string;
                sellerHandle: string;
                shopName: string;
                shopLogoUrl: string;
                country: string;
                city: string;
                ratingAvg: number;
                ratingCount: number;
            }[];
            slug: string;
            label: string;
            city: string;
        }[];
    }>;
    getCategoryPage(slug: string): Promise<{
        slug: string;
        sellers: any[];
        products: {
            id: string;
            title: string;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            seller: {
                sellerHandle: string;
                shopName: string;
                country: string;
                city: string;
                ratingAvg: number;
                ratingCount: number;
            };
            imageUrl: string;
        }[];
    }>;
    getRegionPage(regionSlug: string): Promise<{
        region: {
            slug: string;
            label: string;
        };
        sellers: any[];
        products: any[];
    } | {
        region: {
            slug: string;
            label: string;
            city: string;
        };
        sellers: {
            id: string;
            sellerHandle: string;
            shopName: string;
            shopLogoUrl: string;
            country: string;
            city: string;
            ratingAvg: number;
            ratingCount: number;
        }[];
        products: {
            id: string;
            title: string;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            seller: {
                sellerHandle: string;
                shopName: string;
                country: string;
                city: string;
                ratingAvg: number;
                ratingCount: number;
            };
            imageUrl: string;
            category: string;
        }[];
    }>;
    private topSellersForCategory;
    private topSellersForRegion;
}
