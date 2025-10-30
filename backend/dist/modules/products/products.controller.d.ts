import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsController {
    private products;
    constructor(products: ProductsService);
    list(): Promise<({
        seller: {
            id: string;
            name: string;
        };
        inventory: {
            id: string;
            updatedAt: Date;
            productId: string;
            quantity: number;
        };
    } & {
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
    })[]>;
    get(id: string): Promise<{
        seller: {
            id: string;
            name: string;
        };
        inventory: {
            id: string;
            updatedAt: Date;
            productId: string;
            quantity: number;
        };
    } & {
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
    }>;
    create(dto: CreateProductDto): Promise<{
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
    }>;
}
