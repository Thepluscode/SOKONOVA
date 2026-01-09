import { ProductsService } from './products.service';
export declare class ProductsController {
    private products;
    constructor(products: ProductsService);
    list(sellerId?: string, category?: string, ids?: string): Promise<void>;
    getById(id: string): Promise<void>;
    create(body: {
        sellerId: string;
        title: string;
        description: string;
        price: number;
        currency?: string;
        imageUrl?: string;
        category?: string;
    }): Promise<{
        id: string;
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
        sellerId: string;
    }>;
    update(id: string, body: {
        title?: string;
        description?: string;
        price?: number;
        currency?: string;
        imageUrl?: string;
        category?: string;
    }): Promise<void>;
    updateInventory(id: string, body: {
        quantity: number;
    }): Promise<{
        id: string;
        updatedAt: Date;
        productId: string;
        quantity: number;
    }>;
}
