import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, ForbiddenException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

/**
 * SellerProductsController
 *
 * Seller-scoped product management endpoints
 * All operations verify ownership before execution
 *
 * Authentication guards enforce seller/admin access.
 * Uses @CurrentUser() and optional sellerId query for admin operations.
 */
@Controller('seller/products')
export class SellerProductsController {
  constructor(private products: ProductsService) { }

  private resolveSellerId(
    user: { id: string; role: Role },
    sellerId?: string,
  ) {
    if (user.role === Role.ADMIN && sellerId) {
      return sellerId;
    }
    if (user.role !== Role.SELLER && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Seller access required');
    }
    return user.id;
  }

  /**
   * List all products for a seller
   *
   * GET /seller/products?sellerId=clx123
   *
   * Returns products with inventory and order information
   *
   * Uses authenticated seller ID by default; admins may supply sellerId.
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async myProducts(
    @Query('sellerId') sellerId: string | undefined,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    const targetSellerId = this.resolveSellerId(user, sellerId);
    return this.products.sellerList(targetSellerId);
  }

  /**
   * List archived (inactive) products for a seller
   *
   * GET /seller/products/archived?sellerId=clx123
   */
  @Get('archived')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async myArchivedProducts(
    @Query('sellerId') sellerId: string | undefined,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    const targetSellerId = this.resolveSellerId(user, sellerId);
    return this.products.sellerListArchived(targetSellerId);
  }

  /**
   * Create a new product
   *
   * POST /seller/products?sellerId=clx123
   * {
   *   "title": "New Product",
   *   "description": "Product description",
   *   "price": 49.99,
   *   "currency": "USD",
   *   "imageUrl": "https://..."
   * }
   *
   * Uses authenticated seller ID by default; admins may supply sellerId.
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async createProduct(
    @Body() dto: CreateProductDto,
    @Query('sellerId') sellerId: string | undefined,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    const targetSellerId = this.resolveSellerId(user, sellerId);
    return this.products.create({ ...dto, sellerId: targetSellerId });
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async updateProduct(
    @Param('productId') productId: string,
    @Body() dto: UpdateProductDto,
    @Query('sellerId') sellerId: string | undefined,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    const targetSellerId = this.resolveSellerId(user, sellerId);
    return this.products.sellerUpdate(targetSellerId, productId, dto);
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async updateInventory(
    @Param('productId') productId: string,
    @Body() dto: UpdateInventoryDto,
    @Query('sellerId') sellerId: string | undefined,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    const targetSellerId = this.resolveSellerId(user, sellerId);
    return this.products.sellerUpdateInventory(targetSellerId, productId, dto.quantity);
  }

  /**
   * Delete a product (soft delete or hard delete)
   *
   * DELETE /seller/products/:productId?sellerId=clx123
   *
   * Soft delete is implemented by marking Product.isActive = false.
   */
  @Delete(':productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async deleteProduct(
    @Param('productId') productId: string,
    @Query('sellerId') sellerId: string | undefined,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    const targetSellerId = this.resolveSellerId(user, sellerId);
    return this.products.sellerDelete(targetSellerId, productId);
  }

  /**
   * Restore archived product
   *
   * PATCH /seller/products/:productId/restore?sellerId=clx123
   */
  @Patch(':productId/restore')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async restoreProduct(
    @Param('productId') productId: string,
    @Query('sellerId') sellerId: string | undefined,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    const targetSellerId = this.resolveSellerId(user, sellerId);
    return this.products.sellerRestore(targetSellerId, productId);
  }
}
