import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('products')
export class ProductsController {
  constructor(private products: ProductsService) {}

  // PUBLIC: list all products (with optional filters)
  // GET /products?sellerId=...&category=...
  @Get()
  async list(
    @Query('sellerId') sellerId?: string,
    @Query('category') category?: string,
    @Query('ids') ids?: string,
  ) {
    // If ids parameter is provided, fetch specific products
    if (ids) {
      const idArray = ids.split(',').map(id => id.trim());
      return this.products.getByIds(idArray);
    }
    
    // Otherwise, list products with filters
    return this.products.list({ sellerId, category });
  }

  // PUBLIC: simple product search
  // GET /products/search?q=...&category=...&limit=...
  @Get('search')
  async search(
    @Query('q') q?: string,
    @Query('category') category?: string,
    @Query('limit') limit?: string,
  ) {
    if (!q?.trim()) {
      return [];
    }

    const take = Math.min(parseInt(limit || '20', 10) || 20, 50);
    return this.products.search(q.trim(), { category, limit: take });
  }

  // PUBLIC: get product by ID
  // GET /products/:id
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.products.getById(id);
  }

  // SELLER: create product
  // POST /products
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async create(
    @Body()
    body: {
      sellerId: string;
      title: string;
      description: string;
      price: number;
      currency?: string;
      imageUrl?: string;
      category?: string;
    },
    @CurrentUser() user: { id: string; role: Role },
  ) {
    const sellerId =
      user.role === Role.ADMIN && body.sellerId ? body.sellerId : user.id;

    return this.products.create({ ...body, sellerId });
  }

  // SELLER: update product
  // PATCH /products/:id
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      description?: string;
      price?: number;
      currency?: string;
      imageUrl?: string;
      category?: string;
    },
    @CurrentUser() user: { id: string; role: Role },
  ) {
    const product = await this.products.getById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (user.role !== Role.ADMIN && product.sellerId !== user.id) {
      throw new ForbiddenException('You can only update your own products');
    }

    return this.products.update(id, body);
  }

  // SELLER: update inventory
  // PATCH /products/:id/inventory
  @Patch(':id/inventory')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async updateInventory(
    @Param('id') id: string,
    @Body() body: { quantity: number },
    @CurrentUser() user: { id: string; role: Role },
  ) {
    const product = await this.products.getById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (user.role !== Role.ADMIN && product.sellerId !== user.id) {
      throw new ForbiddenException('You can only update your own products');
    }

    return this.products.updateInventory(id, body.quantity);
  }
}
