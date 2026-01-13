import { ProductsService } from './products.service';
import { Role } from '@prisma/client';
export declare class ProductsController {
    private products;
    constructor(products: ProductsService);
    list(sellerId?: string, category?: string, ids?: string): Promise<{
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
    }[]>;
    getById(id: string): Promise<{
        _count: {
            views: number;
        };
        seller: {
            id: string;
            shopName: string;
            shopLogoUrl: string;
            ratingAvg: number;
            ratingCount: number;
        };
        inventory: {
            id: string;
            updatedAt: Date;
            productId: string;
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
    }>;
    create(body: {
        sellerId: string;
        title: string;
        description: string;
        price: number;
        currency?: string;
        imageUrl?: string;
        category?: string;
    }, user: {
        id: string;
        role: Role;
    }): Promise<{
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
    }>;
    update(id: string, body: {
        title?: string;
        description?: string;
        price?: number;
        currency?: string;
        imageUrl?: string;
        category?: string;
    }, user: {
        id: string;
        role: Role;
    }): Promise<{
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
    }>;
    updateInventory(id: string, body: {
        quantity: number;
    }, user: {
        id: string;
        role: Role;
    }): Promise<{
        id: string;
        updatedAt: Date;
        productId: string;
        quantity: number;
    }>;
}
