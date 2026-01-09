import { CartService } from './cart.service';
import { CartAddDto } from './dto/cart-add.dto';
export declare class CartController {
    private cart;
    constructor(cart: CartService);
    getCart(userId?: string, anonKey?: string): Promise<{
        items: ({
            product: {
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
        userId: string | null;
        createdAt: Date;
        updatedAt: Date;
        anonKey: string | null;
        version: number;
    }>;
    add(dto: CartAddDto): Promise<{
        items: ({
            product: {
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
        userId: string | null;
        createdAt: Date;
        updatedAt: Date;
        anonKey: string | null;
        version: number;
    }>;
    remove(cartId: string, productId: string): Promise<{
        items: ({
            product: {
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
        userId: string | null;
        createdAt: Date;
        updatedAt: Date;
        anonKey: string | null;
        version: number;
    }>;
    clear(cartId: string): Promise<{
        items: ({
            product: {
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
        userId: string | null;
        createdAt: Date;
        updatedAt: Date;
        anonKey: string | null;
        version: number;
    }>;
}
