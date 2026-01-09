import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

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

  // PUBLIC: get product by ID
  // GET /products/:id
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.products.getById(id);
  }

  // SELLER: create product
  // POST /products
  // TODO: Re-enable @UseGuards(JwtAuthGuard) after MVP testing
  @Post()
  // @UseGuards(JwtAuthGuard)
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
  ) {
    return this.products.create(body);
  }

  // SELLER: update product
  // PATCH /products/:id
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
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
  ) {
    return this.products.update(id, body);
  }

  // SELLER: update inventory
  // PATCH /products/:id/inventory
  @Patch(':id/inventory')
  @UseGuards(JwtAuthGuard)
  async updateInventory(
    @Param('id') id: string,
    @Body() body: { quantity: number },
  ) {
    return this.products.updateInventory(id, body.quantity);
  }
}