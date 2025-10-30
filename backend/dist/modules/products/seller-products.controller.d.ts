import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
export declare class SellerProductsController {
    private products;
    constructor(products: ProductsService);
    myProducts(sellerId: string): Promise<({
        orderItems: ({
            order: {
                id: string;
                createdAt: Date;
                userId: string;
                status: import(".prisma/client").$Enums.OrderStatus;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            productId: string;
            qty: number;
            price: import("@prisma/client/runtime/library").Decimal;
            sellerId: string;
            grossAmount: import("@prisma/client/runtime/library").Decimal;
            feeAmount: import("@prisma/client/runtime/library").Decimal;
            netAmount: import("@prisma/client/runtime/library").Decimal;
            payoutStatus: import(".prisma/client").$Enums.PayoutStatus;
            payoutBatchId: string | null;
            paidAt: Date | null;
            currency: string;
            fulfillmentStatus: import(".prisma/client").$Enums.FulfillmentStatus;
            shippedAt: Date | null;
            deliveredAt: Date | null;
            trackingCode: string | null;
            carrier: string | null;
            deliveryProofUrl: string | null;
            notes: string | null;
        })[];
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
    createProduct(dto: CreateProductDto): Promise<{
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
    updateProduct(productId: string, dto: UpdateProductDto, sellerId: string): Promise<{
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
    updateInventory(productId: string, dto: UpdateInventoryDto, sellerId: string): Promise<{
        id: string;
        updatedAt: Date;
        productId: string;
        quantity: number;
    }>;
}
