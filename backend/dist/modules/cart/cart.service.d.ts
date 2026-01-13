import { PrismaService } from '../prisma.service';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    getCart(cartId: string): Promise<{
        items: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            qty: number;
            cartId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        anonKey: string | null;
        version: number;
    }>;
    ensureCartForUser(userId?: string, anonKey?: string): Promise<{
        items: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            qty: number;
            cartId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        anonKey: string | null;
        version: number;
    }>;
    addItem(cartId: string, productId: string, qty: number): Promise<{
        items: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            qty: number;
            cartId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        anonKey: string | null;
        version: number;
    }>;
    removeItem(cartId: string, productId: string): Promise<{
        items: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            qty: number;
            cartId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        anonKey: string | null;
        version: number;
    }>;
    clear(cartId: string): Promise<{
        items: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            qty: number;
            cartId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        anonKey: string | null;
        version: number;
    }>;
}
