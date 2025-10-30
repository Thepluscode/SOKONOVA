import { DiscoveryService } from './discovery.service';
export declare class DiscoveryController {
    private disc;
    constructor(disc: DiscoveryService);
    highlights(): Promise<{
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
    byCategory(slug: string): Promise<{
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
    byRegion(regionSlug: string): Promise<{
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
}
