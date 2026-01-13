import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
export declare class SellerProductsController {
    private products;
    constructor(products: ProductsService);
    myProducts(sellerId: string): Promise<any>;
    createProduct(dto: CreateProductDto, sellerId: string): Promise<{
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
    updateProduct(productId: string, dto: UpdateProductDto, sellerId: string): Promise<any>;
    updateInventory(productId: string, dto: UpdateInventoryDto, sellerId: string): Promise<any>;
}
