import { CartService } from './cart.service';
import { CartAddDto } from './dto/cart-add.dto';
export declare class CartController {
    private cart;
    constructor(cart: CartService);
    getCart(userId?: string, anonKey?: string): Promise<{
        items: ({
            product: {
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
    add(dto: CartAddDto): Promise<{
        items: ({
            product: {
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
    remove(cartId: string, productId: string): Promise<{
        items: ({
            product: {
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
