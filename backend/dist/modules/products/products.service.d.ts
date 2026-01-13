import { PrismaService } from '../prisma.service';
export declare class ProductsService {
    private prisma;
    [x: string]: any;
    getByIds(idArray: string[]): Promise<{
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
    list(filters?: {
        sellerId?: string;
        category?: string;
    }): Promise<({
        seller: {
            id: string;
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
    })[]>;
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
    })[]>;
    getProductById(id: string): Promise<{
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
    updateProduct(productId: string, data: {
        title?: string;
        description?: string;
        price?: number;
        currency?: string;
        imageUrl?: string;
        category?: string;
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
    updateInventory(productId: string, quantity: number): Promise<{
        id: string;
        updatedAt: Date;
        productId: string;
        quantity: number;
    }>;
    deleteProduct(productId: string): Promise<{
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
    recordProductView(userId: string, productId: string): Promise<{
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
}
