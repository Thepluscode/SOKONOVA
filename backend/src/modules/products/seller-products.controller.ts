import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

/**
 * SellerProductsController
 *
 * Seller-scoped product management endpoints
 * All operations verify ownership before execution
 *
 * In production, add authentication guards:
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Roles('SELLER', 'ADMIN')
 *
 * And use @CurrentUser() decorator instead of @Query('sellerId')
 */
@Controller('seller/products')
export class SellerProductsController {
  constructor(private products: ProductsService) {}

  /**
   * List all products for a seller
   *
   * GET /seller/products?sellerId=clx123
   *
   * Returns products with inventory and order information
   *
   * TODO: In production, extract sellerId from JWT:
   * @Get()
   * async myProducts(@CurrentUser() user: User) {
   *   return this.products.sellerList(user.id);
   * }
   */
  @Get()
  async myProducts(@Query('sellerId') sellerId: string) {
    return this.products.sellerList(sellerId);
  }

  /**
   * Create a new product
   *
   * POST /seller/products
   * {
   *   "sellerId": "clx123",
   *   "title": "New Product",
   *   "description": "Product description",
   *   "price": 49.99,
   *   "currency": "USD",
   *   "imageUrl": "https://..."
   * }
   *
   * TODO: In production, set sellerId from JWT:
   * dto.sellerId = user.id;
   */
  @Post()
  async createProduct(@Body() dto: CreateProductDto) {
    return this.products.create(dto);
  }

  /**
   * Update product details
   *
   * PATCH /seller/products/:productId?sellerId=clx123
   * {
   *   "title": "Updated Title",
   *   "price": 59.99
   * }
   *
   * Verifies seller owns the product before updating
   */
  @Patch(':productId')
  async updateProduct(
    @Param('productId') productId: string,
    @Body() dto: UpdateProductDto,
    @Query('sellerId') sellerId: string,
  ) {
    return this.products.sellerUpdate(sellerId, productId, dto);
  }

  /**
   * Update product inventory
   *
   * PATCH /seller/products/:productId/inventory?sellerId=clx123
   * {
   *   "quantity": 150
   * }
   *
   * Verifies seller owns the product before updating inventory
   */
  @Patch(':productId/inventory')
  async updateInventory(
    @Param('productId') productId: string,
    @Body() dto: UpdateInventoryDto,
    @Query('sellerId') sellerId: string,
  ) {
    return this.products.sellerUpdateInventory(sellerId, productId, dto.quantity);
  }

  /**
   * Delete a product (soft delete or hard delete)
   *
   * DELETE /seller/products/:productId?sellerId=clx123
   *
   * TODO: Implement soft delete in ProductsService:
   * - Add 'deleted' or 'active' boolean field to Product model
   * - Update sellerDelete() to set deleted=true instead of removing record
   * - Filter deleted products from all queries
   *
   * For now, this endpoint is commented out until delete logic is implemented
   */
  // @Delete(':productId')
  // async deleteProduct(
  //   @Param('productId') productId: string,
  //   @Query('sellerId') sellerId: string,
  // ) {
  //   return this.products.sellerDelete(sellerId, productId);
  // }
}
