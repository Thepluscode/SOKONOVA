import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { StorefrontService } from './storefront.service';

@Controller('storefront')
export class StorefrontController {
  constructor(private readonly sf: StorefrontService) {}

  @Get('featured')
  getFeaturedSellers(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.sf.getFeaturedSellers(limitNum);
  }

  @Get('sellers')
  getAllSellers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.sf.getAllSellers(pageNum, limitNum);
  }

  @Get('seller/:id')
  async getSellerById(@Param('id') id: string) {
    const seller = await this.sf.getSellerById(id);
    if (!seller) {
      throw new NotFoundException('Seller not found');
    }
    return seller;
  }

  @Get(':handle/products')
  async getSellerProducts(
    @Param('handle') handle: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    const result = await this.sf.getSellerProducts(handle, pageNum, limitNum);
    if (!result) {
      throw new NotFoundException('Seller not found');
    }
    return result;
  }

  @Get(':handle/reviews')
  async getSellerReviews(
    @Param('handle') handle: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    const result = await this.sf.getSellerReviews(handle, pageNum, limitNum);
    if (!result) {
      throw new NotFoundException('Seller not found');
    }
    return result;
  }

  @Get(':handle')
  async getStorefrontByHandle(@Param('handle') handle: string) {
    const seller = await this.sf.getSellerByHandle(handle);
    if (!seller) {
      throw new NotFoundException('Seller not found');
    }
    return seller;
  }
}