import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__ProductClient<{
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
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    listAll(): import(".prisma/client").Prisma.PrismaPromise<({
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
    getById(id: string): import(".prisma/client").Prisma.Prisma__ProductClient<{
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
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
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
    sellerList(sellerId: string): Promise<({
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
    sellerUpdate(sellerId: string, productId: string, data: UpdateProductDto): Promise<{
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
    sellerUpdateInventory(sellerId: string, productId: string, quantity: number): Promise<{
        id: string;
        updatedAt: Date;
        productId: string;
        quantity: number;
    }>;
}
