import { StorefrontService } from './storefront.service';
export declare class StorefrontController {
    private sf;
    constructor(sf: StorefrontService);
    getByHandle(handle: string): Promise<{
        seller: {
            id: string;
            name: string;
            sellerHandle: string;
            shopName: string;
            shopLogoUrl: string;
            shopBannerUrl: string;
            shopBio: string;
            country: string;
            city: string;
            ratingAvg: number;
            ratingCount: number;
        };
        products: {
            id: string;
            title: string;
            createdAt: Date;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            description: string;
            imageUrl: string;
            inventory: {
                quantity: number;
            };
        }[];
    }>;
}
