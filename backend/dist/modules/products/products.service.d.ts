import { PrismaService } from '../prisma.service';
export declare class ProductsService {
    private prisma;
    [x: string]: any;
    getByIds(idArray: string[]): void;
    list(arg0: {
        sellerId: string;
        category: string;
    }): void;
    getById(id: string): void;
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
    }>;
    update(id: string, body: {
        title?: string;
        description?: string;
        price?: number;
        currency?: string;
        imageUrl?: string;
        category?: string;
    }): void;
    constructor(prisma: PrismaService);
    createProduct(data: {
        sellerId: string;
        title: string;
        description: string;
        price: number;
        currency?: string;
        imageUrl?: string;
        category?: string;
    }): Promise<{
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
    }>;
    getSellerProducts(sellerId: string): Promise<({
        _count: {
            views: number;
        };
        inventory: {
            id: string;
            updatedAt: Date;
            productId: string;
            quantity: number;
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
    getProductById(id: string): Promise<{
        _count: {
            views: number;
        };
        inventory: {
            id: string;
            updatedAt: Date;
            productId: string;
            quantity: number;
        };
        seller: {
            id: string;
            shopName: string;
            shopLogoUrl: string;
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
    }>;
    updateProduct(productId: string, data: {
        title?: string;
        description?: string;
        price?: number;
        currency?: string;
        imageUrl?: string;
        category?: string;
    }): Promise<{
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
    }>;
    updateInventory(productId: string, quantity: number): Promise<{
        id: string;
        updatedAt: Date;
        productId: string;
        quantity: number;
    }>;
    deleteProduct(productId: string): Promise<{
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
    }>;
    recordProductView(userId: string, productId: string): Promise<{
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
    }>;
}
