import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller()
export class ProductsSearchController {
  constructor(private products: ProductsService) {}

  // Absolute path fallback to ensure /products/search always resolves
  @Get('products/search')
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
}
