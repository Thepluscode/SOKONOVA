import { PrismaService } from '../prisma.service';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    getCart(cartId: string): Promise<{
        items: ({
            product: {
                id: string;
                title: string;
                createdAt: Date;
                updatedAt: Date;
                price: import("@prisma/client/runtime/library").Decimal;
                sellerId: string;
                currency: string;
                description: string;
                imageUrl: string | null;
                category: string | null;
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
        userId: string | null;
        updatedAt: Date;
        anonKey: string | null;
    }>;
    ensureCartForUser(userId?: string, anonKey?: string): Promise<{
        items: ({
            product: {
                id: string;
                title: string;
                createdAt: Date;
                updatedAt: Date;
                price: import("@prisma/client/runtime/library").Decimal;
                sellerId: string;
                currency: string;
                description: string;
                imageUrl: string | null;
                category: string | null;
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
        userId: string | null;
        updatedAt: Date;
        anonKey: string | null;
    }>;
    addItem(cartId: string, productId: string, qty: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        qty: number;
        cartId: string;
    }>;
    removeItem(cartId: string, productId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    clear(cartId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
