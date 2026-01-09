import { PrismaService } from '../prisma.service';
export declare class ProductsService {
    private prisma;
    [x: string]: any;
    getByIds(idArray: string[]): Promise<{
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
    }[]>;
    list(filters?: {
        sellerId?: string;
        category?: string;
    }): Promise<({
        seller: {
            id: string;
            ratingAvg: number;
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
    })[]>;
    getById(id: string): Promise<{
        seller: {
            id: string;
            ratingAvg: number;
            ratingCount: number;
            shopName: string;
            shopLogoUrl: string;
        };
        inventory: {
            id: string;
            updatedAt: Date;
            productId: string;
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
    }>;
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
    }>;
    update(id: string, body: {
        title?: string;
        description?: string;
        price?: number;
        currency?: string;
        imageUrl?: string;
        category?: string;
    }): Promise<{
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
    }>;
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
    }>;
    getSellerProducts(sellerId: string): Promise<({
        inventory: {
            id: string;
            updatedAt: Date;
            productId: string;
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
    })[]>;
    getProductById(id: string): Promise<{
        seller: {
            id: string;
            ratingAvg: number;
            ratingCount: number;
            shopName: string;
            shopLogoUrl: string;
        };
        inventory: {
            id: string;
            updatedAt: Date;
            productId: string;
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
    }>;
    updateInventory(productId: string, quantity: number): Promise<{
        id: string;
        updatedAt: Date;
        productId: string;
        quantity: number;
    }>;
    deleteProduct(productId: string): Promise<{
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
    }>;
    recordProductView(userId: string, productId: string): Promise<{
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
    }>;
}
