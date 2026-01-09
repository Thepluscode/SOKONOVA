import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
export declare class SellerProductsController {
    private products;
    constructor(products: ProductsService);
    myProducts(sellerId: string): Promise<any>;
    createProduct(dto: CreateProductDto): Promise<{
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
    updateProduct(productId: string, dto: UpdateProductDto, sellerId: string): Promise<any>;
    updateInventory(productId: string, dto: UpdateInventoryDto, sellerId: string): Promise<any>;
}
